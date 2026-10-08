import React from 'react';
import { ScaleMode } from '../../../types/studio';
import { Maximize, Minimize, Move, AlignCenter, Magnet, Lock } from 'lucide-react';

interface Tab2ScalingPlacementProps {
  scaleMode: ScaleMode;
  onSelectScaleMode: (mode: ScaleMode) => void;
  scalePercent: number;
  onChangeScalePercent: (val: number) => void;
  offsetX: number;
  offsetY: number;
  onChangeOffset: (x: number, y: number) => void;
  snapGrid: boolean;
  onToggleSnapGrid: (val: boolean) => void;
  snapMargin: boolean;
  onToggleSnapMargin: (val: boolean) => void;
  exactMmWidth: number;
  exactMmHeight: number;
  onChangeExactMm: (w: number, h: number) => void;
}

export const Tab2ScalingPlacement: React.FC<Tab2ScalingPlacementProps> = ({
  scaleMode,
  onSelectScaleMode,
  scalePercent,
  onChangeScalePercent,
  offsetX,
  offsetY,
  onChangeOffset,
  snapGrid,
  onToggleSnapGrid,
  snapMargin,
  onToggleSnapMargin,
  exactMmWidth,
  exactMmHeight,
  onChangeExactMm
}) => {
  return (
    <div className="space-y-5 text-xs">
      {/* Scaling Modes */}
      <div>
        <label className="text-[11px] font-mono text-[#9ca3af] block mb-1.5">Scaling Engine Mode</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelectScaleMode('fit')}
            className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
              scaleMode === 'fit' ? 'border-[#ff781f] bg-[#ff781f]/15 text-white' : 'border-[#2d2d3a] bg-[#1a1a20] text-gray-400'
            }`}
          >
            <Minimize className="h-4 w-4 text-[#ff781f] mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[11px]">Fit to Printable</div>
              <div className="text-[10px] text-gray-500">Respects margins</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectScaleMode('fill')}
            className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
              scaleMode === 'fill' ? 'border-[#ff781f] bg-[#ff781f]/15 text-white' : 'border-[#2d2d3a] bg-[#1a1a20] text-gray-400'
            }`}
          >
            <Maximize className="h-4 w-4 text-[#00e5ff] mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[11px]">Fill Sheet</div>
              <div className="text-[10px] text-gray-500">Full bleed crop</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectScaleMode('custom')}
            className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
              scaleMode === 'custom' ? 'border-[#ff781f] bg-[#ff781f]/15 text-white' : 'border-[#2d2d3a] bg-[#1a1a20] text-gray-400'
            }`}
          >
            <Move className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[11px]">Custom % Scale</div>
              <div className="text-[10px] text-gray-500">1% - 1000%</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectScaleMode('exact_mm')}
            className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
              scaleMode === 'exact_mm' ? 'border-[#ff781f] bg-[#ff781f]/15 text-white' : 'border-[#2d2d3a] bg-[#1a1a20] text-gray-400'
            }`}
          >
            <Lock className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[11px]">Physical Lock</div>
              <div className="text-[10px] text-gray-500">Exact millimeters</div>
            </div>
          </button>
        </div>
      </div>

      {/* Custom Percentage Scale Slider */}
      {scaleMode === 'custom' && (
        <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-2">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-gray-400">Scale Factor</span>
            <span className="font-bold text-[#ff781f]">{scalePercent}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={500}
            value={scalePercent}
            onChange={(e) => onChangeScalePercent(Number(e.target.value))}
            className="w-full accent-[#ff781f]"
          />
          <div className="flex justify-between text-[10px] font-mono text-gray-500">
            <span>25%</span>
            <span>100%</span>
            <span>200%</span>
            <span>500%</span>
          </div>
        </div>
      )}

      {/* Exact Millimeter Lock */}
      {scaleMode === 'exact_mm' && (
        <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-2">
          <span className="font-mono text-[11px] font-semibold text-white block mb-1">Exact Physical Lock</span>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div>
              <label className="text-gray-400 block mb-0.5">Width (mm)</label>
              <input
                type="number"
                value={exactMmWidth}
                onChange={(e) => onChangeExactMm(Number(e.target.value), exactMmHeight)}
                className="w-full bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-0.5">Height (mm)</label>
              <input
                type="number"
                value={exactMmHeight}
                onChange={(e) => onChangeExactMm(exactMmWidth, Number(e.target.value))}
                className="w-full bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Snap Guides & Alignment Aids */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-3">
        <span className="font-mono text-[11px] font-semibold text-white block">Magnetic Snapping Aids</span>
        
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-300 font-mono text-[11px] flex items-center gap-1.5">
            <Magnet className="h-3.5 w-3.5 text-[#00e5ff]" /> Snap to 5mm Grid
          </span>
          <input
            type="checkbox"
            checked={snapGrid}
            onChange={(e) => onToggleSnapGrid(e.target.checked)}
            className="rounded accent-[#ff781f] h-4 w-4"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-300 font-mono text-[11px] flex items-center gap-1.5">
            <Magnet className="h-3.5 w-3.5 text-[#ff781f]" /> Snap to Margin Bounds
          </span>
          <input
            type="checkbox"
            checked={snapMargin}
            onChange={(e) => onToggleSnapMargin(e.target.checked)}
            className="rounded accent-[#ff781f] h-4 w-4"
          />
        </label>

        {/* Quick Alignment Actions */}
        <div className="pt-2 border-t border-[#272736] flex gap-2">
          <button
            type="button"
            onClick={() => onChangeOffset(0, 0)}
            className="flex-1 py-1.5 rounded bg-[#23232c] hover:bg-[#2d2d38] border border-[#373748] text-[11px] font-mono text-white flex items-center justify-center gap-1"
          >
            <AlignCenter className="h-3.5 w-3.5" /> Center Both
          </button>
        </div>
      </div>
    </div>
  );
};
