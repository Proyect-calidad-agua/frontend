import { AlertTriangle, X, AlertOctagon } from "lucide-react";

interface AlertBannerProps {
    message: string;
    type: "warning" | "critical";
    onDismiss: () => void;
}

export function AlertBanner({ message, type, onDismiss }: AlertBannerProps) {
    const styles = type === "critical"
        ? "bg-red-50 border-red-200 text-red-800 shadow-red-100"
        : "bg-amber-50 border-amber-200 text-amber-800 shadow-amber-100";

    const Icon = type === "critical" ? AlertOctagon : AlertTriangle;
    const iconColor = type === "critical" ? "text-red-600" : "text-amber-600";

    return (
        <div className={`${styles} border px-6 py-4 rounded-2xl shadow-lg mb-6 flex items-center justify-between animate-in slide-in-from-top-4 duration-300`}>
            <div className="flex items-center gap-4">
                <div className={`p-2 bg-white rounded-xl shadow-sm ${iconColor}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <span className="font-semibold text-sm md:text-base">{message}</span>
            </div>
            <button
                onClick={onDismiss}
                className={`p-2 hover:bg-black/5 rounded-lg transition-colors ${type === 'critical' ? 'text-red-600' : 'text-amber-600'}`}
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}
