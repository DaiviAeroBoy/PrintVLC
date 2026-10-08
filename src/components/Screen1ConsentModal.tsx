import React, { useState } from 'react';
import { ShieldCheck, HardDrive, Cpu, Terminal, ArrowRight, Code2, Lock, CheckCircle2 } from 'lucide-react';
import { StorageMode } from '../utils/storage';

interface Screen1ConsentModalProps {
  isOpen: boolean;
  onConfirm: (mode: StorageMode) => void;
}

export const Screen1ConsentModal: React.FC<Screen1ConsentModalProps> = ({ isOpen, onConfirm }) => {
  const [selectedMode, setSelectedMode] = useState<StorageMode>('workspace');
  const [showSourceInfo, setShowSourceInfo] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#2a2a34] bg-[#16161a] p-6 shadow-2xl text-[#f3f4f6]">
        
        {/* Header Badge & Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff781f]/15 border border-[#ff781f]/40 text-[#ff781f]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#22222a] px-2 py-0.5 text-[11px] font-mono tracking-wider text-[#00e5ff] border border-[#00e5ff]/30">
                AIR-GAPPED PROTOCOL
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <Lock className="h-3 w-3" /> CLIENT SANDBOX
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-1">
              Privacy & Storage Architecture Consent
            </h2>
          </div>
        </div>

        {/* Core Guarantee Banner */}
        <div className="my-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200 leading-relaxed font-mono">
          <span className="font-bold text-amber-400">GUARANTEE:</span> 100% In-Browser. No analytics, no tracking, zero server uploads. Files never leave your local RAM.
        </div>

        {/* Storage Modes Selector */}
        <p className="text-xs text-[#9ca3af] mb-3">
          Select your local browser persistence policy. You can toggle this at any time:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {/* Mode 1: Local Workspace Mode */}
          <div
            onClick={() => setSelectedMode('workspace')}
            className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 ${
              selectedMode === 'workspace'
                ? 'border-[#ff781f] bg-[#ff781f]/10 shadow-lg shadow-[#ff781f]/5 ring-1 ring-[#ff781f]'
                : 'border-[#262630] bg-[#1b1b22] hover:border-[#383848]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className={`h-5 w-5 ${selectedMode === 'workspace' ? 'text-[#ff781f]' : 'text-gray-400'}`} />
                <span className="font-semibold text-sm text-white">Local Workspace Mode</span>
              </div>
              {selectedMode === 'workspace' && <CheckCircle2 className="h-4 w-4 text-[#ff781f]" />}
            </div>
            <span className="inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 mb-2">
              Recommended
            </span>
            <p className="text-xs text-[#9ca3af] leading-normal">
              Retains your paper size presets, custom margins, driver links, and downloaded WebGPU AI models in browser <code className="text-[#00e5ff] font-mono text-[11px]">IndexedDB</code> and <code className="text-[#00e5ff] font-mono text-[11px]">CacheStorage</code>. Never leaves your device.
            </p>
          </div>

          {/* Mode 2: Ephemeral RAM-Only Mode */}
          <div
            onClick={() => setSelectedMode('ephemeral')}
            className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 ${
              selectedMode === 'ephemeral'
                ? 'border-[#00e5ff] bg-[#00e5ff]/10 shadow-lg shadow-[#00e5ff]/5 ring-1 ring-[#00e5ff]'
                : 'border-[#262630] bg-[#1b1b22] hover:border-[#383848]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className={`h-5 w-5 ${selectedMode === 'ephemeral' ? 'text-[#00e5ff]' : 'text-gray-400'}`} />
                <span className="font-semibold text-sm text-white">Ephemeral RAM-Only</span>
              </div>
              {selectedMode === 'ephemeral' && <CheckCircle2 className="h-4 w-4 text-[#00e5ff]" />}
            </div>
            <span className="inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 mb-2">
              Zero Disk Footprint
            </span>
            <p className="text-xs text-[#9ca3af] leading-normal">
              Absolute zero disk persistence. Explicitly zeroes out all canvas memory buffers, worker threads, and Object URLs from memory immediately when the tab closes.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#262630]">
          <button
            type="button"
            onClick={() => setShowSourceInfo(!showSourceInfo)}
            className="flex items-center gap-2 text-xs font-mono text-[#9ca3af] hover:text-white transition-colors"
          >
            <Code2 className="h-4 w-4" />
            <span>[ View Source & Architecture ]</span>
          </button>

          <button
            type="button"
            onClick={() => onConfirm(selectedMode)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff781f] to-[#ff9800] text-black font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-[#ff781f]/20"
          >
            <span>Accept & Launch Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Source info collapsible */}
        {showSourceInfo && (
          <div className="mt-4 p-3 rounded-lg bg-[#0f0f12] border border-[#2b2b35] text-[11px] font-mono text-[#9ca3af] space-y-1">
            <div className="text-white font-semibold flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-[#ff781f]" /> PrintVLC Open Source Guarantee
            </div>
            <p>• Completely auditable client-side bundle.</p>
            <p>• Zero network requests sent during document rendering, imposition, or editing.</p>
            <p>• Direct hardware drivers communicated via WebUSB / Web Bluetooth / localhost IPP.</p>
          </div>
        )}
      </div>
    </div>
  );
};
