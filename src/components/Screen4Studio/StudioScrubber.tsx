import React from 'react';
import { PageItem } from '../../types/document';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface StudioScrubberProps {
  pages: PageItem[];
  activePageIndex: number;
  onSelectPage: (idx: number) => void;
  zoomLevel: number;
  onChangeZoom: (val: number) => void;
  onFitToScreen: () => void;
  isPreviewMode: boolean;
  onTogglePreviewMode: () => void;
}

export const StudioScrubber: React.FC<StudioScrubberProps> = ({
  pages,
  activePageIndex,
  onSelectPage,
  zoomLevel,
  onChangeZoom,
  onFitToScreen,
  isPreviewMode,
  onTogglePreviewMode,
}) => {
  return (
    <div className="h-16 bg-[#16161b] border-t border-[#262632] px-4 flex items-center justify-between gap-4 font-mono select-none">
      
      {/* Left: Page Navigation Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectPage(Math.max(0, activePageIndex - 1))}
          disabled={activePageIndex === 0}
          className="p-1.5 rounded-lg bg-[#22222b] hover:bg-[#2c2c38] text-gray-300 disabled:opacity-30 border border-[#313140]"
          title="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="text-xs text-white">
          <span className="font-bold text-[#ff781f]">{activePageIndex + 1}</span>
          <span className="text-gray-500"> / {pages.length}</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectPage(Math.min(pages.length - 1, activePageIndex + 1))}
          disabled={activePageIndex === pages.length - 1}
          className="p-1.5 rounded-lg bg-[#22222b] hover:bg-[#2c2c38] text-gray-300 disabled:opacity-30 border border-[#313140]"
          title="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Center: High-Speed Thumbnail Scrubber */}
      <div className="flex-1 max-w-xl flex items-center gap-3">
        <span className="text-[10px] text-gray-500">SCRUB:</span>
        <input
          type="range"
          min={0}
          max={Math.max(0, pages.length - 1)}
          value={activePageIndex}
          onChange={(e) => onSelectPage(Number(e.target.value))}
          className="w-full accent-[#ff781f] h-1.5 bg-[#252531] rounded-lg cursor-pointer"
        />
      </div>

      {/* Right: Zoom Level & Preview Toggles */}
      <div className="flex items-center gap-3 text-xs text-gray-300">
        <div className="flex items-center gap-1.5 bg-[#1f1f28] px-2 py-1 rounded-lg border border-[#2d2d3c]">
          <button
            type="button"
            onClick={() => onChangeZoom(Math.max(30, zoomLevel - 15))}
            className="hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          <span className="text-[11px] w-12 text-center text-[#00e5ff] font-bold">
            {zoomLevel}%
          </span>

          <button
            type="button"
            onClick={() => onChangeZoom(Math.min(300, zoomLevel + 15))}
            className="hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onFitToScreen}
          className="p-1.5 rounded-lg bg-[#22222b] hover:bg-[#2c2c38] text-gray-300 border border-[#313140]"
          title="Fit to Screen"
        >
          <Maximize className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onTogglePreviewMode}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] transition-colors ${
            isPreviewMode
              ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
              : 'border-[#313140] bg-[#22222b] text-gray-300 hover:text-white'
          }`}
          title="Toggle Print Clean View"
        >
          {isPreviewMode ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span>{isPreviewMode ? 'Clean Proof' : 'Studio Mode'}</span>
        </button>
      </div>

    </div>
  );
};
