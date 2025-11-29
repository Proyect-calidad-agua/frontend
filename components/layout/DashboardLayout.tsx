import React from 'react';
import { Thermometer, Activity, Waves, LogOut, Menu } from 'lucide-react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#164e63] text-white hidden md:flex flex-col sticky top-0 h-screen shadow-xl z-50">
                <div className="h-16 flex items-center px-6 border-b border-cyan-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#164e63] font-bold text-sm shadow-sm">
                            A
                        </div>
                        <h1 className="text-lg font-medium tracking-wide text-white">Panel WQ</h1>
                    </div>
                </div>

                <nav className="flex-1 py-6 space-y-6 overflow-y-auto">
                    <div>
                        <p className="px-6 text-xs font-bold text-cyan-200/60 uppercase tracking-wider mb-3">
                            Monitoreo
                        </p>
                        <div className="space-y-0.5">
                            <a href="#" className="flex items-center gap-3 px-6 py-3 text-white/90 hover:bg-white/10 hover:text-white border-l-4 border-transparent hover:border-cyan-300 transition-all group">
                                <Thermometer size={18} className="text-cyan-300/80 group-hover:text-cyan-300 transition-colors" />
                                <span className="font-medium text-sm">Temperatura</span>
                            </a>
                            <a href="#" className="flex items-center gap-3 px-6 py-3 text-white/90 hover:bg-white/10 hover:text-white border-l-4 border-transparent hover:border-cyan-300 transition-all group">
                                <Waves size={18} className="text-cyan-300/80 group-hover:text-cyan-300 transition-colors" />
                                <span className="font-medium text-sm">Turbidez</span>
                            </a>
                            <a href="#" className="flex items-center gap-3 px-6 py-3 text-white/90 hover:bg-white/10 hover:text-white border-l-4 border-transparent hover:border-cyan-300 transition-all group">
                                <Activity size={18} className="text-cyan-300/80 group-hover:text-cyan-300 transition-colors" />
                                <span className="font-medium text-sm">TDS</span>
                            </a>
                        </div>
                    </div>
                </nav>

                <div className="p-4 border-t border-cyan-800/50">
                    <button className="flex items-center gap-3 px-4 py-3 text-cyan-100/80 hover:text-white hover:bg-white/5 w-full rounded-lg transition-all">
                        <LogOut size={18} />
                        <span className="font-medium text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen bg-[#f8fafc]">
                {/* Mobile Header */}
                <header className="bg-[#164e63] text-white p-4 md:hidden sticky top-0 z-40 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#164e63] font-bold text-xs">
                            A
                        </div>
                        <h1 className="text-lg font-bold">Panel WQ</h1>
                    </div>
                    <button className="p-1 text-white/80 hover:text-white">
                        <Menu size={24} />
                    </button>
                </header>

                <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
