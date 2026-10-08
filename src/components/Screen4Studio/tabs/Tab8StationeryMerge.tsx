import React, { useRef } from 'react';
import { StationerySettings, StationeryType, VariableDataMergeSettings } from '../../../types/studio';
import { 
  FileSpreadsheet, 
  Grid, 
  Upload, 
  QrCode, 
  Barcode, 
  Sparkles,
  Calendar,
  Music,
  CheckCircle2
} from 'lucide-react';
import { parseVariableDataFile } from '../../../utils/variableDataMerge';

interface Tab8StationeryMergeProps {
  stationery: StationerySettings;
  onChangeStationery: (s: StationerySettings) => void;
  onGenerateStationery: (type: StationeryType) => void;
  variableMerge: VariableDataMergeSettings;
  onChangeVariableMerge: (vm: VariableDataMergeSettings) => void;
}

export const Tab8StationeryMerge: React.FC<Tab8StationeryMergeProps> = ({
  stationery,
  onChangeStationery,
  onGenerateStationery,
  variableMerge,
  onChangeVariableMerge,
}) => {
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const records = await parseVariableDataFile(file);
      onChangeVariableMerge({
        ...variableMerge,
        enabled: true,
        records,
        activeRecordIndex: 0
      });
    }
  };

  const stationeryTemplates: { type: StationeryType; label: string; icon: any }[] = [
    { type: 'graph', label: 'Graph Paper (5mm)', icon: Grid },
    { type: 'isometric', label: 'Isometric 3D Grid', icon: Grid },
    { type: 'dot', label: 'Dot Grid Journal', icon: Sparkles },
    { type: 'millimeter', label: 'Millimeter Engineering', icon: Grid },
    { type: 'ruled', label: 'College Ruled Lines', icon: FileSpreadsheet },
    { type: 'music', label: 'Music Staves (5-Line)', icon: Music },
    { type: 'planner', label: 'Weekly Planner Sheet', icon: Calendar },
    { type: 'calendar', label: 'Monthly Calendar', icon: Calendar },
  ];

  const availableTags = variableMerge.records.length > 0 ? Object.keys(variableMerge.records[0]) : [];

  return (
    <div className="space-y-5 text-xs font-mono">
      {/* SECTION 1: ONE-CLICK STATIONERY GENERATOR */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-3">
        <span className="text-[11px] font-semibold text-white block">One-Click Stationery Sheets</span>
        <div className="grid grid-cols-2 gap-1.5">
          {stationeryTemplates.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => onGenerateStationery(item.type)}
                className="p-2 rounded bg-[#1b1b23] border border-[#2d2d3a] hover:border-[#ff781f] text-left transition-colors flex items-center gap-2 group"
              >
                <Icon className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#ff781f]" />
                <span className="text-[10px] text-gray-200 group-hover:text-white truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: VARIABLE DATA BATCH MERGE */}
      <div className="rounded-xl border border-[#2b2b38] bg-[#17171e] p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
            <Barcode className="h-3.5 w-3.5 text-[#00e5ff]" /> Variable Data Batch Merge
          </span>
          <input
            type="checkbox"
            checked={variableMerge.enabled}
            onChange={(e) => onChangeVariableMerge({ ...variableMerge, enabled: e.target.checked })}
            className="rounded accent-[#00e5ff] h-4 w-4"
          />
        </div>

        <p className="text-[10px] text-gray-400">
          Upload CSV / XLSX dataset to personalize each printed page with dynamic tags, barcodes, and QR codes.
        </p>

        {/* Upload Button */}
        <input
          type="file"
          ref={csvInputRef}
          accept=".csv,.xlsx,.xls"
          onChange={handleCsvUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => csvInputRef.current?.click()}
          className="w-full py-2 rounded bg-[#252531] hover:bg-[#2f2f3d] border border-[#3b3b4f] text-[11px] text-cyan-300 flex items-center justify-center gap-2 transition-colors"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>{variableMerge.records.length > 0 ? `Loaded ${variableMerge.records.length} Records` : 'Upload CSV / Excel Dataset'}</span>
        </button>

        {variableMerge.records.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-[#262635]">
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">Detected Merge Tags:</span>
              <div className="flex flex-wrap gap-1">
                {availableTags.map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 rounded bg-black/50 text-[#00e5ff] text-[10px] border border-cyan-800/40">
                    {`{{${tag}}}`}
                  </span>
                ))}
              </div>
            </div>

            {/* Record Navigator */}
            <div className="flex items-center justify-between bg-black/30 p-2 rounded border border-[#282835]">
              <span className="text-[10px] text-gray-400">Record:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={variableMerge.activeRecordIndex <= 0}
                  onClick={() => onChangeVariableMerge({ ...variableMerge, activeRecordIndex: variableMerge.activeRecordIndex - 1 })}
                  className="px-2 py-0.5 rounded bg-[#23232c] text-white disabled:opacity-40"
                >
                  ◀
                </button>
                <span className="text-[11px] font-bold text-white">
                  {variableMerge.activeRecordIndex + 1} / {variableMerge.records.length}
                </span>
                <button
                  type="button"
                  disabled={variableMerge.activeRecordIndex >= variableMerge.records.length - 1}
                  onClick={() => onChangeVariableMerge({ ...variableMerge, activeRecordIndex: variableMerge.activeRecordIndex + 1 })}
                  className="px-2 py-0.5 rounded bg-[#23232c] text-white disabled:opacity-40"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Dynamic Barcode & QR Code mapping */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <label className="text-gray-400 block mb-0.5 flex items-center gap-1">
                  <Barcode className="h-3 w-3" /> Code-128 Tag
                </label>
                <select
                  value={variableMerge.barcodeField || ''}
                  onChange={(e) => onChangeVariableMerge({ ...variableMerge, barcodeField: e.target.value })}
                  className="w-full bg-[#111115] border border-[#2b2b36] rounded px-1.5 py-1 text-white"
                >
                  <option value="">None</option>
                  {availableTags.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 block mb-0.5 flex items-center gap-1">
                  <QrCode className="h-3 w-3" /> QR Code Tag
                </label>
                <select
                  value={variableMerge.qrField || ''}
                  onChange={(e) => onChangeVariableMerge({ ...variableMerge, qrField: e.target.value })}
                  className="w-full bg-[#111115] border border-[#2b2b36] rounded px-1.5 py-1 text-white"
                >
                  <option value="">None</option>
                  {availableTags.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
