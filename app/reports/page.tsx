"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Download, Calendar } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportsPage() {
    const generatePDF = () => {
        const doc = new jsPDF();

        // Título
        doc.setFontSize(20);
        doc.text("Reporte de Calidad del Agua", 14, 22);

        doc.setFontSize(11);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);

        // Datos simulados para el reporte
        const data = [
            ["08:00", "7.2", "24.5", "2.1", "350"],
            ["09:00", "7.3", "25.0", "2.3", "355"],
            ["10:00", "7.1", "25.5", "2.5", "360"],
            ["11:00", "7.4", "26.0", "2.2", "358"],
            ["12:00", "7.2", "26.5", "2.4", "362"],
        ];

        autoTable(doc, {
            head: [["Hora", "pH", "Temp (°C)", "Turbidez (NTU)", "TDS (ppm)"]],
            body: data,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
        });

        // Resumen estadístico
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text("Resumen Diario:", 14, finalY);
        doc.text("- pH Promedio: 7.24", 14, finalY + 10);
        doc.text("- Temp. Máxima: 26.5°C", 14, finalY + 18);
        doc.text("- Alertas generadas: 0", 14, finalY + 26);

        doc.save("reporte_calidad_agua.pdf");
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Reportes y Análisis</h2>
                    <p className="text-slate-500">Genera y descarga reportes detallados del sistema.</p>
                </div>
                <button
                    onClick={generatePDF}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Download className="h-4 w-4" />
                    Descargar PDF
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Reportes Generados</p>
                            <p className="text-2xl font-bold text-slate-800">124</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 rounded-lg text-green-600">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Días Monitoreados</p>
                            <p className="text-2xl font-bold text-slate-800">45</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="font-semibold text-slate-800">Historial Reciente</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Tipo</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr className="hover:bg-slate-50">
                                <td className="px-6 py-3">24/11/2025</td>
                                <td className="px-6 py-3">Reporte Diario</td>
                                <td className="px-6 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completado</span></td>
                                <td className="px-6 py-3 text-blue-600 hover:underline cursor-pointer">Ver</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                                <td className="px-6 py-3">23/11/2025</td>
                                <td className="px-6 py-3">Reporte Diario</td>
                                <td className="px-6 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completado</span></td>
                                <td className="px-6 py-3 text-blue-600 hover:underline cursor-pointer">Ver</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
