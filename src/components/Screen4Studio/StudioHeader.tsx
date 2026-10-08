import React from 'react';
import { 
  Printer, 
  Download, 
  Sparkles, 
  HardDrive, 
  Upload, 
  Cpu, 
  Layers, 
  Settings2,
  FileCheck2,
  Radio
} from 'lucide-react';

interface StudioHeaderProps {
  documentName: string;
  totalPages: number;
  connectionType: string;
  onOpenHardwareHub: () => void;
  onOpenDropzone: () => void;
  onOpenAIModal: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  isExporting: boolean;
  isPrinting: boolean;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  documentName,
  totalPages,
  connectionType,
  onOpenHardwareHub,
  onOpenDropzone,
  onOpenAIModal,
  onExportPdf,
  onPrint,
  isExporting,
  isPrinting,
}) => {
  return (
    <header className="h-14 bg-[#16161b] border-b border-[#262632] px-4 flex items-center justify-between gap-4 font-mono select-none">
      
      {/* Brand & Document Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* PrintVLC Traffic-Cone / Print-Head Icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff781f] to-[#ff9800] text-black shadow-md shadow-[#ff781f]/20">
            <Printer className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-sm text-white tracking-tight">PrintVLC</span>
              <span className="rounded bg-[#ff781f]/20 text-[#ff781f] text-[9px] px-1 py-0.2 font-bold">PRO</span>
            </div>
            <span className="text-[10px] text-gray-500 block leading-none mt-0.5">The VLC of Printing</span>
          </div>
        </div>

        <div className="h-4 w-px bg-[#2d2d3c] hidden sm:block" />

        {/* Document Status */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-gray-300 font-medium truncate max-w-[200px]" title={documentName}>
            {documentName}
          </span>
          <span className="rounded-full bg-[#202028] px-2 py-0.5 text-[10px] text-gray-400 border border-[#2d2d3a]">
            {totalPages}p Queue
          </span>
        </div>
      </div>

      {/* Middle & Right Actions */}
      <div className="flex items-center gap-2">
        
        {/* Hardware Status Tag */}
        <button
          onClick={onOpenHardwareHub}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#20202a] hover:bg-[#282836] border border-[#2e2e3e] text-[11px] text-gray-300 transition-colors"
          title="Configure Printer Connection"
        >
          <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
          <span className="capitalize">{connectionType} Endpoint</span>
        </button>

        {/* Dropzone Reopen */}
        <button
          onClick={onOpenDropzone}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#20202a] hover:bg-[#282836] border border-[#2e2e3e] text-[11px] text-gray-300 transition-colors"
          title="Add / Ingest More Files"
        >
          <Upload className="h-3.5 w-3.5 text-gray-400" />
          <span className="hidden sm:inline">Add Files</span>
        </button>

        {/* AI Assist Modal Button */}
        <button
          onClick={onOpenAIModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 hover:from-cyan-900/70 hover:to-indigo-900/70 border border-cyan-500/40 text-[11px] text-[#00e5ff] font-semibold transition-all shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#00e5ff]" />
          <span>AI Assist</span>
        </button>

        {/* Export PDF/X Button */}
        <button
          onClick={onExportPdf}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#252531] hover:bg-[#303040] border border-[#3c3c50] text-[11px] text-gray-200 font-semibold transition-colors disabled:opacity-50"
          title="Save As Flattened Print-Ready Master PDF"
        >
          <Download className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden md:inline">Save As Master</span>
        </button>

        {/* Master Print Button */}
        <button
          onClick={onPrint}
          disabled={isPrinting}
          className="flex items-center gap-1.5 px-5 py-1.5 rounded-lg bg-[#ff781f] hover:bg-[#ff8e3d] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#ff781f]/20 active:scale-[0.98] disabled:opacity-50"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>{isPrinting ? 'Printing...' : 'Print'}</span>
        </button>

      </div>
    </header>
  );
};
