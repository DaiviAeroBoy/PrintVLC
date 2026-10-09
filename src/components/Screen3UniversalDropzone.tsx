import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image, 
  Code, 
  FolderUp, 
  FileCode2, 
  Cpu, 
  Layers, 
  Sparkles, 
  Check, 
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { PageItem } from '../types/document';
import { stitchDocumentHopper } from '../utils/documentHopper';

interface Screen3UniversalDropzoneProps {
  onPagesIngested: (pages: PageItem[]) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  totalPages?: number;
  onNavigateToStudio?: () => void;
}

export const Screen3UniversalDropzone: React.FC<Screen3UniversalDropzoneProps> = ({
  onPagesIngested,
  isLoading,
  setIsLoading,
  totalPages = 0,
  onNavigateToStudio
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const processFileList = async (files: File[]) => {
    if (!files.length) return;
    setIsLoading(true);
    setStatusMessage(`Demuxing ${files.length} file(s) in client worker pipeline...`);

    try {
      const queue = await stitchDocumentHopper(files);
      setStatusMessage(`Successfully stitched ${queue.length} paginated print queue items.`);
      onPagesIngested(queue);
    } catch (err: any) {
      setStatusMessage(`Error during demuxing: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    await processFileList(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await processFileList(files);
    }
  };

  // Preset demo generator for instant 1-click test
  const handleLoadDemoSamples = async (sampleType: 'mixed' | 'zpl' | 'cad' | 'code') => {
    setIsLoading(true);
    setStatusMessage(`Generating sample ${sampleType} stream...`);

    let dummyFiles: File[] = [];

    if (sampleType === 'mixed') {
      const txtFile = new File([
        `PRINTVLC DEMONSTRATION DOCUMENT\nUniversal Client-Side Print Engine\n\nFeatures Included:\n1. 100% In-Browser Sandbox Execution\n2. Pure K-Channel Black Lock for Laser Printers\n3. Eco Toner Saver with edge-preserving micro-screening\n4. Pro Booklet Saddle-Stitch Imposition with GSM Creep Compensation\n5. On-Device AI PII Redaction & 1-Page Cheatsheet Summarizer\n\nZero files uploaded to any server. Complete privacy.`
      ], 'PrintVLC_Overview.txt', { type: 'text/plain' });

      // Generate a test canvas image
      const c = document.createElement('canvas');
      c.width = 1200;
      c.height = 1600;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1200, 1600);
      ctx.fillStyle = '#ff781f';
      ctx.fillRect(80, 80, 240, 12);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('FINANCIAL AUDIT REPORT', 80, 160);
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#4b5563';
      ctx.fillText('Confidential Client Statement — Account #4829-1920-5511', 80, 210);
      ctx.fillText('Customer SSN: 000-12-3456 | Contact: ops@printvlc.internal', 80, 250);
      
      const blob = await new Promise<Blob>((res) => c.toBlob(b => res(b!), 'image/png'));
      const imgFile = new File([blob], 'Client_Statement_Scan.png', { type: 'image/png' });

      dummyFiles = [txtFile, imgFile];
    } else if (sampleType === 'zpl') {
      const zplContent = `^XA
^FO50,50^ADN,36,20^FDPRINTVLC EXPRESS SHIPPING^FS
^FO50,110^ADN,18,10^FDPRIORITY AIR FREIGHT^FS
^FO50,150^ADN,18,10^FDTRACKING: 1Z9999999999999999^FS
^FO50,200^BCN,100,Y,N,N^FDPRINTVLC-49204^FS
^XZ`;
      dummyFiles = [new File([zplContent], 'Thermal_Label.zpl', { type: 'text/plain' })];
    } else if (sampleType === 'cad') {
      const dxfContent = `0\nSECTION\n2\nENTITIES\n0\nLINE\n10\n-200.0\n20\n-100.0\n11\n200.0\n21\n100.0\n0\nCIRCLE\n10\n0.0\n20\n0.0\n40\n80.0\n0\nENDSEC\n0\nEOF`;
      dummyFiles = [new File([dxfContent], 'Mechanical_Gear_2D.dxf', { type: 'text/plain' })];
    } else if (sampleType === 'code') {
      const codeContent = `// PrintVLC Hardware Kernel v2.4
import { HardwareConnector } from './hardware';

export class PrintQueueManager {
  private activeJobs: PrintJob[] = [];

  public async dispatchDirectUSB(bytes: Uint8Array): Promise<boolean> {
    const usb = await navigator.usb.requestDevice({ filters: [{ classCode: 7 }] });
    await usb.open();
    await usb.claimInterface(0);
    await usb.transferOut(1, bytes);
    return true;
  }
}`;
      dummyFiles = [new File([codeContent], 'PrintKernel.ts', { type: 'text/plain' })];
    }

    await processFileList(dummyFiles);
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFileSelect}
        // @ts-ignore
        webkitdirectory="true"
        directory="true"
        multiple
        className="hidden"
      />

      {/* Queue Status Banner if documents are loaded */}
      {totalPages > 0 && onNavigateToStudio && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#1c1c28] via-[#222230] to-[#1c1c28] border border-[#ff781f]/40 shadow-xl shadow-black/40 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#ff781f]/15 text-[#ff781f] border border-[#ff781f]/30">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Active Print Queue Loaded</h4>
              <p className="text-xs text-gray-300">
                You currently have <span className="text-[#ff781f] font-mono font-bold">{totalPages} page{totalPages > 1 ? 's' : ''}</span> in your studio queue ready for preflighting and printing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToStudio}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff781f] hover:bg-[#ff8e3d] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md shadow-[#ff781f]/20 shrink-0"
          >
            <span>Go to Studio Editor</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Main Drag-and-Drop Ingestion Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-3xl border-2 border-dashed p-10 md:p-14 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[380px] ${
          isDragOver
            ? 'border-[#ff781f] bg-[#ff781f]/10 scale-[1.008]'
            : 'border-[#2f2f3d] bg-[#16161b] hover:border-[#434356]'
        }`}
      >
        {/* Animated Glow Halo */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#ff781f]/5 via-transparent to-transparent pointer-events-none" />

        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#23232c] border border-[#343444] text-[#ff781f] mb-6 shadow-xl shadow-black/40">
          <UploadCloud className={`h-10 w-10 ${isLoading ? 'animate-bounce text-[#00e5ff]' : ''}`} />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          Universal Document Ingestion Dropzone
        </h2>
        <p className="text-sm text-[#9ca3af] max-w-lg mb-6 leading-relaxed">
          Drop single files, multi-file batches, or entire folders. The Universal Document Hopper stitches multi-format drops (e.g. 1 DOCX + 4 JPGs + 1 PDF) into one continuous paginated print queue.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff781f] text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-[#ff8e3d] active:scale-[0.98] transition-all shadow-lg shadow-[#ff781f]/20"
          >
            <FileText className="h-4 w-4" />
            <span>Select Files</span>
          </button>

          <button
            onClick={() => folderInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#252530] border border-[#373748] text-white font-semibold text-xs font-mono uppercase tracking-wider hover:bg-[#2e2e3d] active:scale-[0.98] transition-all"
          >
            <FolderUp className="h-4 w-4 text-cyan-400" />
            <span>Select Folder</span>
          </button>
        </div>

        {/* Supported Codec Badges Grid */}
        <div className="flex flex-wrap justify-center items-center gap-2 max-w-3xl pt-4 border-t border-[#262632]">
          <span className="text-[10px] font-mono text-gray-500 uppercase mr-1">SUPPORTED FORMATS:</span>
          
          <span className="rounded bg-[#202028] px-2 py-0.5 text-[11px] font-mono text-emerald-400 border border-emerald-500/20">
            PDF • DOCX • XLSX • CSV
          </span>
          <span className="rounded bg-[#202028] px-2 py-0.5 text-[11px] font-mono text-[#00e5ff] border border-[#00e5ff]/20">
            PNG • JPG • TIFF • PSD • DXF
          </span>
          <span className="rounded bg-[#202028] px-2 py-0.5 text-[11px] font-mono text-amber-400 border border-amber-500/20">
            ZPL • ESC/POS (Thermal)
          </span>
          <span className="rounded bg-[#202028] px-2 py-0.5 text-[11px] font-mono text-indigo-400 border border-indigo-500/20">
            Markdown • Code (Syntax Prism)
          </span>
        </div>

        {/* Status indicator */}
        {statusMessage && (
          <div className="mt-4 text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 px-4 py-2 rounded-lg animate-in fade-in">
            {statusMessage}
          </div>
        )}
      </div>

      {/* 1-Click Instant Sample Generators */}
      <div className="rounded-2xl border border-[#262632] bg-[#16161b] p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#ff781f]" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-white uppercase">
              Or Try Instant Test Samples (Zero Upload Needed)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-gray-400">100% Client-Side In-Memory Synthetic Data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleLoadDemoSamples('mixed')}
            disabled={isLoading}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1d1d25] border border-[#2e2e3d] hover:border-[#ff781f] text-left transition-all"
          >
            <Layers className="h-5 w-5 text-[#ff781f] shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">Multi-Format Bundle</div>
              <div className="text-[10px] text-gray-400">Text + Financial Scan</div>
            </div>
          </button>

          <button
            onClick={() => handleLoadDemoSamples('zpl')}
            disabled={isLoading}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1d1d25] border border-[#2e2e3d] hover:border-[#00e5ff] text-left transition-all"
          >
            <HardDrive className="h-5 w-5 text-[#00e5ff] shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">Zebra ZPL Thermal</div>
              <div className="text-[10px] text-gray-400">4x6" Shipping Barcode</div>
            </div>
          </button>

          <button
            onClick={() => handleLoadDemoSamples('cad')}
            disabled={isLoading}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1d1d25] border border-[#2e2e3d] hover:border-amber-400 text-left transition-all"
          >
            <Cpu className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">2D CAD Blueprint</div>
              <div className="text-[10px] text-gray-400">DXF Vectors & Entities</div>
            </div>
          </button>

          <button
            onClick={() => handleLoadDemoSamples('code')}
            disabled={isLoading}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1d1d25] border border-[#2e2e3d] hover:border-indigo-400 text-left transition-all"
          >
            <FileCode2 className="h-5 w-5 text-indigo-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">Code & Markdown</div>
              <div className="text-[10px] text-gray-400">Prism Syntax Highlighting</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
