import React from 'react';
import { STANDARD_PAPER_SIZES, MARGIN_PRESETS } from '../../../constants/paperSizes';
import { PhysicalMargins } from '../../../types/document';
import { BorderSettings } from '../../../types/studio';
import { Lock, Unlock, FileText, Sliders, Maximize2 } from 'lucide-react';

interface Tab1PaperMarginsProps {
  selectedPaperId: string;
  onSelectPaperId: (id: string) => void;
  paperWidthMm: number;
  paperHeightMm: number;
  onChangePaperSize: (w: number, h: number) => void;
  isLandscape: boolean;
  onToggleOrientation: (landscape: boolean) => void;
  margins: PhysicalMargins;
  onChangeMargins: (margins: PhysicalMargins) => void;
  borderSettings: BorderSettings;
  onChangeBorderSettings: (border: BorderSettings) => void;
}

export const Tab1PaperMargins: React.FC<Tab1PaperMarginsProps> = ({
  selectedPaperId,
  onSelectPaperId,
  paperWidthMm,
  paperHeightMm,
  onChangePaperSize,
  isLandscape,
  onToggleOrientation,
  margins,
  onChangeMargins,
  borderSettings,
  onChangeBorderSettings,
}) => {
  const handlePaperChange = (id: string) => {
    onSelectPaperId(id);
    const standard = STANDARD_PAPER_SIZES.find(p => p.id === id);
    if (standard) {
      if (isLandscape) {
        onChangePaperSize(Math.max(standard.widthMm, standard.heightMm), Math.min(standard.widthMm, standard.heightMm));
      } else {
        onChangePaperSize(Math.min(standard.widthMm, standard.heightMm), Math.max(standard.widthMm, standard.heightMm));
      }
    }
  };

  const handleOrientation = (landscape: boolean) => {
    onToggleOrientation(landscape);
    if (landscape && paperWidthMm < paperHeightMm) {
      onChangePaperSize(paperHeightMm, paperWidthMm);
    } else if (!landscape && paperWidthMm > paperHeightMm) {
      onChangePaperSize(paperHeightMm, paperWidthMm);
    }
  };

  const handleMarginChange = (side: keyof PhysicalMargins, val: number) => {
    if (margins.isLinked) {
      onChangeMargins({
        top: val,
        bottom: val,
        left: val,
        right: val,
        isLinked: true
      });
    } else {
      onChangeMargins({
        ...margins,
        [side]: val
      });
    }
  };

  const applyMarginPreset = (preset: typeof MARGIN_PRESETS[0]) => {
    onChangeMargins({
      top: preset.top,
      bottom: preset.bottom,
      left: preset.left,
      right: preset.right,
      isLinked: preset.top === preset.left
    });
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Paper Format Selector */}
      <div>
        <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Standard Paper Format</label>
        <select
          value={selectedPaperId}
          onChange={(e) => handlePaperChange(e.target.value)}
          className="w-full bg-[#1b1b22] border border-[#2d2d3a] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff781f]"
        >
          {STANDARD_PAPER_SIZES.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
          <option value="custom">Custom Dimensions (mm)...</option>
        </select>
      </div>

      {/* Custom mm Inputs */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-mono text-[#6b7280]">Width (mm)</label>
          <input
            type="number"
            min={20}
            max={2000}
            value={Math.round(paperWidthMm)}
            onChange={(e) => onChangePaperSize(Number(e.target.value), paperHeightMm)}
            className="w-full bg-[#1b1b22] border border-[#2d2d3a] rounded px-2.5 py-1.5 text-xs font-mono text-white"
          />
        </div>
        <div>
          <label className="text-[10px] font-mono text-[#6b7280]">Height (mm)</label>
          <input
            type="number"
            min={20}
            max={2000}
            value={Math.round(paperHeightMm)}
            onChange={(e) => onChangePaperSize(paperWidthMm, Number(e.target.value))}
            className="w-full bg-[#1b1b22] border border-[#2d2d3a] rounded px-2.5 py-1.5 text-xs font-mono text-white"
          />
        </div>
      </div>

      {/* Orientation Toggle */}
      <div>
        <label className="text-[11px] font-mono text-[#9ca3af] block mb-1.5">Page Orientation</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleOrientation(false)}
            className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all ${
              !isLandscape ? 'bg-[#ff781f]/15 border-[#ff781f] text-[#ff781f]' : 'bg-[#1a1a20] border-[#2d2d3a] text-gray-400'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Portrait</span>
          </button>
          <button
            type="button"
            onClick={() => handleOrientation(true)}
            className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all ${
              isLandscape ? 'bg-[#ff781f]/15 border-[#ff781f] text-[#ff781f]' : 'bg-[#1a1a20] border-[#2d2d3a] text-gray-400'
            }`}
          >
            <Maximize2 className="h-3.5 w-3.5 rotate-90" />
            <span>Landscape</span>
          </button>
        </div>
      </div>

      {/* Margin Presets */}
      <div>
        <label className="text-[11px] font-mono text-[#9ca3af] block mb-1.5">Margin Presets</label>
        <div className="grid grid-cols-2 gap-1.5">
          {MARGIN_PRESETS.map(preset => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyMarginPreset(preset)}
              className="text-left p-2 rounded bg-[#1b1b22] border border-[#282835] hover:border-[#ff781f]/50 hover:bg-[#22222c] text-[11px] font-mono text-gray-300 transition-colors"
            >
              <div className="font-semibold text-white">{preset.name.split(' (')[0]}</div>
              <div className="text-[10px] text-gray-500">{preset.top}mm</div>
            </button>
          ))}
        </div>
      </div>

      {/* Independent 4-Way Margin Controls */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[11px] font-semibold text-white">Non-Printable Margins (mm)</span>
          <button
            type="button"
            onClick={() => onChangeMargins({ ...margins, isLinked: !margins.isLinked })}
            className={`p-1 rounded border text-[11px] font-mono flex items-center gap-1 ${
              margins.isLinked ? 'bg-[#ff781f]/20 border-[#ff781f] text-[#ff781f]' : 'border-[#3a3a4c] text-gray-400'
            }`}
            title={margins.isLinked ? 'Margins are linked together' : 'Margins are independent'}
          >
            {margins.isLinked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            <span>{margins.isLinked ? 'Linked' : 'Unlinked'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
          <div>
            <label className="text-gray-400 block mb-0.5">Top (mm)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={margins.top}
              onChange={(e) => handleMarginChange('top', Number(e.target.value))}
              className="w-full bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-0.5">Bottom (mm)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={margins.bottom}
              onChange={(e) => handleMarginChange('bottom', Number(e.target.value))}
              className="w-full bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-0.5">Left / Gutter (mm)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={margins.left}
              onChange={(e) => handleMarginChange('left', Number(e.target.value))}
              className="w-full bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-0.5">Right (mm)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={margins.right}
              onChange={(e) => handleMarginChange('right', Number(e.target.value))}
              className="w-full bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white"
            />
          </div>
        </div>
      </div>

      {/* Decorative Border Generator */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold text-white">Framed Page Border</span>
          <input
            type="checkbox"
            checked={borderSettings.enabled}
            onChange={(e) => onChangeBorderSettings({ ...borderSettings, enabled: e.target.checked })}
            className="rounded accent-[#ff781f] h-4 w-4"
          />
        </div>

        {borderSettings.enabled && (
          <div className="space-y-2 pt-2 border-t border-[#262634]">
            <div className="grid grid-cols-3 gap-1.5">
              {(['solid', 'dashed', 'double'] as const).map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => onChangeBorderSettings({ ...borderSettings, style })}
                  className={`py-1 text-[10px] font-mono rounded border uppercase ${
                    borderSettings.style === style ? 'border-[#ff781f] bg-[#ff781f]/20 text-white' : 'border-[#2d2d3a] text-gray-400'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-gray-400">Thickness (mm)</span>
              <input
                type="number"
                min={0.5}
                max={10}
                step={0.5}
                value={borderSettings.thicknessMm}
                onChange={(e) => onChangeBorderSettings({ ...borderSettings, thicknessMm: Number(e.target.value) })}
                className="w-16 bg-[#111115] border border-[#2b2b36] rounded px-2 py-1 text-white text-right"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
