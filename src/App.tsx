import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PageItem, PhysicalMargins } from './types/document';
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
} from './types/studio';
import { STANDARD_PAPER_SIZES } from './constants/paperSizes';
import { StorageMode, storageService } from './utils/storage';
import { streamToSystemSpooler } from './utils/hardwareConnector';
import { exportToPrintReadyPdf } from './utils/pdfExport';
import { generateStationeryPage } from './utils/stationeryGenerator';
import { estimateDeskewAngle } from './utils/imageFilters';

import { Screen1ConsentModal } from './components/Screen1ConsentModal';
import { Screen2HardwareHub } from './components/Screen2HardwareHub';
import { Screen3UniversalDropzone } from './components/Screen3UniversalDropzone';
import { StudioHeader } from './components/Screen4Studio/StudioHeader';
import { StudioFilmstrip } from './components/Screen4Studio/StudioFilmstrip';
import { StudioCanvas } from './components/Screen4Studio/StudioCanvas';
import { StudioScrubber } from './components/Screen4Studio/StudioScrubber';
import { StudioInspector } from './components/Screen4Studio/StudioInspector';
import { DuplexWizardModal } from './components/Screen4Studio/DuplexWizardModal';
import { Screen5AIAssistantModal } from './components/Screen5AIAssistantModal';

