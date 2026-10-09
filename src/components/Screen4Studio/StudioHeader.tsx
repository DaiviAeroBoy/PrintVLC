import React from 'react';
import { 
  Printer, 
  Download, 
  Sparkles, 
  FolderOpen, 
  Radio, 
  FileText,
  Sliders
} from 'lucide-react';

interface StudioHeaderProps {
  documentName: string;
  totalPages: number;
  activePageIndex?: number;
  connectionType: string;
  currentScreen: 'studio' | 'hardware' | 'dropzone';
  onNavigate: (screen: 'studio' | 'hardware' | 'dropzone') => void;
  onOpenAIModal: () => void;
  onExportPdf: () => void;
  onOpenPrintModal: () => void;
  isExporting: boolean;
  isPrinting: boolean;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  documentName,
  totalPages,
  activePageIndex = 0,
  connectionType,
  currentScreen,
  onNavigate,
  onOpenAIModal,
  onExportPdf,
  onOpenPrintModal,
  isExporting,
  isPrinting,
}) => {
  return (
    <header className="h-16 bg-[#141419] border-b border-[#252532] px-4 md:px-6 flex items-center justify-between gap-4 font-sans select-none z-30">
      
      {/* LEFT: Brand & Document Meta */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <div 
          onClick={() => onNavigate(totalPages > 0 ? 'studio' : 'dropzone')}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="PrintVLC Universal Studio"
        >
          {/* PrintVLC Traffic-Cone / Print-Head Icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff781f] to-[#ff9800] text-black shadow-lg shadow-[#ff781f]/25 group-hover:scale-105 transition-transform">
            <Printer className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-sm text-white tracking-tight">PrintVLC</span>
              <span className="rounded bg-[#ff781f]/20 text-[#ff781f] text-[9px] px-1.5 py-0.5 font-bold font-mono border border-[#ff781f]/30">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-gray-400 block leading-none mt-1 font-mono">
              Universal Print Engine
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-[#282836] hidden lg:block" />

        {/* Document breadcrumb / active file status */}
        {totalPages > 0 && (
          <div className="hidden xl:flex items-center gap-2 text-xs">
            <FileText className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-200 font-medium truncate max-w-[180px]" title={documentName}>
              {documentName}
            </span>
            <span className="rounded-full bg-[#1e1e28] px-2 py-0.5 text-[10px] text-[#00e5ff] border border-[#2b2b3a] font-mono">
              {activePageIndex + 1}/{totalPages} p
            </span>
          </div>
        )}
      </div>

      {/* CENTER: Main Screen Navigation Switcher */}
      <nav className="flex items-center bg-[#1b1b24] p-1 rounded-xl border border-[#2c2c3e] shadow-inner">
        {/* 1. Files / Dropzone Tab */}
        <button
          type="button"
          onClick={() => onNavigate('dropzone')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentScreen === 'dropzone'
              ? 'bg-[#292938] text-white shadow-md shadow-black/40 border border-[#3b3b4f]'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#20202c]'
          }`}
          title="Open Files Hopper & Dropzone"
        >
          <FolderOpen className={`h-3.5 w-3.5 ${currentScreen === 'dropzone' ? 'text-[#ff781f]' : ''}`} />
          <span>Files Queue</span>
          {totalPages > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              currentScreen === 'dropzone' 
                ? 'bg-[#ff781f] text-black' 
                : 'bg-[#262636] text-gray-300'
            }`}>
              {totalPages}
            </span>
          )}
        </button>

        {/* 2. Studio Editor Workspace Tab */}
        <button
          type="button"
          onClick={() => onNavigate('studio')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentScreen === 'studio'
              ? 'bg-[#ff781f]/15 text-[#ff781f] shadow-md shadow-black/40 border border-[#ff781f]/40 font-bold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#20202c]'
          }`}
          title={totalPages === 0 ? 'Load files to edit in studio' : 'Open WYSIWYG Print Studio'}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Studio Editor</span>
          {currentScreen === 'studio' && (
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff781f] animate-pulse" />
          )}
        </button>

        {/* 3. Hardware Hub Tab */}
        <button
          type="button"
          onClick={() => onNavigate('hardware')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentScreen === 'hardware'
              ? 'bg-[#292938] text-white shadow-md shadow-black/40 border border-[#3b3b4f]'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#20202c]'
          }`}
          title="Configure USB, Bluetooth, Network IPP, and Drivers"
        >
          <Radio className={`h-3.5 w-3.5 ${currentScreen === 'hardware' ? 'text-emerald-400' : 'text-gray-400'}`} />
          <span className="hidden sm:inline">Printers Hub</span>
          <span className="sm:hidden">Printers</span>
          <span className="hidden md:inline text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.2 rounded">
            {connectionType}
          </span>
        </button>
      </nav>

      {/* RIGHT: Actions Suite (AI Assist, Master PDF, Pop-Out Print) */}
      <div className="flex items-center gap-2 shrink-0">

        {/* AI Assist Modal Button */}
        <button
          type="button"
          onClick={onOpenAIModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 hover:from-cyan-900/80 hover:to-indigo-900/80 border border-cyan-500/40 text-[11px] text-[#00e5ff] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          title="On-Device Privacy-Safe AI Assistant"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#00e5ff]" />
          <span className="hidden md:inline">AI Assist</span>
        </button>

        {/* Export PDF/X Button */}
        <button
          type="button"
          onClick={onExportPdf}
          disabled={isExporting || totalPages === 0}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#20202a] hover:bg-[#282836] border border-[#313144] text-[11px] text-gray-200 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
          title="Export Print-Ready Flattened Master PDF"
        >
          <Download className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden lg:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
        </button>

        {/* Master Print Button with Pop-out Window indicator */}
        <button
          type="button"
          onClick={onOpenPrintModal}
          disabled={isPrinting || totalPages === 0}
          className="flex items-center gap-2 px-4 md:px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff781f] to-[#ff9800] hover:from-[#ff8e3d] hover:to-[#ffa726] text-black text-xs font-bold font-mono uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ff781f]/25 disabled:opacity-40 disabled:pointer-events-none"
          title="Pop out in new window and print document"
        >
          <Printer className="h-4 w-4 stroke-[2.5]" />
          <span>{isPrinting ? 'Spooling...' : 'Print'}</span>
        </button>

      </div>
    </header>
  );
};
