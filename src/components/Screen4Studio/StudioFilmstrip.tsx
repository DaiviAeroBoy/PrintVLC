import React from 'react';
import { PageItem } from '../../types/document';
import { RotateCw, Trash2, Plus, Copy, FileCode, MoveUp, MoveDown } from 'lucide-react';

interface StudioFilmstripProps {
  pages: PageItem[];
  activePageIndex: number;
  onSelectPage: (idx: number) => void;
  onDeletePage: (idx: number) => void;
  onRotatePage: (idx: number) => void;
  onDuplicatePage: (idx: number) => void;
  onAddBlankPage: () => void;
  onMovePage: (fromIdx: number, toIdx: number) => void;
}

export const StudioFilmstrip: React.FC<StudioFilmstripProps> = ({
  pages,
  activePageIndex,
  onSelectPage,
  onDeletePage,
  onRotatePage,
  onDuplicatePage,
  onAddBlankPage,
  onMovePage,
}) => {
  return (
    <div className="w-56 bg-[#16161b] border-r border-[#262632] flex flex-col h-full select-none">
      {/* Top Header */}
      <div className="p-3 border-b border-[#262632] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">Pages</span>
          <span className="rounded-full bg-[#23232c] px-2 py-0.5 text-[10px] font-mono text-[#00e5ff] font-semibold border border-[#333344]">
            {pages.length}
          </span>
        </div>

        <button
          onClick={onAddBlankPage}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#252531] hover:bg-[#303040] text-[10px] font-mono text-gray-200 border border-[#3b3b4d] transition-colors"
          title="Insert Blank Page"
        >
          <Plus className="h-3 w-3 text-[#ff781f]" />
          <span>Add Blank</span>
        </button>
      </div>

      {/* Scrollable Thumbnails List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {pages.map((page, idx) => {
          const isActive = idx === activePageIndex;

          return (
            <div
              key={page.id}
              onClick={() => onSelectPage(idx)}
              className={`group relative rounded-xl border p-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-[#ff781f] bg-[#ff781f]/10 shadow-lg shadow-[#ff781f]/5 ring-1 ring-[#ff781f]'
                  : 'border-[#262632] bg-[#1a1a20] hover:border-[#383848] hover:bg-[#202028]'
              }`}
            >
              {/* Thumbnail Header Bar */}
              <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono">
                <span className={`font-bold ${isActive ? 'text-[#ff781f]' : 'text-gray-400'}`}>
                  #{idx + 1}
                </span>

                <span className="px-1.5 py-0.2 rounded bg-black/50 text-[9px] text-gray-400 border border-[#2b2b36]">
                  {page.sourceFileType}
                </span>
              </div>

              {/* Thumbnail Preview Aspect Container */}
              <div className="relative aspect-[3/4] w-full bg-white rounded overflow-hidden flex items-center justify-center border border-black/20 shadow-inner">
                {page.canvasPreviewUrl ? (
                  <img
                    src={page.canvasPreviewUrl}
                    alt={`Page ${idx + 1}`}
                    className="w-full h-full object-contain"
                    style={{
                      transform: `rotate(${page.rotation}deg)`,
                      transition: 'transform 0.15s ease'
                    }}
                  />
                ) : (
                  <div className="text-[10px] font-mono text-gray-500">Blank Page</div>
                )}
              </div>

              {/* Per-Page Quick Action Toolbar */}
              <div className="mt-2 pt-1 border-t border-[#262632] flex items-center justify-between text-gray-400">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (idx > 0) onMovePage(idx, idx - 1);
                    }}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-[#2e2e3d] hover:text-white disabled:opacity-30"
                    title="Move Page Up"
                  >
                    <MoveUp className="h-3 w-3" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (idx < pages.length - 1) onMovePage(idx, idx + 1);
                    }}
                    disabled={idx === pages.length - 1}
                    className="p-1 rounded hover:bg-[#2e2e3d] hover:text-white disabled:opacity-30"
                    title="Move Page Down"
                  >
                    <MoveDown className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRotatePage(idx);
                    }}
                    className="p-1 rounded hover:bg-[#2e2e3d] hover:text-[#00e5ff]"
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="h-3 w-3" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicatePage(idx);
                    }}
                    className="p-1 rounded hover:bg-[#2e2e3d] hover:text-amber-400"
                    title="Duplicate Page"
                  >
                    <Copy className="h-3 w-3" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(idx);
                    }}
                    disabled={pages.length <= 1}
                    className="p-1 rounded hover:bg-[#2e2e3d] hover:text-red-400 disabled:opacity-20"
                    title="Delete Page"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
