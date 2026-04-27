import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';

const ExportButtons = ({ onExportExcel, onExportPDF }) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={onExportExcel}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-bold text-sm hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 active:scale-95"
        title="Exportar a Excel"
      >
        <FileSpreadsheet size={18} />
        <span>Excel</span>
      </button>
      <button
        onClick={onExportPDF}
        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl font-bold text-sm hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-300 active:scale-95"
        title="Exportar a PDF"
      >
        <Download size={18} />
        <span>PDF</span>
      </button>
    </div>
  );
};

export default ExportButtons;