export function App() {
  // Navigation & Screen States
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<'studio' | 'hardware' | 'dropzone'>('dropzone');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isDuplexWizardOpen, setIsDuplexWizardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Hardware Connection
  const [connectionType, setConnectionType] = useState<'usb' | 'network' | 'bluetooth' | 'spooler'>('spooler');

  // Document Pages Queue
  const [pages, setPages] = useState<PageItem[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // Paper & Margins (Tab 1)
  const [selectedPaperId, setSelectedPaperId] = useState<string>('a4');
  const [paperWidthMm, setPaperWidthMm] = useState<number>(210);
  const [paperHeightMm, setPaperHeightMm] = useState<number>(297);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [margins, setMargins] = useState<PhysicalMargins>({
    top: 15,
    bottom: 15,
    left: 15,
    right: 15,
    isLinked: true
  });
  const [borderSettings, setBorderSettings] = useState<BorderSettings>({
    enabled: false,
    style: 'solid',
    thicknessMm: 1,
    color: '#000000'
  });

  // Scaling & Placement (Tab 2)
  const [scaleMode, setScaleMode] = useState<ScaleMode>('fit');
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [snapGrid, setSnapGrid] = useState<boolean>(true);
  const [snapMargin, setSnapMargin] = useState<boolean>(true);
  const [exactMmWidth, setExactMmWidth] = useState<number>(180);
  const [exactMmHeight, setExactMmHeight] = useState<number>(267);

  // Imposition (Tab 3)
  const [imposition, setImposition] = useState<ImpositionSettings>({
    mode: 'single',
    nupCount: 2,
    cellGapMm: 4,
    showCutLines: true,
    bookletSignatureSize: 4,
    spineGutterMm: 20,
    paperGsm: 80,
    showFoldMarks: true,
    posterCols: 2,
    posterRows: 2,
    glueTabMm: 10,
    cutCrosshairs: true,
    coordinateStamps: true,
    idCutCount: 8
  });

  // Deskew & Geometry (Tab 4)
  const [deskew, setDeskew] = useState<DeskewSettings>({
    autoDeskewAngle: 0,
    manualAngle: 0,
    perspectivePins: null,
    autoCropEnabled: false
  });

  // Document Cleanup (Tab 5)
  const [cleanup, setCleanup] = useState<CleanupSettings>({
    removeHolePunches: false,
    removeStaples: false,
    removeThumbMarks: false,
    removeSpineGutterShadows: false,
    suppressGhostTextThreshold: 0,
    normalizePaperWhiteThreshold: 0
  });

  // Watermarks, Headers, Redactions (Tab 6)
  const [watermark, setWatermark] = useState<WatermarkSettings>({
    enabled: false,
    text: 'CONFIDENTIAL',
    isDiagonal: true,
    opacity: 18,
    layer: 'behind',
    fontSizePt: 48,
    color: '#94a3b8'
  });
  const [headerFooter, setHeaderFooter] = useState<HeaderFooterSettings>({
    enabled: false,
    topLeft: '',
    topCenter: '',
    topRight: '',
    bottomLeft: '[Filename]',
    bottomCenter: 'Page [PageNumber] of [TotalPages]',
    bottomRight: '[CurrentDate]',
    fontSizePt: 9,
    fontColor: '#475569'
  });
  const [redactions, setRedactions] = useState<RedactionBox[]>([]);
  const [activeTool, setActiveTool] = useState<'select' | 'redact' | 'highlight' | 'rectangle'>('select');

  // Ink Intelligence (Tab 7)
  const [inkIntel, setInkIntel] = useState<InkIntelligenceSettings>({
    pureKChannelLock: true,
    ecoTonerSaver: false,
    ecoTonerSavingsPct: 20,
    darkModeNeutralizer: false,
    cmykSoftProof: 'none',
    orphanPageSquisherActive: false,
    diagnosticPattern: 'none'
  });
  const [coverage, setCoverage] = useState<CoverageCalculation>({
    cyanPct: 3.2,
    magentaPct: 4.1,
    yellowPct: 1.8,
    blackPct: 8.4,
    totalCoveragePct: 17.5,
    estimatedCostPerSheet: 0.031
  });

  // Stationery & Merge (Tab 8)
  const [stationery, setStationery] = useState<StationerySettings>({
    type: 'none',
    gridSpacingMm: 5,
    lineColor: '#94a3b8',
    accentColor: '#ef4444'
  });
  const [variableMerge, setVariableMerge] = useState<VariableDataMergeSettings>({
    enabled: false,
    records: [],
    activeRecordIndex: 0
  });

  // Viewport & Studio Navigation
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const renderedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check consent on startup
  useEffect(() => {
    const consent = storageService.getConsent();
    if (consent.hasConsented) {
      setHasConsented(true);
    }
  }, []);

  const handleConsentConfirm = (mode: StorageMode) => {
    storageService.setConsent(mode);
    setHasConsented(true);
  };

  // Ingestion handler from Dropzone
  const handlePagesIngested = (newPages: PageItem[]) => {
    setPages(prev => [...prev, ...newPages]);
    setActivePageIndex(0);
    setCurrentScreen('studio');
  };

  // Stationery generator trigger
  const handleGenerateStationery = (type: StationeryType) => {
    const page = generateStationeryPage({ ...stationery, type }, paperWidthMm, paperHeightMm);
    setPages(prev => [...prev, page]);
    setActivePageIndex(pages.length);
    setCurrentScreen('studio');
  };

  // Page reordering and manipulation
  const handleDeletePage = (idx: number) => {
    if (pages.length <= 1) return;
    const next = pages.filter((_, i) => i !== idx);
    setPages(next);
    setActivePageIndex(Math.min(activePageIndex, next.length - 1));
  };

  const handleRotatePage = (idx: number) => {
    const next = [...pages];
    next[idx].rotation = ((next[idx].rotation || 0) + 90) % 360;
    setPages(next);
  };

  const handleDuplicatePage = (idx: number) => {
    const copy = { ...pages[idx], id: `${pages[idx].id}-copy-${Date.now()}` };
    const next = [...pages.slice(0, idx + 1), copy, ...pages.slice(idx + 1)];
    setPages(next);
  };

  const handleAddBlankPage = () => {
    const blank: PageItem = {
      id: `blank-${Date.now()}`,
      pageNumber: pages.length + 1,
      sourceFileName: 'Blank Page',
      sourceFileType: 'Blank',
      widthPt: (paperWidthMm / 25.4) * 72,
      heightPt: (paperHeightMm / 25.4) * 72,
      rotation: 0,
      isCustomBlank: true
    };
    setPages([...pages, blank]);
    setActivePageIndex(pages.length);
  };

  const handleMovePage = (fromIdx: number, toIdx: number) => {
    const next = [...pages];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setPages(next);
    setActivePageIndex(toIdx);
  };

  // Auto-Deskew trigger
  const handleTriggerAutoDeskew = () => {
    if (renderedCanvasRef.current) {
      const angle = estimateDeskewAngle(renderedCanvasRef.current);
      setDeskew(prev => ({ ...prev, autoDeskewAngle: angle }));
    }
  };

  // Orphan Page Squisher: shrink margins and scale by 3%
  const handleSquishOrphanPage = () => {
    setMargins(prev => ({
      ...prev,
      top: Math.max(4, prev.top - 2),
      bottom: Math.max(4, prev.bottom - 2),
      left: Math.max(4, prev.left - 2),
      right: Math.max(4, prev.right - 2),
    }));
    setScalePercent(prev => Math.max(50, prev - 3));
    alert('Orphan Page Squisher applied: Margins reduced by 2mm and scale reduced by 3% to pull trailing text into previous sheet.');
  };

  // Export to Print-Ready Master PDF
  const handleExportPdf = async () => {
    if (!renderedCanvasRef.current) return;
    setIsExporting(true);
    try {
      await exportToPrintReadyPdf(
        [renderedCanvasRef.current],
        paperWidthMm,
        paperHeightMm,
        `PrintVLC_${pages[activePageIndex]?.sourceFileName || 'Master'}.pdf`
      );
    } catch (e: any) {
      alert(`PDF Export Error: ${e.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Print execution: Streams to System Spooler
  const handlePrint = () => {
    if (!renderedCanvasRef.current) return;
    setIsPrinting(true);

    try {
      streamToSystemSpooler([renderedCanvasRef.current]);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.85 }
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const activePage = pages[activePageIndex];

  return (
    <div className="min-h-screen bg-[#121214] text-[#f3f4f6] flex flex-col antialiased selection:bg-[#ff781f] selection:text-white">
      
      {/* SCREEN 1: Privacy & Storage Consent Modal */}
      <Screen1ConsentModal
        isOpen={!hasConsented}
        onConfirm={handleConsentConfirm}
      />

      {/* Main App Bar / Header */}
      <StudioHeader
        documentName={activePage?.sourceFileName || 'Universal Print Queue'}
        totalPages={pages.length}
        connectionType={connectionType}
        onOpenHardwareHub={() => setCurrentScreen('hardware')}
        onOpenDropzone={() => setCurrentScreen('dropzone')}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
        isExporting={isExporting}
        isPrinting={isPrinting}
      />

      {/* Main Body Content according to current screen */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SCREEN 2: Hardware Connection Hub */}
        {currentScreen === 'hardware' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-7xl mx-auto w-full">
            <Screen2HardwareHub
              activeConnectionType={connectionType}
              onSelectConnectionType={(type) => setConnectionType(type)}
              onProceedToStudio={() => {
                if (pages.length === 0) {
                  setCurrentScreen('dropzone');
                } else {
                  setCurrentScreen('studio');
                }
              }}
            />
          </div>
        )}

        {/* SCREEN 3: Universal File Dropzone */}
        {currentScreen === 'dropzone' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-6xl mx-auto w-full">
            <Screen3UniversalDropzone
              onPagesIngested={handlePagesIngested}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        )}

        {/* SCREEN 4: Master Pre-Flight Canvas & Studio (Main UI) */}
        {currentScreen === 'studio' && (
          <>
            {/* Left Sidebar (Filmstrip) */}
            <StudioFilmstrip
              pages={pages}
              activePageIndex={activePageIndex}
              onSelectPage={setActivePageIndex}
              onDeletePage={handleDeletePage}
              onRotatePage={handleRotatePage}
              onDuplicatePage={handleDuplicatePage}
              onAddBlankPage={handleAddBlankPage}
              onMovePage={handleMovePage}
            />

            {/* Center WYSIWYG Workspace */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
              <StudioCanvas
                activePage={activePage}
                pageIndex={activePageIndex}
                totalPages={pages.length}
                paperWidthMm={paperWidthMm}
                paperHeightMm={paperHeightMm}
                margins={margins}
                scaleMode={scaleMode}
                scalePercent={scalePercent}
                borderSettings={borderSettings}
                imposition={imposition}
                deskew={deskew}
                cleanup={cleanup}
                watermark={watermark}
                headerFooter={headerFooter}
                inkIntel={inkIntel}
                redactions={redactions}
                onAddRedaction={(box) => setRedactions([...redactions, box])}
                activeTool={activeTool}
                zoomLevel={zoomLevel}
                isPreviewMode={isPreviewMode}
                onCoverageCalculated={setCoverage}
                onCanvasRendered={(canvas) => {
                  renderedCanvasRef.current = canvas;
                }}
              />

              {/* Bottom Scrubber & Navigation Controls */}
              <StudioScrubber
                pages={pages}
                activePageIndex={activePageIndex}
                onSelectPage={setActivePageIndex}
                zoomLevel={zoomLevel}
                onChangeZoom={setZoomLevel}
                onFitToScreen={() => setZoomLevel(100)}
                isPreviewMode={isPreviewMode}
                onTogglePreviewMode={() => setIsPreviewMode(!isPreviewMode)}
              />
            </main>

            {/* Right Sidebar (Tabbed Inspector: 8 Tabs) */}
            <StudioInspector
              selectedPaperId={selectedPaperId}
              onSelectPaperId={setSelectedPaperId}
              paperWidthMm={paperWidthMm}
              paperHeightMm={paperHeightMm}
              onChangePaperSize={(w, h) => {
                setPaperWidthMm(w);
                setPaperHeightMm(h);
              }}
              isLandscape={isLandscape}
              onToggleOrientation={setIsLandscape}
              margins={margins}
              onChangeMargins={setMargins}
              borderSettings={borderSettings}
              onChangeBorderSettings={setBorderSettings}

              scaleMode={scaleMode}
              onSelectScaleMode={setScaleMode}
              scalePercent={scalePercent}
              onChangeScalePercent={setScalePercent}
              offsetX={offsetX}
              offsetY={offsetY}
              onChangeOffset={(x, y) => {
                setOffsetX(x);
                setOffsetY(y);
              }}
              snapGrid={snapGrid}
              onToggleSnapGrid={setSnapGrid}
              snapMargin={snapMargin}
              onToggleSnapMargin={setSnapMargin}
              exactMmWidth={exactMmWidth}
              exactMmHeight={exactMmHeight}
              onChangeExactMm={(w, h) => {
                setExactMmWidth(w);
                setExactMmHeight(h);
              }}

              imposition={imposition}
              onChangeImposition={setImposition}
              totalPages={pages.length}

              deskew={deskew}
              onChangeDeskew={setDeskew}
              onTriggerAutoDeskew={handleTriggerAutoDeskew}

              cleanup={cleanup}
              onChangeCleanup={setCleanup}

              watermark={watermark}
              onChangeWatermark={setWatermark}
              headerFooter={headerFooter}
              onChangeHeaderFooter={setHeaderFooter}
              redactions={redactions}
              onAddRedaction={(box) => setRedactions([...redactions, box])}
              onClearRedactions={() => setRedactions([])}
              activeTool={activeTool}
              onSelectActiveTool={setActiveTool}

              inkIntel={inkIntel}
              onChangeInkIntel={setInkIntel}
              coverage={coverage}
              onSquishOrphanPage={handleSquishOrphanPage}
              onOpenDuplexWizard={() => setIsDuplexWizardOpen(true)}

              stationery={stationery}
              onChangeStationery={setStationery}
              onGenerateStationery={handleGenerateStationery}
              variableMerge={variableMerge}
              onChangeVariableMerge={setVariableMerge}
            />
          </>
        )}

      </div>

      {/* SCREEN 5: On-Device AI Assistant Modal */}
      <Screen5AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        documentText={activePage?.sourceFileName || 'PrintVLC Executive Statement and Ingestion Queue'}
        currentCanvas={renderedCanvasRef.current || undefined}
        onApplyRedactions={(boxes) => setRedactions([...redactions, ...boxes])}
        onApplyEnhancedImage={(enhanced) => {
          if (pages[activePageIndex]) {
            const next = [...pages];
            next[activePageIndex].canvasPreviewUrl = enhanced.toDataURL('image/png');
            setPages(next);
          }
        }}
      />

      {/* Manual Duplex Wizard Modal */}
      <DuplexWizardModal
        isOpen={isDuplexWizardOpen}
        onClose={() => setIsDuplexWizardOpen(false)}
        totalPages={pages.length}
        onPrintOddPages={() => {
          alert('Printing Odd Pages Batch (1, 3, 5...) to input tray.');
        }}
        onPrintEvenPages={() => {
          alert('Printing Even Pages Batch in reverse order to back of stack.');
        }}
      />

    </div>
  );
}

export default App;
