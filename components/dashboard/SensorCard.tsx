import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
    title: string;
    value: number;
    unit: string;
    icon: LucideIcon;
    status: 'normal' | 'warning' | 'critical';
    description: string;
}

export function SensorCard({ title, value, unit, icon: Icon, status, description }: SensorCardProps) {
    const statusStyles = {
        normal: {
            container: 'bg-white border-slate-100 hover:border-blue-200',
            icon: 'bg-blue-50 text-blue-600',
            text: 'text-slate-900'
        },
        warning: {
            container: 'bg-amber-50/50 border-amber-100 hover:border-amber-200',
            icon: 'bg-amber-100 text-amber-600',
            text: 'text-amber-900'
        },
        critical: {
            container: 'bg-red-50/50 border-red-100 hover:border-red-200',
            icon: 'bg-red-100 text-red-600',
            text: 'text-red-900'
        },
    };

    const currentStyle = statusStyles[status];

    return (
        <div className={`p-6 rounded-3xl border ${currentStyle.container} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
                    <h3 className={`text-4xl font-bold mt-2 ${currentStyle.text} tracking-tight`}>
                        {value}
                        <span className="text-lg font-medium opacity-50 ml-1.5">{unit}</span>
                    </h3>
                </div>
                <div className={`p-4 rounded-2xl ${currentStyle.icon} transition-transform group-hover:scale-110 duration-300`}>
                    <Icon size={28} />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${status === 'normal' ? 'bg-emerald-400' : status === 'warning' ? 'bg-amber-400' : 'bg-red-400'} animate-pulse`} />
                <p className="text-xs font-medium opacity-60">
                    {description}
                </p>
            </div>
        </div>
    );
}
