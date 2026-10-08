import React, { useRef } from 'react';
import { HeaderFooterSettings, RedactionBox, WatermarkSettings } from '../../../types/studio';
import { Stamp, ShieldAlert, Type, Upload, Highlighter, Square, FileText } from 'lucide-react';

interface Tab6WatermarkRedactionProps {
  watermark: WatermarkSettings;
  onChangeWatermark: (w: WatermarkSettings) => void;
  headerFooter: HeaderFooterSettings;
  onChangeHeaderFooter: (hf: HeaderFooterSettings) => void;
  redactions: RedactionBox[];
  onAddRedaction: (box: RedactionBox) => void;
  onClearRedactions: () => void;
  activeTool: 'select' | 'redact' | 'highlight' | 'rectangle';
  onSelectActiveTool: (tool: 'select' | 'redact' | 'highlight' | 'rectangle') => void;
}

export const Tab6WatermarkRedaction: React.FC<Tab6WatermarkRedactionProps> = ({
  watermark,
  onChangeWatermark,
  headerFooter,
  onChangeHeaderFooter,
  redactions,
  onClearRedactions,
  activeTool,
  onSelectActiveTool,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleWatermarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        onChangeWatermark({
          ...watermark,
          enabled: true,
          customImageDataUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5 text-xs font-mono">
      {/* Interactive Tool Switcher */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3 space-y-2">
        <span className="text-[11px] font-semibold text-white block">Canvas Interactive Tools</span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onSelectActiveTool('select')}
            className={`py-1.5 px-2 rounded border text-[11px] ${
              activeTool === 'select' ? 'border-[#ff781f] bg-[#ff781f]/20 text-white font-bold' : 'border-[#2d2d3a] text-gray-400'
            }`}
          >
            Pointer / Pan
          </button>
          <button
            type="button"
            onClick={() => onSelectActiveTool('redact')}
            className={`py-1.5 px-2 rounded border text-[11px] flex items-center justify-center gap-1 ${
              activeTool === 'redact' ? 'border-red-500 bg-red-500/20 text-red-300 font-bold' : 'border-[#2d2d3a] text-gray-400'
            }`}
          >
            <ShieldAlert className="h-3 w-3" /> Censor Box
          </button>
          <button
            type="button"
            onClick={() => onSelectActiveTool('highlight')}
            className={`py-1.5 px-2 rounded border text-[11px] flex items-center justify-center gap-1 ${
              activeTool === 'highlight' ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300 font-bold' : 'border-[#2d2d3a] text-gray-400'
            }`}
          >
            <Highlighter className="h-3 w-3" /> Highlight
          </button>
        </div>
      </div>

      {/* True Redaction Permanent Censor */}
      <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-red-300 flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-red-400" /> Irreversible Pixel Redaction
          </span>
          <span className="text-[10px] text-gray-400">
            {redactions.length} Box{redactions.length === 1 ? '' : 'es'}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 leading-normal">
          Click & drag on canvas to censor sensitive data. Underlying pixel data is permanently destroyed in memory and flattened upon export.
        </p>

        {redactions.length > 0 && (
          <button
            type="button"
            onClick={onClearRedactions}
            className="w-full py-1 text-[10px] text-red-400 hover:text-red-300 border border-red-800/40 rounded bg-red-950/40"
          >
            [ Clear All Redaction Boxes ]
          </button>
        )}
      </div>

      {/* Watermark Generator */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
            <Stamp className="h-3.5 w-3.5 text-[#ff781f]" /> Watermark Generator
          </span>
          <input
            type="checkbox"
            checked={watermark.enabled}
            onChange={(e) => onChangeWatermark({ ...watermark, enabled: e.target.checked })}
            className="rounded accent-[#ff781f] h-4 w-4"
          />
        </div>

        {watermark.enabled && (
          <div className="space-y-2.5 pt-2 border-t border-[#262635]">
            <input
              type="text"
              placeholder="CONFIDENTIAL, DRAFT, COPY..."
              value={watermark.text}
              onChange={(e) => onChangeWatermark({ ...watermark, text: e.target.value })}
              className="w-full bg-[#111115] border border-[#2d2d3a] rounded px-2.5 py-1.5 text-xs text-white"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChangeWatermark({ ...watermark, isDiagonal: true })}
                className={`flex-1 py-1 text-[10px] rounded border ${
                  watermark.isDiagonal ? 'border-[#ff781f] bg-[#ff781f]/20 text-white' : 'border-[#2d2d3a] text-gray-400'
                }`}
              >
                Diagonal 45°
              </button>
              <button
                type="button"
                onClick={() => onChangeWatermark({ ...watermark, isDiagonal: false })}
                className={`flex-1 py-1 text-[10px] rounded border ${
                  !watermark.isDiagonal ? 'border-[#ff781f] bg-[#ff781f]/20 text-white' : 'border-[#2d2d3a] text-gray-400'
                }`}
              >
                Horizontal
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-400">Layering</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => onChangeWatermark({ ...watermark, layer: 'behind' })}
                  className={`px-2 py-0.5 text-[10px] rounded border ${
                    watermark.layer === 'behind' ? 'border-[#ff781f] bg-[#ff781f]/20 text-white' : 'border-[#2d2d3a] text-gray-400'
                  }`}
                >
                  Behind Content
                </button>
                <button
                  type="button"
                  onClick={() => onChangeWatermark({ ...watermark, layer: 'over' })}
                  className={`px-2 py-0.5 text-[10px] rounded border ${
                    watermark.layer === 'over' ? 'border-[#ff781f] bg-[#ff781f]/20 text-white' : 'border-[#2d2d3a] text-gray-400'
                  }`}
                >
                  Over Content
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Opacity</span>
                <span className="text-[#ff781f]">{watermark.opacity}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                value={watermark.opacity}
                onChange={(e) => onChangeWatermark({ ...watermark, opacity: Number(e.target.value) })}
                className="w-full accent-[#ff781f]"
              />
            </div>

            {/* Custom Logo Watermark Upload */}
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              onChange={handleWatermarkImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="w-full py-1.5 rounded bg-[#22222b] hover:bg-[#2b2b36] border border-[#343444] text-[10px] text-gray-300 flex items-center justify-center gap-1.5"
            >
              <Upload className="h-3 w-3" />
              <span>{watermark.customImageDataUrl ? 'Change Watermark Logo' : 'Upload Company Logo Stamp'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Header & Footer Macro Stamper */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-[#00e5ff]" /> Header & Footer Macros
          </span>
          <input
            type="checkbox"
            checked={headerFooter.enabled}
            onChange={(e) => onChangeHeaderFooter({ ...headerFooter, enabled: e.target.checked })}
            className="rounded accent-[#00e5ff] h-4 w-4"
          />
        </div>

        {headerFooter.enabled && (
          <div className="space-y-2.5 pt-2 border-t border-[#262635]">
            <div className="text-[10px] text-gray-400 bg-black/40 p-2 rounded">
              Supported Macros: <code className="text-cyan-300">[PageNumber]</code>, <code className="text-cyan-300">[TotalPages]</code>, <code className="text-cyan-300">[Filename]</code>, <code className="text-cyan-300">[CurrentDate]</code>
            </div>

            {/* Top 3 Positions */}
            <div className="grid grid-cols-3 gap-1.5">
              <input
                type="text"
                placeholder="Top Left"
                value={headerFooter.topLeft}
                onChange={(e) => onChangeHeaderFooter({ ...headerFooter, topLeft: e.target.value })}
                className="bg-[#111115] border border-[#2d2d3a] rounded px-1.5 py-1 text-[10px] text-white"
              />
              <input
                type="text"
                placeholder="Top Center"
                value={headerFooter.topCenter}
                onChange={(e) => onChangeHeaderFooter({ ...headerFooter, topCenter: e.target.value })}
                className="bg-[#111115] border border-[#2d2d3a] rounded px-1.5 py-1 text-[10px] text-white text-center"
              />
              <input
                type="text"
                placeholder="Top Right"
                value={headerFooter.topRight}
                onChange={(e) => onChangeHeaderFooter({ ...headerFooter, topRight: e.target.value })}
                className="bg-[#111115] border border-[#2d2d3a] rounded px-1.5 py-1 text-[10px] text-white text-right"
              />
            </div>

            {/* Bottom 3 Positions */}
            <div className="grid grid-cols-3 gap-1.5">
              <input
                type="text"
                placeholder="Bottom Left"
                value={headerFooter.bottomLeft}
                onChange={(e) => onChangeHeaderFooter({ ...headerFooter, bottomLeft: e.target.value })}
                className="bg-[#111115] border border-[#2d2d3a] rounded px-1.5 py-1 text-[10px] text-white"
              />
              <input
                type="text"
                placeholder="Bottom Center (p.[PageNumber])"
                value={headerFooter.bottomCenter}
                onChange={(e) => onChangeHeaderFooter({ ...headerFooter, bottomCenter: e.target.value })}
                className="bg-[#111115] border border-[#2d2d3a] rounded px-1.5 py-1 text-[10px] text-white text-center"
              />
              <input
                type="text"
                placeholder="Bottom Right"
                value={headerFooter.bottomRight}
                onChange={(e) => onChangeHeaderFooter({ ...headerFooter, bottomRight: e.target.value })}
                className="bg-[#111115] border border-[#2d2d3a] rounded px-1.5 py-1 text-[10px] text-white text-right"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
