import React, { useState } from 'react';
import { 
  FileText, 
  Move, 
  Grid, 
  RotateCw, 
  Sparkles, 
  Stamp, 
  Droplet, 
  Barcode 
} from 'lucide-react';
import { PhysicalMargins } from '../../types/document';
import { 
  BorderSettings, 
  CleanupSettings, 
  CoverageCalculation, 
  DeskewSettings, 
  HeaderFooterSettings, 
  ImpositionSettings, 
  InkIntelligenceSettings, 
  RedactionBox, 
  ScaleMode, 
  StationerySettings, 
  StationeryType, 
  VariableDataMergeSettings, 
  WatermarkSettings 
} from '../../types/studio';
import { Tab1PaperMargins } from './tabs/Tab1PaperMargins';
import { Tab2ScalingPlacement } from './tabs/Tab2ScalingPlacement';
import { Tab3Imposition } from './tabs/Tab3Imposition';
import { Tab4DeskewGeometry } from './tabs/Tab4DeskewGeometry';
import { Tab5DocumentCleanup } from './tabs/Tab5DocumentCleanup';
import { Tab6WatermarkRedaction } from './tabs/Tab6WatermarkRedaction';
import { Tab7InkIntelligence } from './tabs/Tab7InkIntelligence';
import { Tab8StationeryMerge } from './tabs/Tab8StationeryMerge';

export type InspectorTabId = 'paper' | 'scaling' | 'imposition' | 'deskew' | 'cleanup' | 'watermark' | 'ink' | 'stationery';

interface StudioInspectorProps {
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

  imposition: ImpositionSettings;
  onChangeImposition: (settings: ImpositionSettings) => void;
  totalPages: number;

  deskew: DeskewSettings;
  onChangeDeskew: (settings: DeskewSettings) => void;
  onTriggerAutoDeskew: () => void;

  cleanup: CleanupSettings;
  onChangeCleanup: (settings: CleanupSettings) => void;

  watermark: WatermarkSettings;
  onChangeWatermark: (w: WatermarkSettings) => void;
  headerFooter: HeaderFooterSettings;
  onChangeHeaderFooter: (hf: HeaderFooterSettings) => void;
  redactions: RedactionBox[];
  onAddRedaction: (box: RedactionBox) => void;
  onClearRedactions: () => void;
  activeTool: 'select' | 'redact' | 'highlight' | 'rectangle';
  onSelectActiveTool: (tool: 'select' | 'redact' | 'highlight' | 'rectangle') => void;

  inkIntel: InkIntelligenceSettings;
  onChangeInkIntel: (settings: InkIntelligenceSettings) => void;
  coverage: CoverageCalculation;
  onSquishOrphanPage: () => void;
  onOpenDuplexWizard: () => void;

  stationery: StationerySettings;
  onChangeStationery: (s: StationerySettings) => void;
  onGenerateStationery: (type: StationeryType) => void;
  variableMerge: VariableDataMergeSettings;
  onChangeVariableMerge: (vm: VariableDataMergeSettings) => void;
}

