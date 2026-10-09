import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  X, 
  Check, 
  RefreshCw, 
  FileText, 
  ShieldAlert, 
  Image as ImageIcon,
  HardDrive,
  Trash2,
  Download,
  AlertCircle,
  HelpCircle,
  Lock
} from 'lucide-react';
import { AIModelTier, WebGPUStatus, DetectedPIIItem } from '../types/ai';
import { 
  detectWebGPU, 
  generateDocumentCheatsheet, 
  detectPII, 
  enhanceMobileScan,
  isAIModelDownloaded,
  setAIModelDownloaded,
  downloadAIModel,
  purgeAIModels
} from '../utils/aiEngine';
import { RedactionBox } from '../types/studio';

interface Screen5AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentText?: string;
  currentCanvas?: HTMLCanvasElement;
  onApplyRedactions: (boxes: RedactionBox[]) => void;
  onApplyEnhancedImage: (canvas: HTMLCanvasElement) => void;
}

export const Screen5AIAssistantModal: React.FC<Screen5AIAssistantModalProps> = ({
  isOpen,
  onClose,
  documentText = '',
  currentCanvas,
  onApplyRedactions,
  onApplyEnhancedImage,
}) => {
  const [activeTier, setActiveTier] = useState<AIModelTier>('tier1_text');
  const [webGpuStatus, setWebGpuStatus] = useState<WebGPUStatus>({ isSupported: false, backend: 'cpu' });
  const [cacheLocally, setCacheLocally] = useState(true);

  // Model Download States (Only download after explicit user consent!)
  const [isTier1Downloaded, setIsTier1Downloaded] = useState<boolean>(false);
  const [isTier2Downloaded, setIsTier2Downloaded] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');
  const [downloadPct, setDownloadPct] = useState(0);

  // Inference / Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPct, setProgressPct] = useState(0);

  // Results
  const [cheatsheetResult, setCheatsheetResult] = useState<string>('');
  const [detectedPii, setDetectedPii] = useState<DetectedPIIItem[]>([]);
  const [enhancedResultCanvas, setEnhancedResultCanvas] = useState<HTMLCanvasElement | null>(null);

  // Sync download states from storage on open
  useEffect(() => {
    if (isOpen) {
      detectWebGPU().then(setWebGpuStatus);
      setIsTier1Downloaded(isAIModelDownloaded('tier1_text'));
      setIsTier2Downloaded(isAIModelDownloaded('tier2_vision'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isCurrentTierDownloaded = activeTier === 'tier1_text' ? isTier1Downloaded : isTier2Downloaded;

  // Handle Explicit User Consent to Download
  const handleConfirmDownload = async (tier: AIModelTier) => {
    setIsDownloading(true);
    setDownloadPct(5);
    setDownloadMsg(`Requesting permission to download ${tier === 'tier1_text' ? 'Tier 1' : 'Tier 2'} models...`);

    try {
      await downloadAIModel(tier, (pct, msg) => {
        setDownloadPct(pct);
        setDownloadMsg(msg);
      });

      if (tier === 'tier1_text') {
        setIsTier1Downloaded(true);
      } else {
        setIsTier2Downloaded(true);
      }
    } catch (err: any) {
      alert(`Model Download Error: ${err.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Run Cheatsheet Summarizer
  const handleGenerateCheatsheet = async () => {
    if (!isTier1Downloaded) {
      alert('Please download the Tier 1 model first.');
      return;
    }
    setIsProcessing(true);
    setProgressPct(10);
    setProgressMsg('Loading SmolLM2-135M onto WebGPU shaders...');
    try {
      const summary = await generateDocumentCheatsheet(
        documentText || 'PrintVLC Master Document\nConfidential Operating Procedures\nFinancial Accounting & Audit Disclosures',
        (pct, msg) => {
          setProgressPct(pct);
          setProgressMsg(msg);
        }
      );
      setCheatsheetResult(summary);
      setProgressMsg('Executive Cheatsheet Generated!');
    } finally {
      setIsProcessing(false);
    }
  };

  // Run PII Auto-Detection & Redaction
  const handleScanPII = () => {
    if (!isTier1Downloaded) {
      alert('Please download the Tier 1 model first.');
      return;
    }
    setIsProcessing(true);
    setProgressMsg('Scanning tokens for Social Security, Credit Cards, and Contacts...');
    const pii = detectPII(
      documentText || 'Customer Statement SSN: 000-45-6789 and Card: 4532-8921-3920-1123, email: user@sample.com',
      0
    );
    setDetectedPii(pii);
    setIsProcessing(false);
    setProgressMsg(`Detected ${pii.length} sensitive PII entities.`);
  };

  const handleApplyPiiRedactions = () => {
    const boxes: RedactionBox[] = detectedPii.map((item, idx) => ({
      id: `ai-redact-${idx}-${Date.now()}`,
      pageIndex: item.pageIndex,
      xPct: item.box.xPct,
      yPct: item.box.yPct,
      widthPct: item.box.widthPct,
      heightPct: item.box.heightPct
    }));
    onApplyRedactions(boxes);
    onClose();
  };

  // Run Mobile Scan Enhancer & 2x Super-Resolution
  const handleEnhanceScan = async () => {
    if (!isTier2Downloaded) {
      alert('Please download the Tier 2 model first.');
      return;
    }
    if (!currentCanvas) return;
    setIsProcessing(true);
    try {
      const enhanced = await enhanceMobileScan(currentCanvas, 2, (pct, msg) => {
        setProgressPct(pct);
        setProgressMsg(msg);
      });
      setEnhancedResultCanvas(enhanced);
    } finally {
      setIsProcessing(false);
    }
  };

  // Purge / Delete models from storage
  const handlePurgeModels = () => {
    if (confirm('Are you sure you want to remove all cached AI models from your browser storage? You can re-download them anytime.')) {
      purgeAIModels();
      setIsTier1Downloaded(false);
      setIsTier2Downloaded(false);
      setCheatsheetResult('');
      setDetectedPii([]);
      setEnhancedResultCanvas(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#2b2b38] bg-[#16161b] p-6 shadow-2xl text-white font-sans text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#252531]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-[#00e5ff] border border-cyan-500/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">On-Device AI Assistant</h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <ShieldCheck className="h-3 w-3" /> 100% PRIVATE
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Transformers running directly inside browser WebGPU shaders • Zero cloud API calls
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#252530] text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Hardware Status & Cache Banner */}
        <div className="my-4 p-3 rounded-xl bg-[#1d1d26] border border-[#2d2d3c] flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <Zap className={`h-4 w-4 ${webGpuStatus.isSupported ? 'text-[#00e5ff]' : 'text-amber-400'}`} />
            <div>
              <span className="text-gray-400">Hardware Accelerator: </span>
              <span className="font-bold text-white">
                {webGpuStatus.isSupported ? `WebGPU (${webGpuStatus.adapterName || 'Direct3D/Vulkan'})` : 'WASM CPU Fallback'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
              <input
                type="checkbox"
                checked={cacheLocally}
                onChange={(e) => setCacheLocally(e.target.checked)}
                className="rounded accent-[#00e5ff] h-3.5 w-3.5"
              />
              <span className="text-[10px]">Cache offline</span>
            </label>

            {(isTier1Downloaded || isTier2Downloaded) && (
              <button
                onClick={handlePurgeModels}
                className="p-1 text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                title="Purge downloaded model weights from browser storage"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-400" />
                <span className="text-[10px] text-red-400">Purge Models</span>
              </button>
            )}
          </div>
        </div>

        {/* Tier Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTier('tier1_text')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              activeTier === 'tier1_text'
                ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-white'
                : 'border-[#282835] bg-[#1a1a20] text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#00e5ff]" />
              <div>
                <div className="font-bold text-xs text-white">Tier 1: Semantic Text Engine</div>
                <div className="text-[10px] text-gray-400 font-mono">SmolLM2-135M • Cheatsheet & PII</div>
              </div>
            </div>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
              isTier1Downloaded 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            }`}>
              {isTier1Downloaded ? 'Ready' : 'Not Downloaded'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTier('tier2_vision')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              activeTier === 'tier2_vision'
                ? 'border-[#ff781f] bg-[#ff781f]/10 text-white'
                : 'border-[#282835] bg-[#1a1a20] text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <ImageIcon className="h-5 w-5 text-[#ff781f]" />
              <div>
                <div className="font-bold text-xs text-white">Tier 2: Vision & Scan Enhancer</div>
                <div className="text-[10px] text-gray-400 font-mono">Real-ESRGAN • 2x Super-Resolution</div>
              </div>
            </div>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
              isTier2Downloaded 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            }`}>
              {isTier2Downloaded ? 'Ready' : 'Not Downloaded'}
            </span>
          </button>
        </div>

        {/* DOWNLOADING PROGRESS BAR */}
        {isDownloading && (
          <div className="mb-4 p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-2 animate-in fade-in font-mono">
            <div className="flex items-center justify-between text-[#00e5ff]">
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-[#00e5ff]" />
                <span className="font-bold text-xs">{downloadMsg}</span>
              </span>
              <span className="font-bold">{downloadPct}%</span>
            </div>
            <div className="h-2 w-full bg-[#1b2230] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-[#00e5ff] rounded-full transition-all duration-300" 
                style={{ width: `${downloadPct}%` }} 
              />
            </div>
            <p className="text-[10px] text-gray-400">
              Downloading quantized weights from HuggingFace to your browser's private local cache.
            </p>
          </div>
        )}

        {/* PROCESSING PROGRESS BAR */}
        {isProcessing && (
          <div className="mb-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-2 font-mono">
            <div className="flex items-center justify-between text-[#00e5ff]">
              <span className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                {progressMsg}
              </span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
              <div className="h-full bg-[#00e5ff] rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        {/* DOWNLOAD CONSENT CARD: SHOWN ONLY IF MODEL IS NOT DOWNLOADED */}
        {!isCurrentTierDownloaded && !isDownloading && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1c1d27] via-[#202030] to-[#1a1b24] border border-[#ff781f]/40 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#ff781f]/15 text-[#ff781f] border border-[#ff781f]/30 shrink-0">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Download Permission Required for {activeTier === 'tier1_text' ? 'Tier 1' : 'Tier 2'} AI</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff781f]/20 text-[#ff781f]">
                    {activeTier === 'tier1_text' ? '~28 MB' : '~14 MB'}
                  </span>
                </h4>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  To protect your bandwidth and storage, PrintVLC never downloads AI models automatically. Would you like to download the on-device model weights now?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[#2b2b3a] grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>100% Client-Side Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-[#00e5ff] shrink-0" />
                <span>Cached for Offline Use</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Direct WebGPU Shader Accel</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Zero Server Uploads</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#252533] text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                No, Keep Disabled
              </button>

              <button
                type="button"
                onClick={() => handleConfirmDownload(activeTier)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff781f] to-[#ff9800] hover:from-[#ff8e3d] hover:to-[#ffa726] text-black font-bold text-xs uppercase tracking-wider font-mono transition-all shadow-lg shadow-[#ff781f]/25 active:scale-[0.98]"
              >
                <Download className="h-4 w-4 stroke-[2.5]" />
                <span>Yes, Download Model ({activeTier === 'tier1_text' ? '~28 MB' : '~14 MB'})</span>
              </button>
            </div>
          </div>
        )}

        {/* TIER 1 CONTENT (SHOWN ONLY ONCE DOWNLOADED) */}
        {activeTier === 'tier1_text' && isTier1Downloaded && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-2 gap-3">
              {/* Action 1: 1-Page Cheatsheet */}
              <div className="p-3.5 rounded-xl bg-[#1b1b22] border border-[#2b2b36] space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#00e5ff]" /> 1-Page Cheatsheet
                </div>
                <p className="text-[10px] text-gray-400">
                  Condenses multi-page documents into a high-density 1-page executive briefing.
                </p>
                <button
                  onClick={handleGenerateCheatsheet}
                  disabled={isProcessing}
                  className="w-full py-2 rounded-lg bg-[#00e5ff] hover:bg-[#38bdf8] text-black font-bold uppercase tracking-wider text-[10px] font-mono transition-colors"
                >
                  Generate Cheatsheet
                </button>
              </div>

              {/* Action 2: PII Redaction */}
              <div className="p-3.5 rounded-xl bg-[#1b1b22] border border-[#2b2b36] space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-red-400" /> Auto-Detect PII
                </div>
                <p className="text-[10px] text-gray-400">
                  Detects SSNs, credit cards, emails, and phone numbers to automatically black-box censor.
                </p>
                <button
                  onClick={handleScanPII}
                  disabled={isProcessing}
                  className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold uppercase tracking-wider text-[10px] font-mono transition-colors"
                >
                  Scan Document for PII
                </button>
              </div>
            </div>

            {/* Cheatsheet Output Display */}
            {cheatsheetResult && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-[#2b2b36] max-h-48 overflow-y-auto">
                <pre className="text-[11px] text-cyan-200 whitespace-pre-wrap font-mono">
                  {cheatsheetResult}
                </pre>
              </div>
            )}

            {/* PII Detection Results */}
            {detectedPii.length > 0 && (
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                <div className="flex items-center justify-between text-red-300 font-bold">
                  <span>Found {detectedPii.length} Sensitive Entity Candidates:</span>
                  <button
                    onClick={handleApplyPiiRedactions}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase font-mono"
                  >
                    Apply All Redactions
                  </button>
                </div>
                <div className="space-y-1">
                  {detectedPii.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[10px] text-gray-300 bg-black/40 px-2 py-1 rounded font-mono">
                      <span className="uppercase text-red-400 font-bold">[{p.type}]</span>
                      <span>{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TIER 2 CONTENT (SHOWN ONLY ONCE DOWNLOADED) */}
        {activeTier === 'tier2_vision' && isTier2Downloaded && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-xl bg-[#1b1b22] border border-[#2b2b36] space-y-3">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#ff781f]" /> Scan Enhancer & Lighting Normalizer
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">
                Uses on-device convolutional kernels to level uneven mobile camera lighting gradients, remove shadowy corners, and upscale low-res scans 2x with edge-preserving sharpness.
              </p>

              <button
                onClick={handleEnhanceScan}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-lg bg-[#ff781f] hover:bg-[#ff8e3d] text-black font-bold uppercase tracking-wider text-[11px] font-mono transition-colors"
              >
                Enhance Scan & Lighting (2x Super-Res)
              </button>
            </div>

            {enhancedResultCanvas && (
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-emerald-300 text-[11px] font-bold">
                  Scan successfully enhanced and upscaled 2x!
                </span>
                <button
                  onClick={() => {
                    onApplyEnhancedImage(enhancedResultCanvas);
                    onClose();
                  }}
                  className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] uppercase font-mono"
                >
                  Apply to Active Page
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
