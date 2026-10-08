import React, { useState } from 'react';
import { Printer, RotateCcw, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface DuplexWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPages: number;
  onPrintOddPages: () => void;
  onPrintEvenPages: () => void;
}

export const DuplexWizardModal: React.FC<DuplexWizardModalProps> = ({
  isOpen,
  onClose,
  totalPages,
  onPrintOddPages,
  onPrintEvenPages,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [flipType, setFlipType] = useState<'long_edge' | 'short_edge'>('long_edge');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#2b2b38] bg-[#16161b] p-6 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#252531] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-[#00e5ff] border border-cyan-500/30">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Manual 2-Sided Duplex Wizard</h3>
              <p className="text-[11px] font-mono text-gray-400">Step {step} of 3 • Zero Hardware Duplexer Required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#252530] text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Wizard Steps */}
        {step === 1 && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#1d1d26] border border-[#2d2d3c] text-center space-y-2">
              <div className="text-3xl font-bold text-[#00e5ff]">STEP 1</div>
              <div className="text-sm font-semibold text-white">Print Odd-Numbered Pages First</div>
              <p className="text-gray-400 text-[11px]">
                PrintVLC will stream only pages 1, 3, 5, 7... to your printer's input tray.
              </p>
            </div>

            <div className="flex items-center justify-between text-gray-400 bg-black/30 p-2.5 rounded border border-[#282835]">
              <span>Total Pages in Document:</span>
              <span className="font-bold text-white">{totalPages} Pages</span>
            </div>

            <button
              onClick={() => {
                onPrintOddPages();
                setStep(2);
              }}
              className="w-full py-3 rounded-xl bg-[#00e5ff] hover:bg-[#38bdf8] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print Odd Pages Batch & Continue</span>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#1d1d26] border border-[#2d2d3c] text-center space-y-3">
              <div className="text-3xl font-bold text-[#ff781f]">STEP 2</div>
              <div className="text-sm font-semibold text-white">Flip Printed Stack into Paper Tray</div>

              {/* Animated 3D Paper Flip Visualizer */}
              <div className="py-4 flex justify-center">
                <div className="relative w-36 h-48 rounded-lg bg-white border-2 border-dashed border-[#ff781f] text-black shadow-2xl flex flex-col items-center justify-center transform transition-transform duration-700 hover:rotate-180 cursor-pointer">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Printed Side</div>
                  <div className="text-xl font-black text-gray-800">PAGE 1</div>
                  <RotateCcw className="h-6 w-6 text-[#ff781f] mt-2 animate-spin" />
                  <div className="text-[9px] text-gray-500 mt-2 font-mono">Hover to preview flip</div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFlipType('long_edge')}
                  className={`px-3 py-1.5 rounded border text-[11px] ${
                    flipType === 'long_edge' ? 'border-[#ff781f] bg-[#ff781f]/20 text-white' : 'border-[#333344] text-gray-400'
                  }`}
                >
                  Flip on Long Edge (Standard Book)
                </button>
                <button
                  type="button"
                  onClick={() => setFlipType('short_edge')}
                  className={`px-3 py-1.5 rounded border text-[11px] ${
                    flipType === 'short_edge' ? 'border-[#ff781f] bg-[#ff781f]/20 text-white' : 'border-[#333344] text-gray-400'
                  }`}
                >
                  Flip on Short Edge (Notepad)
                </button>
              </div>

              <p className="text-gray-400 text-[11px]">
                Take the printed stack from the output tray, rotate it 180°, and reinsert face-down into your tray without changing page sequence.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-[#23232c] text-gray-300 hover:bg-[#2c2c38]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-xl bg-[#ff781f] hover:bg-[#ff8e3d] text-black font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Paper Reinserted — Proceed to Even Pages</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#1d1d26] border border-[#2d2d3c] text-center space-y-2">
              <div className="text-3xl font-bold text-emerald-400">STEP 3</div>
              <div className="text-sm font-semibold text-white">Print Even-Numbered Pages (Reverse Order)</div>
              <p className="text-gray-400 text-[11px]">
                PrintVLC will stream even pages directly onto the back of your odd pages in perfectly registered order.
              </p>
            </div>

            <button
              onClick={() => {
                onPrintEvenPages();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Print Even Pages & Complete Job</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
