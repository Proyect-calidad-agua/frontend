import { Save, Server, Wifi } from "lucide-react";

export function ConfigView() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-1">Configuración del Sistema</h2>
                <p className="text-sm text-slate-500">Ajusta los parámetros de conexión y umbrales de los sensores</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Configuración de Umbrales */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Server size={20} className="text-slate-400" />
                        Umbrales de Alerta
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Temperatura Máxima (°C)</label>
                            <input type="number" defaultValue={28} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Turbidez Máxima (NTU)</label>
                            <input type="number" defaultValue={5} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">TDS Máximo (ppm)</label>
                            <input type="number" defaultValue={500} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <button className="w-full mt-2 bg-[#164e63] text-white py-2 rounded-lg font-medium hover:bg-cyan-800 transition-colors flex items-center justify-center gap-2">
                            <Save size={18} />
                            Guardar Cambios
                        </button>
                    </div>
                </div>

                {/* Estado de Conexión */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Wifi size={20} className="text-slate-400" />
                        Conexión ESP32
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-slate-600">Estado del Servidor</span>
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">EN LÍNEA</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600">Última sincronización</span>
                                <span className="text-sm text-slate-500">Hace 2 segundos</span>
                            </div>
                        </div>

                        <div className="text-sm text-slate-500">
                            <p className="mb-2">Endpoint para ESP32:</p>
                            <code className="block bg-slate-800 text-slate-200 p-3 rounded-lg font-mono text-xs break-all">
                                POST http://[IP_SERVIDOR]:5000/api/sensores/registrar
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
