import { AlertOctagon, AlertTriangle, CheckCircle, Clock } from "lucide-react";

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

interface AlertsViewProps {
    alerts: Alert[];
}

export function AlertsView({ alerts }: AlertsViewProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-1">Centro de Alertas</h2>
                <p className="text-sm text-slate-500">Gestiona y revisa las incidencias detectadas por los sensores</p>
            </div>

            <div className="space-y-4">
                {alerts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 border-dashed">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">Todo en orden</h3>
                        <p className="text-slate-500">No hay alertas registradas en este momento.</p>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <div key={alert.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${alert.type === 'critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {alert.type === 'critical' ? <AlertOctagon size={24} /> : <AlertTriangle size={24} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-800">{alert.sensor} fuera de rango</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${alert.type === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {alert.type === 'critical' ? 'Crítico' : 'Advertencia'}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-2">
                                        Valor registrado: <span className="font-semibold">{alert.value}</span> (Límite: {alert.threshold})
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(alert.timestamp).toLocaleTimeString()}
                                        </span>
                                        <span>•</span>
                                        <span>Exceso: +{(alert.value - alert.threshold).toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-lg transition-colors">
                                    Ver detalles
                                </button>
                                <button className="flex-1 md:flex-none px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-lg transition-colors">
                                    Marcar revisado
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
