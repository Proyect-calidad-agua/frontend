import { Calendar, Filter } from "lucide-react";
import { LiveChart } from "./LiveChart";

interface HistoryViewProps {
    history: any[];
}

export function HistoryView({ history }: HistoryViewProps) {
    // In a real app, we would fetch historical data here. 
    // For now, we use the session history.

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Historial de Registros</h2>
                    <p className="text-sm text-slate-500">Visualiza el comportamiento de los sensores en el tiempo</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-sm font-medium">
                        <Calendar size={16} />
                        <span>Hoy</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-sm font-medium">
                        <Filter size={16} />
                        <span>Filtrar</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LiveChart
                    title="Histórico Temperatura"
                    data={history}
                    dataKey="temperature"
                    color="#ef4444"
                />
                <LiveChart
                    title="Histórico Turbidez"
                    data={history}
                    dataKey="turbidity"
                    color="#eab308"
                />
                <LiveChart
                    title="Histórico TDS"
                    data={history}
                    dataKey="tds"
                    color="#10b981"
                />
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Registros Detallados</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Hora</th>
                                <th className="px-6 py-4">Temperatura</th>
                                <th className="px-6 py-4">Turbidez</th>
                                <th className="px-6 py-4">TDS</th>
                                <th className="px-6 py-4">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.slice().reverse().map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {new Date(row.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-4">{row.temperature.toFixed(1)}°C</td>
                                    <td className="px-6 py-4">{row.turbidity.toFixed(1)} NTU</td>
                                    <td className="px-6 py-4">{row.tds.toFixed(0)} ppm</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${(row.temperature > 28 || row.turbidity > 5 || row.tds > 500)
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-emerald-100 text-emerald-800'}`}>
                                            {(row.temperature > 28 || row.turbidity > 5 || row.tds > 500) ? 'Alerta' : 'Normal'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                        No hay registros disponibles aún
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
