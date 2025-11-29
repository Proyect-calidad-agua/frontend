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
import { Thermometer, Activity, Waves, LayoutDashboard, History, Bell, Settings } from "lucide-react";

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
    // Conectar al backend (asumiendo puerto 5000)
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
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-cyan-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-500 font-medium animate-pulse">Conectando con sensores...</p>
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
            temperature={data.temperature}
            turbidity={data.turbidity}
            tds={data.tds}
          />

          {/* Tarjetas de Sensores */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
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
