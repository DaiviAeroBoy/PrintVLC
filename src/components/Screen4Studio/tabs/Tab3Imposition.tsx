import React from 'react';
import { ImpositionSettings } from '../../../types/studio';
import { Grid, BookOpen, Scissors, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';

interface Tab3ImpositionProps {
  settings: ImpositionSettings;
  onChangeSettings: (settings: ImpositionSettings) => void;
  totalPages: number;
}

export const Tab3Imposition: React.FC<Tab3ImpositionProps> = ({
  settings,
  onChangeSettings,
  totalPages,
}) => {
  const handleModeChange = (mode: ImpositionSettings['mode']) => {
    onChangeSettings({ ...settings, mode });
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Imposition Mode Selector */}
      <div>
        <label className="text-[11px] font-mono text-[#9ca3af] block mb-1.5">Imposition Scheme</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleModeChange('single')}
            className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
              settings.mode === 'single' ? 'border-[#ff781f] bg-[#ff781f]/15 text-white' : 'border-[#2d2d3a] bg-[#1a1a20] text-gray-400'
            }`}
          >
            <Layers className="h-4 w-4 text-gray-300 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[11px]">1:1 Standard</div>
              <div className="text-[10px] text-gray-500">1 page per sheet</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('nup')}
            className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
              settings.mode === 'nup' ? 'border-[#ff781f] bg-[#ff781f]/15 text-white' : 'border-[#2d2d3a] bg-[#1a1a20] text-gray-400'
            }`}
          >
            <Grid className="h-4 w-4 text-[#ff781f] mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[11px]">N-Up Grid</div>
              <div className="text-[10px] text-gray-500">2, 4, 8, 16 per sheet</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('booklet')}
            className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
              settings.mode === 'booklet' ? 'border-[#ff781f] bg-[#ff781f]/15 text-white' : 'border-[#2d2d3a] bg-[#1a1a20] text-gray-400'
            }`}
          >
            <BookOpen className="h-4 w-4 text-[#00e5ff] mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[11px]">Pro Booklet Maker</div>
              <div className="text-[10px] text-gray-500">Saddle-stitch + Creep</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('poster')}
            className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
              settings.mode === 'poster' ? 'border-[#ff781f] bg-[#ff781f]/15 text-white' : 'border-[#2d2d3a] bg-[#1a1a20] text-gray-400'
            }`}
          >
            <Scissors className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[11px]">Poster / Tiling Slicer</div>
              <div className="text-[10px] text-gray-500">Multi-sheet grid</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('id_photo')}
            className={`col-span-2 p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
              settings.mode === 'id_photo' ? 'border-[#ff781f] bg-[#ff781f]/15 text-white' : 'border-[#2d2d3a] bg-[#1a1a20] text-gray-400'
            }`}
          >
            <ImageIcon className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[11px]">ID Photo Multiplier</div>
              <div className="text-[10px] text-gray-500">6, 8, 12 passport cutouts on 4x6"</div>
            </div>
          </button>
        </div>
      </div>

      {/* MODE 1: N-UP CONTROLS */}
      {settings.mode === 'nup' && (
        <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-3">
          <span className="font-mono text-[11px] font-semibold text-white block">N-Up Layout Matrix</span>
          <div className="grid grid-cols-4 gap-1.5">
            {([1, 2, 4, 6, 8, 9, 16] as const).map(count => (
              <button
                key={count}
                type="button"
                onClick={() => onChangeSettings({ ...settings, nupCount: count })}
                className={`py-1.5 text-[11px] font-mono rounded border ${
                  settings.nupCount === count ? 'border-[#ff781f] bg-[#ff781f]/20 text-white font-bold' : 'border-[#2b2b36] text-gray-400'
                }`}
              >
                {count}-Up
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-gray-400">Cell Gap (mm)</span>
            <input
              type="number"
              min={0}
              max={30}
              value={settings.cellGapMm}
              onChange={(e) => onChangeSettings({ ...settings, cellGapMm: Number(e.target.value) })}
              className="w-16 bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white text-right"
            />
          </div>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#262635]">
            <span className="text-gray-300 font-mono text-[11px] flex items-center gap-1.5">
              <Scissors className="h-3.5 w-3.5 text-gray-400" /> Print Scissor Cut-Lines
            </span>
            <input
              type="checkbox"
              checked={settings.showCutLines}
              onChange={(e) => onChangeSettings({ ...settings, showCutLines: e.target.checked })}
              className="rounded accent-[#ff781f] h-4 w-4"
            />
          </label>
        </div>
      )}

      {/* MODE 2: PRO BOOKLET MAKER CONTROLS */}
      {settings.mode === 'booklet' && (
        <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-white">Saddle-Stitch Signature</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/30 text-cyan-300 border border-cyan-800/40">
              Auto-Pad 4× Multiples
            </span>
          </div>

          <div className="text-[10px] text-gray-400 leading-normal bg-black/30 p-2 rounded border border-[#282835]">
            Pages are calculated into 4-page signatures with folding center spine.
            {totalPages % 4 !== 0 && (
              <div className="text-amber-400 mt-1">
                Notice: Document ({totalPages}p) will auto-pad {4 - (totalPages % 4)} blank page(s) to reach signature multiple of 4.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-300">Spine Gutter Margin (mm)</span>
            <input
              type="number"
              min={0}
              max={40}
              value={settings.spineGutterMm}
              onChange={(e) => onChangeSettings({ ...settings, spineGutterMm: Number(e.target.value) })}
              className="w-16 bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white text-right"
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <div>
              <span className="text-gray-300 block">Paper Weight (GSM)</span>
              <span className="text-[9px] text-gray-500">Creep compensation / shingling</span>
            </div>
            <input
              type="number"
              min={60}
              max={350}
              step={10}
              value={settings.paperGsm}
              onChange={(e) => onChangeSettings({ ...settings, paperGsm: Number(e.target.value) })}
              className="w-16 bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white text-right"
            />
          </div>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#262635]">
            <span className="text-gray-300 text-[11px]">Draw Fold & Staple Tick Marks</span>
            <input
              type="checkbox"
              checked={settings.showFoldMarks}
              onChange={(e) => onChangeSettings({ ...settings, showFoldMarks: e.target.checked })}
              className="rounded accent-[#00e5ff] h-4 w-4"
            />
          </label>
        </div>
      )}

      {/* MODE 3: POSTER / TILING SLICER CONTROLS */}
      {settings.mode === 'poster' && (
        <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-3 font-mono">
          <span className="text-[11px] font-semibold text-white block">Multi-Sheet Poster Grid</span>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <label className="text-gray-400 block mb-0.5">Columns (Sheets)</label>
              <input
                type="number"
                min={2}
                max={10}
                value={settings.posterCols}
                onChange={(e) => onChangeSettings({ ...settings, posterCols: Number(e.target.value) })}
                className="w-full bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-0.5">Rows (Sheets)</label>
              <input
                type="number"
                min={2}
                max={10}
                value={settings.posterRows}
                onChange={(e) => onChangeSettings({ ...settings, posterRows: Number(e.target.value) })}
                className="w-full bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-300">Overlap Glue Tab (mm)</span>
            <input
              type="number"
              min={0}
              max={30}
              value={settings.glueTabMm}
              onChange={(e) => onChangeSettings({ ...settings, glueTabMm: Number(e.target.value) })}
              className="w-16 bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white text-right"
            />
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-300 text-[11px]">Cut Crosshairs (+)</span>
            <input
              type="checkbox"
              checked={settings.cutCrosshairs}
              onChange={(e) => onChangeSettings({ ...settings, cutCrosshairs: e.target.checked })}
              className="rounded accent-amber-400 h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-300 text-[11px]">Coordinate Stamps (R1-C1)</span>
            <input
              type="checkbox"
              checked={settings.coordinateStamps}
              onChange={(e) => onChangeSettings({ ...settings, coordinateStamps: e.target.checked })}
              className="rounded accent-amber-400 h-4 w-4"
            />
          </label>
        </div>
      )}

      {/* MODE 4: ID PHOTO MULTIPLIER CONTROLS */}
      {settings.mode === 'id_photo' && (
        <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-3 font-mono">
          <span className="text-[11px] font-semibold text-white block">ID / Passport Cuts on 4×6"</span>

          <div className="grid grid-cols-3 gap-2">
            {([6, 8, 12] as const).map(count => (
              <button
                key={count}
                type="button"
                onClick={() => onChangeSettings({ ...settings, idCutCount: count })}
                className={`py-2 text-[11px] font-mono rounded border ${
                  settings.idCutCount === count ? 'border-emerald-500 bg-emerald-500/20 text-white font-bold' : 'border-[#2b2b36] text-gray-400'
                }`}
              >
                {count} Cuts
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400">
            Automatically arranges and scales your image into calibrated passport/visa slots with crop marks.
          </p>
        </div>
      )}
    </div>
  );
};
