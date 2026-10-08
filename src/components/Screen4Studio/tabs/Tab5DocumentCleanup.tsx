import React from 'react';
import { CleanupSettings } from '../../../types/studio';
import { Sparkles, CircleOff, Paperclip, Sun, FileCheck } from 'lucide-react';

interface Tab5DocumentCleanupProps {
  settings: CleanupSettings;
  onChangeSettings: (settings: CleanupSettings) => void;
}

export const Tab5DocumentCleanup: React.FC<Tab5DocumentCleanupProps> = ({
  settings,
  onChangeSettings,
}) => {
  return (
    <div className="space-y-4 text-xs font-mono">
      {/* Background Paper Whitening */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
            <Sun className="h-3.5 w-3.5 text-amber-400" /> Paper Background Whitener
          </span>
          <span className="text-[#ff781f] font-bold text-[11px]">{settings.normalizePaperWhiteThreshold}%</span>
        </div>
        <p className="text-[10px] text-gray-400">
          Forces aged, yellowed, browned, or dark scanner background noise to pure crisp <code className="text-[#00e5ff]">#FFFFFF</code>.
        </p>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.normalizePaperWhiteThreshold}
          onChange={(e) => onChangeSettings({ ...settings, normalizePaperWhiteThreshold: Number(e.target.value) })}
          className="w-full accent-[#ff781f]"
        />
      </div>

      {/* Ghost Text Bleed-Through Suppressor */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
            <FileCheck className="h-3.5 w-3.5 text-[#00e5ff]" /> Ghost Text Suppressor
          </span>
          <span className="text-cyan-400 font-bold text-[11px]">{settings.suppressGhostTextThreshold}%</span>
        </div>
        <p className="text-[10px] text-gray-400">
          Eliminates faint reverse-side ink bleed-through showing through thin paper stocks.
        </p>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.suppressGhostTextThreshold}
          onChange={(e) => onChangeSettings({ ...settings, suppressGhostTextThreshold: Number(e.target.value) })}
          className="w-full accent-[#00e5ff]"
        />
      </div>

      {/* Hole-Punch & Staple Removal */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-3">
        <span className="text-[11px] font-semibold text-white block">Mechanical Defect Inpainting</span>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-300 text-[11px] flex items-center gap-1.5">
            <CircleOff className="h-3.5 w-3.5 text-gray-400" /> Erase Hole-Punch Circles
          </span>
          <input
            type="checkbox"
            checked={settings.removeHolePunches}
            onChange={(e) => onChangeSettings({ ...settings, removeHolePunches: e.target.checked })}
            className="rounded accent-[#ff781f] h-4 w-4"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-300 text-[11px] flex items-center gap-1.5">
            <Paperclip className="h-3.5 w-3.5 text-gray-400" /> Erase Corner Staple Marks
          </span>
          <input
            type="checkbox"
            checked={settings.removeStaples}
            onChange={(e) => onChangeSettings({ ...settings, removeStaples: e.target.checked })}
            className="rounded accent-[#ff781f] h-4 w-4"
          />
        </label>
      </div>

      {/* Thumb & Spine Shadow Eraser */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-3">
        <span className="text-[11px] font-semibold text-white block">Handling Artifacts</span>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-300 text-[11px]">Erase Thumb Holding Marks</span>
          <input
            type="checkbox"
            checked={settings.removeThumbMarks}
            onChange={(e) => onChangeSettings({ ...settings, removeThumbMarks: e.target.checked })}
            className="rounded accent-[#ff781f] h-4 w-4"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-300 text-[11px]">Erase Book Spine Gutter Darkness</span>
          <input
            type="checkbox"
            checked={settings.removeSpineGutterShadows}
            onChange={(e) => onChangeSettings({ ...settings, removeSpineGutterShadows: e.target.checked })}
            className="rounded accent-[#ff781f] h-4 w-4"
          />
        </label>
      </div>
    </div>
  );
};
