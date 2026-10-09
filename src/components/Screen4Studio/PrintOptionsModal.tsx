import React, { useState } from 'react';
import { 
  Printer, 
  ExternalLink, 
  Download, 
  X, 
  Check, 
  Layers, 
  FileText, 
  Maximize2, 
  AlertCircle,
  Sparkles,
  Settings
} from 'lucide-react';

interface PrintOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  totalPages: number;
  activePageIndex: number;
  paperWidthMm: number;
  paperHeightMm: number;
  isLandscape: boolean;
  onConfirmPrint: (scope: 'all' | 'current', popout: boolean) => void;
  onExportPdf: () => void;
  isPrinting: boolean;
  isExporting: boolean;
  popupBlocked?: boolean;
  onRetryBlockedPopup?: () => void;
}

export const PrintOptionsModal: React.FC<PrintOptionsModalProps> = ({
  isOpen,
  onClose,
  documentName,
  totalPages,
  activePageIndex,
  paperWidthMm,
  paperHeightMm,
  isLandscape,
  onConfirmPrint,
  onExportPdf,
  isPrinting,
  isExporting,
  popupBlocked = false,
  onRetryBlockedPopup
}) => {
  const [printScope, setPrintScope] = useState<'all' | 'current'>(totalPages > 1 ? 'all' : 'current');
  const [usePopout, setUsePopout] = useState<boolean>(true);

  if (!isOpen) return null;

  const width = isLandscape ? Math.max(paperWidthMm, paperHeightMm) : Math.min(paperWidthMm, paperHeightMm);
  const height = isLandscape ? Math.min(paperWidthMm, paperHeightMm) : Math.max(paperWidthMm, paperHeightMm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-[#16161c] border border-[#2d2d3c] shadow-2xl overflow-hidden font-sans text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262634] bg-[#1a1a23]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff781f] to-[#ff9800] text-black shadow-md shadow-[#ff781f]/20">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Print Spool Dispatcher</h2>
              <p className="text-xs text-gray-400">Pop out edited document & launch system print dialog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#282836] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Popup Blocked Warning if applicable */}
          {popupBlocked && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <span className="font-bold block mb-0.5 text-amber-300">Pop-up Window Blocked by Browser</span>
                Your browser blocked the print pop-out window. Click below to allow and open it:
                <button
                  onClick={onRetryBlockedPopup}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500 text-black font-bold text-[11px] hover:bg-amber-400 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open Print Window Now
                </button>
              </div>
            </div>
          )}

          {/* Document Summary Card */}
          <div className="p-3.5 rounded-xl bg-[#1d1d27] border border-[#2c2c3e] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-[#272736] text-[#ff781f]">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate max-w-xs" title={documentName}>
                  {documentName}
                </div>
                <div className="text-[11px] text-gray-400 flex items-center gap-2 font-mono mt-0.5">
                  <span>{totalPages} page{totalPages > 1 ? 's' : ''} total</span>
                  <span>•</span>
                  <span>{width} × {height} mm</span>
                  <span>•</span>
                  <span className="capitalize">{isLandscape ? 'Landscape' : 'Portrait'}</span>
                </div>
              </div>
            </div>

            <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Print Ready
            </span>
          </div>

          {/* Print Scope Selector */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2 font-mono">
              Print Scope
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPrintScope('all')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  printScope === 'all'
                    ? 'border-[#ff781f] bg-[#ff781f]/10 shadow-sm'
                    : 'border-[#2c2c3e] bg-[#1d1d27] hover:border-[#3d3d52]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2">
                    <Layers className={`h-4 w-4 ${printScope === 'all' ? 'text-[#ff781f]' : 'text-gray-400'}`} />
                    <span className="text-xs font-bold text-white">All Pages</span>
                  </div>
                  {printScope === 'all' && (
                    <div className="h-4 w-4 rounded-full bg-[#ff781f] flex items-center justify-center text-black">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-gray-400">
                  Print entire document queue ({totalPages} page{totalPages > 1 ? 's' : ''})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPrintScope('current')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  printScope === 'current'
                    ? 'border-[#ff781f] bg-[#ff781f]/10 shadow-sm'
                    : 'border-[#2c2c3e] bg-[#1d1d27] hover:border-[#3d3d52]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2">
                    <FileText className={`h-4 w-4 ${printScope === 'current' ? 'text-[#ff781f]' : 'text-gray-400'}`} />
                    <span className="text-xs font-bold text-white">Current Page</span>
                  </div>
                  {printScope === 'current' && (
                    <div className="h-4 w-4 rounded-full bg-[#ff781f] flex items-center justify-center text-black">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-gray-400">
                  Print only page #{activePageIndex + 1}
                </span>
              </button>
            </div>
          </div>

          {/* Pop-out Window Feature Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#1c1c28] to-[#202030] border border-[#2e2e42]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#ff781f]/15 text-[#ff781f] shrink-0 mt-0.5">
                <ExternalLink className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Clean Pop-Out Print Window</span>
                  <input
                    type="checkbox"
                    checked={usePopout}
                    onChange={(e) => setUsePopout(e.target.checked)}
                    className="accent-[#ff781f] h-4 w-4 cursor-pointer rounded"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Pops out the edited document in a dedicated clean window. Removes all web page toolbars, panels, and backgrounds so only your crisp document is sent to the printer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#262634] bg-[#1a1a23]">
          <button
            type="button"
            onClick={onExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#242432] hover:bg-[#2e2e40] border border-[#353548] text-xs font-medium text-gray-300 transition-colors disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 text-amber-400" />
            <span>{isExporting ? 'Generating PDF...' : 'Export PDF'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#252533] text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onConfirmPrint(printScope, usePopout)}
              disabled={isPrinting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff781f] to-[#ff9800] hover:from-[#ff8e3d] hover:to-[#ffa726] text-black text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-lg shadow-[#ff781f]/20 active:scale-[0.98] disabled:opacity-50"
            >
              <Printer className="h-4 w-4 stroke-[2.5]" />
              <span>{isPrinting ? 'Spooling...' : 'Print Document'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
