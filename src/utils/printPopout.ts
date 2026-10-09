export interface PopOutPrintOptions {
  canvases: HTMLCanvasElement[];
  documentName: string;
  paperWidthMm: number;
  paperHeightMm: number;
  isLandscape?: boolean;
  autoPrint?: boolean;
}

export interface PopOutPrintResult {
  success: boolean;
  blocked: boolean;
  windowRef: Window | null;
  error?: string;
}

/**
 * Escapes HTML characters for safe template interpolation
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Opens a dedicated popup window containing ONLY the formatted document pages,
 * with pure CSS paged media rules (@page) and triggers native window.print().
 */
export function popOutAndPrintDocument(options: PopOutPrintOptions): PopOutPrintResult {
  const {
    canvases,
    documentName,
    paperWidthMm,
    paperHeightMm,
    isLandscape = false,
    autoPrint = true
  } = options;

  if (!canvases || canvases.length === 0) {
    return {
      success: false,
      blocked: false,
      windowRef: null,
      error: 'No document pages to print.'
    };
  }

  // Calculate dimensions
  const widthMm = isLandscape ? Math.max(paperWidthMm, paperHeightMm) : Math.min(paperWidthMm, paperHeightMm);
  const heightMm = isLandscape ? Math.min(paperWidthMm, paperHeightMm) : Math.max(paperWidthMm, paperHeightMm);

  // Pre-generate data URLs before opening window so the window loads instantaneously
  const pageDataUrls = canvases.map(c => c.toDataURL('image/png', 1.0));

  // Open the pop-out window
  const windowFeatures = 'width=1050,height=960,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes';
  const printWindow = window.open('', '_blank', windowFeatures);

  if (!printWindow) {
    return {
      success: false,
      blocked: true,
      windowRef: null,
      error: 'Browser blocked pop-out window. Please allow popups for PrintVLC.'
    };
  }

  const safeTitle = escapeHtml(documentName || 'PrintVLC_Document');
  const pageCount = canvases.length;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle} — Spool Preview (PrintVLC)</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #111217;
      color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      -webkit-font-smoothing: antialiased;
    }

    /* Screen UI Header Bar */
    .screen-header {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 1000;
      background: #181920;
      border-bottom: 1px solid #282a36;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-badge {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #ff781f, #ff9800);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-weight: 900;
      font-size: 16px;
      box-shadow: 0 2px 8px rgba(255, 120, 31, 0.3);
    }

    .doc-info {
      display: flex;
      flex-direction: column;
    }

    .doc-name {
      font-weight: 700;
      font-size: 14px;
      color: #ffffff;
      max-width: 380px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .doc-meta {
      font-size: 11px;
      color: #9ca3af;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 2px;
      font-family: "JetBrains Mono", monospace, sans-serif;
    }

    .pill {
      background: #232530;
      color: #ff781f;
      border: 1px solid #363949;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 600;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-print {
      background: #ff781f;
      color: #000000;
      border: none;
      padding: 9px 20px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.15s ease;
      box-shadow: 0 2px 10px rgba(255, 120, 31, 0.3);
    }

    .btn-print:hover {
      background: #ff8e3d;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(255, 120, 31, 0.4);
    }

    .btn-close {
      background: #262833;
      color: #e5e7eb;
      border: 1px solid #3c3f52;
      padding: 9px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s;
    }

    .btn-close:hover {
      background: #333645;
    }

    /* Screen Document Sheets Container */
    .document-stream {
      padding: 40px 20px 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 36px;
      width: 100%;
    }

    .page-sheet-container {
      background: #ffffff;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      max-width: 96vw;
    }

    .page-number-tag {
      position: absolute;
      top: -24px;
      left: 0;
      font-size: 11px;
      font-family: monospace;
      color: #9ca3af;
      background: #181920;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #282a36;
    }

    .sheet-img {
      display: block;
      width: 100%;
      height: auto;
      max-width: 850px;
    }

    .print-status-banner {
      margin-top: 10px;
      background: rgba(0, 229, 255, 0.1);
      border: 1px solid rgba(0, 229, 255, 0.3);
      color: #00e5ff;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 11px;
      font-family: monospace;
    }

    /* Paged Media CSS Rules for System Spooler / Printer */
    @page {
      size: ${widthMm}mm ${heightMm}mm;
      margin: 0;
    }

    @media print {
      html, body {
        background: #ffffff !important;
        color: #000000 !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }

      .no-print,
      .screen-header,
      .page-number-tag,
      .print-status-banner {
        display: none !important;
      }

      .document-stream {
        padding: 0 !important;
        margin: 0 !important;
        gap: 0 !important;
        display: block !important;
        width: 100% !important;
      }

      .page-sheet-container {
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
        background: transparent !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        page-break-after: always;
        break-after: page;
        page-break-inside: avoid;
        break-inside: avoid;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .sheet-img {
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        object-fit: contain !important;
        display: block !important;
      }
    }
  </style>
</head>
<body>
  <!-- Non-Printable Screen Control Bar -->
  <header class="screen-header no-print">
    <div class="brand-section">
      <div class="brand-badge">▲</div>
      <div class="doc-info">
        <span class="doc-name">${safeTitle}</span>
        <div class="doc-meta">
          <span>PrintVLC Spool Preview</span>
          <span class="pill">${pageCount} Page${pageCount > 1 ? 's' : ''}</span>
          <span class="pill">${widthMm} × ${heightMm} mm</span>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn-print" id="btnPrintNow">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        Print Now
      </button>
      <button class="btn-close" id="btnCloseWindow">
        Close Window
      </button>
    </div>
  </header>

  <!-- Status hint for user -->
  <div class="print-status-banner no-print">
    ✨ Ready to print. The browser print dialog is opening. If it does not appear, click "Print Now".
  </div>

  <!-- Document Sheets Area -->
  <main class="document-stream">
    ${pageDataUrls.map((url, idx) => `
      <div class="page-sheet-container">
        <span class="page-number-tag no-print">Page ${idx + 1} of ${pageCount}</span>
        <img class="sheet-img" src="${url}" alt="Page ${idx + 1}" />
      </div>
    `).join('')}
  </main>

  <script>
    document.getElementById('btnPrintNow').addEventListener('click', function() {
      window.focus();
      window.print();
    });

    document.getElementById('btnCloseWindow').addEventListener('click', function() {
      window.close();
    });

    // Auto-trigger print spooler once DOM and images are completely decoded
    if (${autoPrint ? 'true' : 'false'}) {
      window.addEventListener('load', function() {
        setTimeout(function() {
          window.focus();
          window.print();
        }, 400);
      });
    }
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  return {
    success: true,
    blocked: false,
    windowRef: printWindow
  };
}