export const StudioInspector: React.FC<StudioInspectorProps> = (props) => {
  const [activeTab, setActiveTab] = useState<InspectorTabId>('paper');

  const tabs: { id: InspectorTabId; label: string; icon: any }[] = [
    { id: 'paper', label: 'Paper', icon: FileText },
    { id: 'scaling', label: 'Scale', icon: Move },
    { id: 'imposition', label: 'Impose', icon: Grid },
    { id: 'deskew', label: 'Deskew', icon: RotateCw },
    { id: 'cleanup', label: 'Clean', icon: Sparkles },
    { id: 'watermark', label: 'Marks', icon: Stamp },
    { id: 'ink', label: 'Ink Intel', icon: Droplet },
    { id: 'stationery', label: 'Stationery', icon: Barcode },
  ];

  return (
    <aside className="w-80 bg-[#16161b] border-l border-[#262632] flex flex-col h-full select-none">
      {/* 8-Tab Navigation Bar */}
      <div className="grid grid-cols-4 bg-[#141418] border-b border-[#262632] p-1 gap-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#22222d] text-[#ff781f] font-bold shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a20]'
              }`}
              title={tab.label}
            >
              <Icon className="h-4 w-4 mb-0.5" />
              <span className="text-[10px] font-mono leading-none truncate max-w-full">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Header Title */}
      <div className="px-4 py-2.5 border-b border-[#22222c] bg-[#181820] flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
          {tabs.find(t => t.id === activeTab)?.label} Settings
        </span>
        <span className="text-[10px] font-mono text-gray-500">Live Applied</span>
      </div>

      {/* Tab Panel Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'paper' && (
          <Tab1PaperMargins
            selectedPaperId={props.selectedPaperId}
            onSelectPaperId={props.onSelectPaperId}
            paperWidthMm={props.paperWidthMm}
            paperHeightMm={props.paperHeightMm}
            onChangePaperSize={props.onChangePaperSize}
            isLandscape={props.isLandscape}
            onToggleOrientation={props.onToggleOrientation}
            margins={props.margins}
            onChangeMargins={props.onChangeMargins}
            borderSettings={props.borderSettings}
            onChangeBorderSettings={props.onChangeBorderSettings}
          />
        )}

        {activeTab === 'scaling' && (
          <Tab2ScalingPlacement
            scaleMode={props.scaleMode}
            onSelectScaleMode={props.onSelectScaleMode}
            scalePercent={props.scalePercent}
            onChangeScalePercent={props.onChangeScalePercent}
            offsetX={props.offsetX}
            offsetY={props.offsetY}
            onChangeOffset={props.onChangeOffset}
            snapGrid={props.snapGrid}
            onToggleSnapGrid={props.onToggleSnapGrid}
            snapMargin={props.snapMargin}
            onToggleSnapMargin={props.onToggleSnapMargin}
            exactMmWidth={props.exactMmWidth}
            exactMmHeight={props.exactMmHeight}
            onChangeExactMm={props.onChangeExactMm}
          />
        )}

        {activeTab === 'imposition' && (
          <Tab3Imposition
            settings={props.imposition}
            onChangeSettings={props.onChangeImposition}
            totalPages={props.totalPages}
          />
        )}

        {activeTab === 'deskew' && (
          <Tab4DeskewGeometry
            settings={props.deskew}
            onChangeSettings={props.onChangeDeskew}
            onTriggerAutoDeskew={props.onTriggerAutoDeskew}
          />
        )}

        {activeTab === 'cleanup' && (
          <Tab5DocumentCleanup
            settings={props.cleanup}
            onChangeSettings={props.onChangeCleanup}
          />
        )}

        {activeTab === 'watermark' && (
          <Tab6WatermarkRedaction
            watermark={props.watermark}
            onChangeWatermark={props.onChangeWatermark}
            headerFooter={props.headerFooter}
            onChangeHeaderFooter={props.onChangeHeaderFooter}
            redactions={props.redactions}
            onAddRedaction={props.onAddRedaction}
            onClearRedactions={props.onClearRedactions}
            activeTool={props.activeTool}
            onSelectActiveTool={props.onSelectActiveTool}
          />
        )}

        {activeTab === 'ink' && (
          <Tab7InkIntelligence
            settings={props.inkIntel}
            onChangeSettings={props.onChangeInkIntel}
            coverage={props.coverage}
            onSquishOrphanPage={props.onSquishOrphanPage}
            onOpenDuplexWizard={props.onOpenDuplexWizard}
          />
        )}

        {activeTab === 'stationery' && (
          <Tab8StationeryMerge
            stationery={props.stationery}
            onChangeStationery={props.onChangeStationery}
            onGenerateStationery={props.onGenerateStationery}
            variableMerge={props.variableMerge}
            onChangeVariableMerge={props.onChangeVariableMerge}
          />
        )}
      </div>
    </aside>
  );
};
