import React from 'react';
import { DeskewSettings } from '../../../types/studio';
import { RotateCw, Crop, Wand2, Grid, RotateCcw } from 'lucide-react';

interface Tab4DeskewGeometryProps {
  settings: DeskewSettings;
  onChangeSettings: (settings: DeskewSettings) => void;
  onTriggerAutoDeskew: () => void;
}

export const Tab4DeskewGeometry: React.FC<Tab4DeskewGeometryProps> = ({
  settings,
  onChangeSettings,
  onTriggerAutoDeskew,
}) => {
  return (
    <div className="space-y-5 text-xs">
      {/* 1-Click Auto Deskew */}
      <div className="rounded-xl border border-[#2b2b38] bg-gradient-to-r from-[#17171e] to-[#1c1c24] p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold text-white flex items-center gap-1.5">
            <Wand2 className="h-3.5 w-3.5 text-[#00e5ff]" /> In-Browser Auto-Deskew
          </span>
          <span className="text-[10px] font-mono text-cyan-400">Baseline Edge Sampler</span>
        </div>
        <p className="text-[10px] text-gray-400">
          Analyzes document text baselines and page border angles to auto-level slanted scans.
        </p>

        <button
          type="button"
          onClick={onTriggerAutoDeskew}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#272733] hover:bg-[#343445] text-xs font-mono text-cyan-300 border border-[#00e5ff]/30 transition-colors"
        >
          <RotateCw className="h-3.5 w-3.5 text-[#00e5ff]" />
          <span>[ Run Auto-Deskew Analyzer ]</span>
        </button>

        {settings.autoDeskewAngle !== 0 && (
          <div className="text-[10px] font-mono text-emerald-400">
            Detected Angle Correction: {settings.autoDeskewAngle > 0 ? '+' : ''}{settings.autoDeskewAngle.toFixed(2)}°
          </div>
        )}
      </div>

      {/* Manual Precision Angle Slider */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-3 font-mono">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-300 flex items-center gap-1.5">
            <RotateCw className="h-3.5 w-3.5 text-[#ff781f]" /> Manual Angle Dial
          </span>
          <span className="font-bold text-[#ff781f]">{settings.manualAngle.toFixed(1)}°</span>
        </div>

        <input
          type="range"
          min={-45}
          max={45}
          step={0.1}
          value={settings.manualAngle}
          onChange={(e) => onChangeSettings({ ...settings, manualAngle: Number(e.target.value) })}
          className="w-full accent-[#ff781f]"
        />

        <div className="flex justify-between items-center text-[10px] text-gray-500">
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, manualAngle: Number((settings.manualAngle - 1).toFixed(1)) })}
            className="px-2 py-0.5 rounded bg-[#23232c] hover:bg-[#2e2e3a] text-gray-300"
          >
            -1.0°
          </button>
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, manualAngle: 0, autoDeskewAngle: 0 })}
            className="px-2 py-0.5 rounded bg-[#23232c] hover:bg-[#2e2e3a] text-gray-300 flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" /> Reset 0°
          </button>
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, manualAngle: Number((settings.manualAngle + 1).toFixed(1)) })}
            className="px-2 py-0.5 rounded bg-[#23232c] hover:bg-[#2e2e3a] text-gray-300"
          >
            +1.0°
          </button>
        </div>
      </div>

      {/* Scanner Border Auto-Crop */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-2 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
            <Crop className="h-3.5 w-3.5 text-amber-400" /> Scanner Bed Auto-Crop
          </span>
          <input
            type="checkbox"
            checked={settings.autoCropEnabled}
            onChange={(e) => onChangeSettings({ ...settings, autoCropEnabled: e.target.checked })}
            className="rounded accent-amber-400 h-4 w-4"
          />
        </div>
        <p className="text-[10px] text-gray-400">
          Trims dark scanner glass edges, black lid shadow margins, and paper skew corners.
        </p>
      </div>

      {/* 4-Point Keystone Perspective Warp */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-2 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
            <Grid className="h-3.5 w-3.5 text-indigo-400" /> 4-Point Keystone Pins
          </span>
          <button
            type="button"
            onClick={() => {
              if (settings.perspectivePins) {
                onChangeSettings({ ...settings, perspectivePins: null });
              } else {
                onChangeSettings({
                  ...settings,
                  perspectivePins: {
                    topLeft: { x: 5, y: 5 },
                    topRight: { x: 95, y: 5 },
                    bottomRight: { x: 95, y: 95 },
                    bottomLeft: { x: 5, y: 95 },
                  }
                });
              }
            }}
            className={`px-2 py-0.5 rounded text-[10px] border ${
              settings.perspectivePins ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300' : 'border-[#383848] text-gray-400'
            }`}
          >
            {settings.perspectivePins ? 'Active' : 'Enable Pins'}
          </button>
        </div>
        <p className="text-[10px] text-gray-400">
          Corrects mobile phone document photos taken at an angle with trapezoid keystone pins.
        </p>
      </div>

    </div>
  );
};
