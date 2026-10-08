export type AIModelTier = 'tier1_text' | 'tier2_vision';

export interface WebGPUStatus {
  isSupported: boolean;
  adapterName?: string;
  backend: 'webgpu' | 'wasm' | 'cpu';
}

export interface AIProcessingState {
  isModalOpen: boolean;
  activeTier: AIModelTier;
  isLoadingModel: boolean;
  loadProgressPct: number;
  isProcessing: boolean;
  processStatusMessage: string;
  cacheLocally: boolean;
  outputSummary?: string;
  redactedPIICount?: number;
  enhancedImageUrl?: string;
}

export interface DetectedPIIItem {
  type: 'ssn' | 'credit_card' | 'email' | 'phone';
  value: string;
  pageIndex: number;
  box: { xPct: number; yPct: number; widthPct: number; heightPct: number };
}
