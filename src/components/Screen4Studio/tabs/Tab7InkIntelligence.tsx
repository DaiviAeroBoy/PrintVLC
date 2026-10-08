import React from 'react';
import { CoverageCalculation, InkIntelligenceSettings } from '../../../types/studio';
import { 
  Droplet, 
  Leaf, 
  Moon, 
  Layers, 
  DollarSign, 
  Scissors, 
  Printer, 
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

interface Tab7InkIntelligenceProps {
  settings: InkIntelligenceSettings;
  onChangeSettings: (settings: InkIntelligenceSettings) => void;
  coverage: CoverageCalculation;
  onSquishOrphanPage: () => void;
  onOpenDuplexWizard: () => void;
}

export const Tab7InkIntelligence: React.FC<Tab7InkIntelligenceProps> = ({
  settings,
  onChangeSettings,
  coverage,
  onSquishOrphanPage,
  onOpenDuplexWizard,
}) => {
  return (
    <div className="space-y-4 text-xs font-mono">
      {/* Real-Time CMYK Coverage & Cost Estimator Card */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#16161c] p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Prepress CMYK Density & Cost
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">
            ~${coverage.estimatedCostPerSheet.toFixed(3)} / Sheet
          </span>
        </div>

        {/* 4-Color Bars */}
        <div className="space-y-1.5 text-[10px]">
          <div>
            <div className="flex justify-between text-cyan-300 mb-0.5">
              <span>Cyan (C)</span>
              <span>{coverage.cyanPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#23232c] rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${Math.min(100, coverage.cyanPct * 2)}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-pink-400 mb-0.5">
              <span>Magenta (M)</span>
              <span>{coverage.magentaPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#23232c] rounded-full overflow-hidden">
              <div className="h-full bg-pink-500 rounded-full" style={{ width: `${Math.min(100, coverage.magentaPct * 2)}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-yellow-300 mb-0.5">
              <span>Yellow (Y)</span>
              <span>{coverage.yellowPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#23232c] rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${Math.min(100, coverage.yellowPct * 2)}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-gray-200 mb-0.5">
              <span>Key Black (K)</span>
              <span>{coverage.blackPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#23232c] rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(100, coverage.blackPct * 2)}%` }} />
            </div>
          </div>
        </div>

        <div className="pt-1 flex justify-between text-[10px] text-gray-400 border-t border-[#262635]">
          <span>Total Ink Coverage (TIC):</span>
          <span className="font-bold text-white">{coverage.totalCoveragePct}%</span>
        </div>
      </div>

      {/* Pure K-Channel Black Lock */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3 space-y-1.5">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-white text-[11px] font-semibold flex items-center gap-1.5">
            <Droplet className="h-3.5 w-3.5 text-white" /> Pure K-Channel Black Lock
          </span>
          <input
            type="checkbox"
            checked={settings.pureKChannelLock}
            onChange={(e) => onChangeSettings({ ...settings, pureKChannelLock: e.target.checked })}
            className="rounded accent-white h-4 w-4"
          />
        </label>
        <p className="text-[10px] text-gray-400">
          Forces off-black (<code className="text-gray-300">#1A1A1A</code>) and dark RGB text to pure 100% K black, preventing color toner contamination on laser printers.
        </p>
      </div>

      {/* Eco Toner Saver */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3 space-y-1.5">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-white text-[11px] font-semibold flex items-center gap-1.5">
            <Leaf className="h-3.5 w-3.5 text-emerald-400" /> Eco Toner Saver (-25% Ink)
          </span>
          <input
            type="checkbox"
            checked={settings.ecoTonerSaver}
            onChange={(e) => onChangeSettings({ ...settings, ecoTonerSaver: e.target.checked })}
            className="rounded accent-emerald-400 h-4 w-4"
          />
        </label>
        <p className="text-[10px] text-gray-400">
          Applies micro-halftone screening to reduce cartridge consumption while preserving sharp glyph edges.
        </p>
      </div>

      {/* Dark Mode Neutralizer */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3 space-y-1.5">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-white text-[11px] font-semibold flex items-center gap-1.5">
            <Moon className="h-3.5 w-3.5 text-amber-400" /> Dark Mode Neutralizer
          </span>
          <input
            type="checkbox"
            checked={settings.darkModeNeutralizer}
            onChange={(e) => onChangeSettings({ ...settings, darkModeNeutralizer: e.target.checked })}
            className="rounded accent-amber-400 h-4 w-4"
          />
        </label>
        <p className="text-[10px] text-gray-400">
          Inverts dark website/code backgrounds to crisp white and light text to dark black, saving massive amounts of toner.
        </p>
      </div>

      {/* CMYK Soft Proofing */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3 space-y-2">
        <span className="text-[11px] font-semibold text-white block">CMYK Soft Proofing Paper Stocks</span>
        <div className="grid grid-cols-4 gap-1">
          {(['none', 'matte', 'glossy', 'uncoated'] as const).map(stock => (
            <button
              key={stock}
              type="button"
              onClick={() => onChangeSettings({ ...settings, cmykSoftProof: stock })}
              className={`py-1 text-[10px] rounded border uppercase ${
                settings.cmykSoftProof === stock ? 'border-[#00e5ff] bg-[#00e5ff]/20 text-white font-bold' : 'border-[#2d2d3a] text-gray-400'
              }`}
            >
              {stock}
            </button>
          ))}
        </div>
      </div>

      {/* Orphan Page Squisher */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
            <Scissors className="h-3.5 w-3.5 text-amber-400" /> Orphan Page Squisher
          </span>
        </div>
        <p className="text-[10px] text-gray-400">
          Shrinks document margins and scale by 2%–4% to eliminate trailing pages with only 2–3 lines.
        </p>
        <button
          type="button"
          onClick={onSquishOrphanPage}
          className="w-full py-1.5 rounded bg-amber-500 text-black font-semibold text-[11px] hover:bg-amber-400 transition-colors"
        >
          [ Squish Trailing Orphan Page ]
        </button>
      </div>

      {/* Diagnostic Patterns */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3 space-y-2">
        <span className="text-[11px] font-semibold text-white block">Printhead Diagnostic Targets</span>
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, diagnosticPattern: 'none' })}
            className={`py-1 text-[10px] rounded border ${settings.diagnosticPattern === 'none' ? 'border-white text-white' : 'border-[#2d2d3a] text-gray-400'}`}
          >
            None
          </button>
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, diagnosticPattern: 'cmyk_purge' })}
            className={`py-1 text-[10px] rounded border ${settings.diagnosticPattern === 'cmyk_purge' ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30' : 'border-[#2d2d3a] text-gray-400'}`}
          >
            CMYK Purge
          </button>
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, diagnosticPattern: 'duplex_alignment' })}
            className={`py-1 text-[10px] rounded border ${settings.diagnosticPattern === 'duplex_alignment' ? 'border-red-400 text-red-300 bg-red-950/30' : 'border-[#2d2d3a] text-gray-400'}`}
          >
            Duplex Grid
          </button>
        </div>
      </div>

      {/* Manual Duplex Wizard UI Button */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
            <Printer className="h-3.5 w-3.5 text-[#00e5ff]" /> Manual Duplex Wizard
          </span>
        </div>
        <p className="text-[10px] text-gray-400">
          For single-sided printers: prints odd pages, provides animated 3D flip guide, then prints even pages.
        </p>
        <button
          type="button"
          onClick={onOpenDuplexWizard}
          className="w-full py-1.5 rounded bg-[#272733] hover:bg-[#343445] text-xs font-mono text-cyan-300 border border-[#00e5ff]/30 transition-colors"
        >
          [ Launch Manual Duplex Wizard ]
        </button>
      </div>

    </div>
  );
};
