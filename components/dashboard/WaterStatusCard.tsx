import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface WaterStatusCardProps {
    temperature: number;
    turbidity: number;
    tds: number;
}

export function WaterStatusCard({ temperature, turbidity, tds }: WaterStatusCardProps) {
    let status: 'optimal' | 'risk' | 'critical' = 'optimal';
    let message = "Calidad del agua óptima";

    // Logic to determine status
    const isTempBad = temperature > 28;
    const isTurbidityBad = turbidity > 5;
    const isTdsBad = tds > 500;

    if ((isTempBad && isTurbidityBad) || (isTempBad && isTdsBad) || (isTurbidityBad && isTdsBad)) {
        status = 'critical';
        message = "Calidad crítica: Múltiples parámetros fuera de rango";
    } else if (isTempBad || isTurbidityBad || isTdsBad) {
        status = 'risk';
        message = "Atención requerida: Parámetros fuera de rango";
    }

    const styles = {
        optimal: {
            bg: "bg-emerald-500",
            icon: CheckCircle,
            title: "Óptima",
            desc: "Todos los parámetros están dentro del rango normal."
        },
        risk: {
            bg: "bg-amber-500",
            icon: AlertTriangle,
            title: "En Riesgo",
            desc: "Uno o más parámetros requieren atención."
        },
        critical: {
            bg: "bg-red-500",
            icon: XCircle,
            title: "Crítica",
            desc: "Acción inmediata requerida. Calidad no segura."
        }
    };

    const currentStyle = styles[status];
    const Icon = currentStyle.icon;

    return (
        <div className={`${currentStyle.bg} rounded-3xl p-6 text-white shadow-lg transition-all duration-500`}>
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-sm font-medium text-white/80 uppercase tracking-wider mb-1">Estado del Agua</h2>
                    <h3 className="text-3xl font-bold flex items-center gap-3">
                        {currentStyle.title}
                    </h3>
                    <p className="mt-2 text-white/90 font-medium">
                        {message}
                    </p>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    <Icon size={32} className="text-white" />
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
                <p className="text-xs text-white/70">
                    {currentStyle.desc}
                </p>
            </div>
        </div>
    );
}
