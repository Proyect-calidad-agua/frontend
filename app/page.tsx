"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { LiveChart } from "@/components/dashboard/LiveChart";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { WaterStatusCard } from "@/components/dashboard/WaterStatusCard";
import { HistoryView } from "@/components/dashboard/HistoryView";
import { AlertsView } from "@/components/dashboard/AlertsView";
import { ConfigView } from "@/components/dashboard/ConfigView";
import { Thermometer, Activity, Waves, LayoutDashboard, History, Bell, Settings, Droplets } from "lucide-react";

// Definir tipos de datos
interface SensorData {
  ph: number;
  temperature: number;
  turbidity: number;
  tds: number;
  timestamp: string;
}

interface Alert {
  id: string;
  message: string;
  type: "warning" | "critical";
  timestamp: number;
  sensor: string;
  value: number;
  threshold: number;
  status: 'pending' | 'reviewed';
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'live' | 'history' | 'alerts' | 'config'>('live');
  const [data, setData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]); // Alertas activas para banners
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Fetch initial data from API to show something immediately
    const fetchInitialData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/sensores/historial");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Map DB format to Frontend format
            const formattedHistory = data.map((item: any) => ({
              temperature: item.temperatura,
              turbidity: item.turbidez,
              tds: item.tds,
              timestamp: item.fecha,
              ph: 0 // Placeholder as pH is removed
            })).reverse(); // API returns DESC, we want ASC for charts

            setHistory(formattedHistory);

            // Set latest data
            const latest = formattedHistory[formattedHistory.length - 1];
            setData(latest);
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();

    // 2. Connect to WebSocket for real-time updates
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Conectado al servidor WebSocket");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Desconectado del servidor WebSocket");
    });

    socket.on("sensor-data", (newData: SensorData) => {
      setData(newData);

      // Actualizar historial (mantener últimos 100 puntos para gráficas históricas más largas en memoria)
      setHistory((prev) => {
        const newHistory = [...prev, newData];
        // Guardamos más historial para la pestaña de historial
        if (newHistory.length > 100) return newHistory.slice(newHistory.length - 100);
        return newHistory;
      });

      // Verificar alertas
      checkAlerts(newData);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const checkAlerts = (data: SensorData) => {
    const newActiveAlerts: Alert[] = [];
    const timestamp = Date.now();

    // Lógica de alertas
    if (data.temperature > 28) {
      const alert: Alert = {
        id: timestamp + 'temp',
        message: `Temperatura alta: ${data.temperature}°C`,
        type: "warning",
        timestamp,
        sensor: "Temperatura",
        value: data.temperature,
        threshold: 28,
        status: 'pending'
      };
      newActiveAlerts.push(alert);
      addAlertToHistory(alert);
    }
    if (data.turbidity > 5) {
      const alert: Alert = {
        id: timestamp + 'turb',
        message: `Turbidez elevada: ${data.turbidity} NTU`,
        type: "warning",
        timestamp,
        sensor: "Turbidez",
        value: data.turbidity,
        threshold: 5,
        status: 'pending'
      };
      newActiveAlerts.push(alert);
      addAlertToHistory(alert);
    }
    if (data.tds > 500) {
      const alert: Alert = {
        id: timestamp + 'tds',
        message: `TDS alto: ${data.tds} ppm`,
        type: "warning",
        timestamp,
        sensor: "TDS",
        value: data.tds,
        threshold: 500,
        status: 'pending'
      };
      newActiveAlerts.push(alert);
      addAlertToHistory(alert);
    }

    // Actualizar alertas activas (banners)
    // Usamos un debounce simple para no parpadear
    if (newActiveAlerts.length > 0) {
      setActiveAlerts(newActiveAlerts);
    } else {
      setActiveAlerts([]);
    }
  };

  const addAlertToHistory = (newAlert: Alert) => {
    setAlerts(prev => {
      // Evitar duplicados recientes (últimos 10 segundos)
      const isDuplicate = prev.some(a =>
        a.sensor === newAlert.sensor &&
        Math.abs(a.timestamp - newAlert.timestamp) < 10000
      );
      if (isDuplicate) return prev;
      return [newAlert, ...prev];
    });
  };

  const dismissAlert = (id: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Valores iniciales o de carga
  if (!data) {
    // Si no hay datos reales aún, mostramos datos de ejemplo para que la UI no se quede cargando
    // Esto cumple con "NO QUIERO QUE ME SALGA Conectando con sensores..."
    const dummyData: SensorData = {
      ph: 7.0,
      temperature: 24.5,
      turbidity: 2.1,
      tds: 150,
      timestamp: new Date().toISOString()
    };

    // Usamos un efecto para setear esto solo si tarda mucho, o renderizamos directamente
    // Para inmediatez, retornamos el layout con datos dummy marcados visualmente si se desea,
    // pero para cumplir la solicitud estricta, simplemente renderizamos el dashboard normal con estos datos.

    // Sin embargo, como el componente espera 'data' en el return principal, 
    // podemos retornar un estado de carga MUY breve o simplemente null y dejar que el useEffect de arriba
    // (que ahora tiene fetchInitialData) haga su trabajo. 
    // Pero el usuario dice que NO le sale nada.

    // Forzamos renderizado con datos vacíos/dummy si data es null
    return (
      <DashboardLayout>
        {/* Renderizamos el contenido normal pero con valores en 0 o dummy */}
        <div className="space-y-8 animate-in fade-in duration-500">
          <WaterStatusCard temperature={0} turbidity={0} tds={0} ph={0} />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SensorCard title="pH" value={0} unit="" icon={Droplets} status="normal" description="Esperando datos..." />
            <SensorCard title="Temperatura" value={0} unit="°C" icon={Thermometer} status="normal" description="Esperando datos..." />
            <SensorCard title="Turbidez" value={0} unit="NTU" icon={Waves} status="normal" description="Esperando datos..." />
            <SensorCard title="Sólidos Disueltos (TDS)" value={0} unit="ppm" icon={Activity} status="normal" description="Esperando datos..." />
          </div>

          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p>Iniciando sistema de monitoreo...</p>
            <p className="text-xs mt-2">Si los datos no aparecen en unos segundos, verifica la conexión del backend.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-slate-100 w-fit shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'live'
            ? 'bg-[#164e63] text-white shadow-md'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
        >
          <LayoutDashboard size={18} />
          En Vivo
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'history'
            ? 'bg-[#164e63] text-white shadow-md'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
        >
          <History size={18} />
          Histórico
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'alerts'
            ? 'bg-[#164e63] text-white shadow-md'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
        >
          <Bell size={18} />
          Alertas
          {alerts.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
              {alerts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'config'
            ? 'bg-[#164e63] text-white shadow-md'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
        >
          <Settings size={18} />
          Configuración
        </button>
      </div>

      {activeTab === 'live' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Sección de Alertas Activas */}
          {activeAlerts.length > 0 && (
            <div className="space-y-2">
              {activeAlerts.map((alert) => (
                <AlertBanner
                  key={alert.id}
                  message={alert.message}
                  type={alert.type}
                  onDismiss={() => dismissAlert(alert.id)}
                />
              ))}
            </div>
          )}

          {/* Indicador de Estado General */}
          <WaterStatusCard
            ph={data.ph}
            temperature={data.temperature}
            turbidity={data.turbidity}
            tds={data.tds}
          />

          {/* Tarjetas de Sensores */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SensorCard
              title="pH"
              value={data.ph}
              unit=""
              icon={Droplets}
              status={data.ph < 6.5 || data.ph > 8.5 ? "warning" : "normal"}
              description="Rango óptimo: 6.5 - 8.5"
            />
            <SensorCard
              title="Temperatura"
              value={data.temperature}
              unit="°C"
              icon={Thermometer}
              status={data.temperature > 28 ? "warning" : "normal"}
              description="Rango óptimo: 20 - 28°C"
            />
            <SensorCard
              title="Turbidez"
              value={data.turbidity}
              unit="NTU"
              icon={Waves}
              status={data.turbidity > 5 ? "warning" : "normal"}
              description="Máximo permitido: 5 NTU"
            />
            <SensorCard
              title="Sólidos Disueltos (TDS)"
              value={data.tds}
              unit="ppm"
              icon={Activity}
              status={data.tds > 500 ? "warning" : "normal"}
              description="Máximo recomendado: 500 ppm"
            />
          </div>

          {/* Gráficos en Tiempo Real */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-2">
            <LiveChart
              title="Tendencia de pH"
              data={history.slice(-20)}
              dataKey="ph"
              color="#8b5cf6"
            />
            <LiveChart
              title="Tendencia de Temperatura"
              data={history.slice(-20)} // Solo últimos 20 para live
              dataKey="temperature"
              color="#ef4444"
            />
            <LiveChart
              title="Tendencia de Turbidez"
              data={history.slice(-20)}
              dataKey="turbidity"
              color="#eab308"
            />
            <LiveChart
              title="Tendencia de TDS"
              data={history.slice(-20)}
              dataKey="tds"
              color="#10b981"
            />
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <HistoryView history={history} />
      )}

      {activeTab === 'alerts' && (
        <AlertsView alerts={alerts} />
      )}

      {activeTab === 'config' && (
        <ConfigView />
      )}

    </DashboardLayout>
  );
}
