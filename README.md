<div align="center">

# 🖨️ PrintVLC
### *The Universal "VLC Media Player" of Printing*

**100% In-Browser • Zero Driver Installation • Zero Server Uploads • Air-Gapped Privacy**

[![Author: DaiviAeroBoy](https://img.shields.io/badge/Author-DaiviAeroBoy-orange.svg?logo=github)](https://github.com/DaiviAeroBoy)
[![Repository: DaiviAeroBoy/PrintVLC](https://img.shields.io/badge/GitHub-DaiviAeroBoy%2FPrintVLC-blue.svg?logo=github)](https://github.com/DaiviAeroBoy/PrintVLC)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Privacy: Zero Telemetry](https://img.shields.io/badge/Privacy-100%25%20In--Browser-00e5ff.svg)](#-privacy--air-gapped-security)
[![Hardware: WebUSB & Bluetooth](https://img.shields.io/badge/Hardware-WebUSB%20%7C%20Bluetooth%20%7C%20IPP-ff781f.svg)](#-hardware-connectivity--drivers)
[![AI Engine: WebGPU](https://img.shields.io/badge/AI%20Core-WebGPU%20%2F%20SmolLM2-10b981.svg)](#-on-device-ai-assistant-webgpu)
[![Framework: React 19 + Vite](https://img.shields.io/badge/Stack-React%2019%20%2B%20TypeScript-6366f1.svg)](https://react.dev)

<br/>

> **PrintVLC** does for printing what VLC Media Player did for video: it runs entirely within your browser sandbox, requires zero software or driver installation, sends zero files to any server, and allows you to open, format, imposition, edit, and print **any file format to any printer**.

<br/>

</div>

---

## 📑 Table of Contents
1. [Why PrintVLC?](#-why-printvlc)
2. [Documentation Hub](#-documentation-hub)
3. [Instant Run Options (Zero npm Required)](#-instant-run-options-zero-npm-required)
4. [Developer Quick Start](#-developer-quick-start)
5. [Engineering Architecture](#-engineering-architecture)
6. [Universal Document Ingestion (Demuxers)](#-universal-document-ingestion-demuxers)
7. [The Master Pre-Flight Studio (8 Tabs)](#-the-master-pre-flight-studio-8-tabs)
8. [Hardware Connectivity & Driver Resolver](#-hardware-connectivity--drivers)
9. [On-Device AI Assistant (WebGPU)](#-on-device-ai-assistant-webgpu)
10. [Privacy & Air-Gapped Security](#-privacy--air-gapped-security)
11. [License & Author](#-license--author)

---

## 📚 Documentation Hub

Explore our detailed, dedicated documentation in the [`docs/`](docs/) directory:

| Document | Focus Area | Direct Link |
| :--- | :--- | :--- |
| 📖 **Technical Architecture** | Demuxing pipeline, Saddle-stitch math, GSM creep compensation, WebGPU shaders, memory lifecycle | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| 🔌 **Hardware Connection & Drivers** | WebUSB setup, Web Bluetooth SPP pairing, IPP:631 & Raw:9100 socket, OEM driver resolver | [docs/HARDWARE_SETUP.md](docs/HARDWARE_SETUP.md) |
| 🧑‍💻 **Step-by-Step User Guide** | Pro booklets, poster slicing, True Redaction, CSV variable data merge, manual duplex wizard | [docs/USER_GUIDE.md](docs/USER_GUIDE.md) |

---

## 🌟 Why PrintVLC?

Every modern printer OS dialogue and commercial print workflow suffers from the same issues:
- **Proprietary Bloatware & Missing Drivers:** Needing multi-gigabyte manufacturer driver suites just to send text or barcodes.
- **Cloud Telemetry & Privacy Leaks:** Online "free PDF converters" and vendor clouds uploading sensitive contracts, patient records, and tax forms to third-party servers.
- **Flawed Scans & Distortions:** Uneven mobile camera lighting, tilted receipts, dark scanner bed borders, and hole-punch / staple holes ruining prints.
- **Imposition Complexity:** Trying to calculate saddle-stitch booklet signatures, N-up grids, or multi-sheet wall posters manually in Word or Acrobat.
- **Color Toner Contamination & Cost:** Black text accidentally printed with composite CMY color toner, multiplying printing costs 5×–10×.

**PrintVLC solves all of these problems inside client-side RAM.** Whether you have a $50 Bluetooth receipt printer, an industrial Zebra ZPL thermal label head, an office laser multi-function printer, or a high-end wide-format plotter, PrintVLC communicates directly via **WebUSB**, **Web Bluetooth**, **Local IPP (port 631)**, **Raw JetDirect (port 9100)**, or the zero-bleed **`@media print`** system spooler.

---

## 🚀 Instant Run Options (Zero npm Required)

You have **3 instant ways** to run PrintVLC depending on your preference:

### 📄 Option 1: 1-Click Single-File Executable (`PrintVLC.html`)
The entire application (codecs, UI, studio, prepress filters, icons) is bundled into a **single, standalone HTML file**:
1. Simply double-click [`PrintVLC.html`](PrintVLC.html) in your browser (Chrome, Edge, Firefox, Safari, Brave, Opera).
2. **Zero installation. Zero servers. Zero terminal commands.**
3. Works completely offline on Windows, macOS, Linux, and Android. You can carry it on a USB flash drive or air-gapped laptop!

---

### 🖱️ Option 2: 1-Click Windows Launcher (`START_PRINTVLC.bat`)
For full physical hardware support (WebUSB and Web Bluetooth require a local secure origin):
1. Double-click [`START_PRINTVLC.bat`](START_PRINTVLC.bat) in the project folder.
2. It automatically checks runtime dependencies, boots the local sandboxed server, and opens **`http://localhost:3000`** in your default browser.

---

### 📦 Option 3: Download Whole Project as a ZIP
If you are visiting this repository on GitHub:
1. Click the green **`<> Code`** button at the top right of the repository.
2. Select **`Download ZIP`** (or download the pre-packaged [`PrintVLC-Portable.zip`](PrintVLC-Portable.zip)).
3. Extract the ZIP anywhere on your computer.
4. Open [`PrintVLC.html`](PrintVLC.html) directly, or double-click [`START_PRINTVLC.bat`](START_PRINTVLC.bat).
5. Done! You have the complete air-gapped print studio ready to use.

---

## 👨‍💻 Developer Quick Start

If you are a developer looking to contribute, modify components, or extend demuxers:

### Prerequisites:
- **Node.js** (v18 or higher)
- **Git**

### Developer Commands:
```bash
# 1. Clone the repository
git clone https://github.com/DaiviAeroBoy/PrintVLC.git
cd PrintVLC

# 2. Install dependencies
npm install

# 3. Start local hot-reloading development server
npm run dev

# 4. Create standard production bundle (in dist/)
npm run build

# 5. Re-generate the 100% self-contained single-file HTML (PrintVLC.html)
npm run build:single

# 6. Run fast linter
npm run lint
```

### Extending the Codebase:
- **Adding new document demuxers**: Add parser logic in [`src/utils/documentHopper.ts`](src/utils/documentHopper.ts).
- **Adding hardware printer protocols**: Extend [`src/utils/hardwareConnector.ts`](src/utils/hardwareConnector.ts).
- **Customizing Prepress & Canvas Filters**: Modify [`src/utils/imageFilters.ts`](src/utils/imageFilters.ts) and [`src/utils/inkIntelligence.ts`](src/utils/inkIntelligence.ts).
- **Stationery & Patterns**: Add math templates in [`src/utils/stationeryGenerator.ts`](src/utils/stationeryGenerator.ts).

---

## 🛠️ Engineering Architecture

PrintVLC is engineered from the ground up to guarantee **zero network egress** while matching the raw performance of native desktop desktop publishing (DTP) software.

> 📖 **Deep Dive:** For full mathematical formulas (saddle-stitch signatures, GSM creep shingling), memory isolation lifecycle, and demuxing mechanics, read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

```
PrintVLC Architecture Pipeline
│
├── 1. Ingestion Layer ─────► Client-side Workers & WASM Demuxers
│                            (PDF.js, docx-preview, SheetJS, UTIF.js, ag-psd, dxf-parser)
│
├── 2. Studio Core Engine ──► High-DPI 2D Canvas & WebGL Matrix Pipeline
│                            (Physical Rulers, Bleed Guides, Non-printable Bounds)
│
├── 3. Transformation ─────► Imposition, Geometry & Prepress Filters
│                            (Booklet Creep GSM, Pure K-Lock, Hole-Punch Inpainting)
│
├── 4. On-Device AI ────────► WebGPU Shader Pipeline
│                            (SmolLM2-135M, PII Detector, Real-ESRGAN Super-Res)
│
└── 5. Hardware Dispatch ───► Direct I/O Endpoints
                             (WebUSB API, Web Bluetooth SPP, IPP:631, Raw:9100, PDF-Lib)
```

### Core Technologies:
- **Framework**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4, Lucide React Icons, Charcoal `#121214` Industrial Dark Theme
- **Document & Vector Engines**:
  - `pdfjs-dist`: High-resolution client-side PDF rasterization.
  - `pdf-lib`: PDF/X-1a flattened master output generation.
  - `docx-preview`: Client-side Microsoft Word rendering in detached virtual DOM.
  - `xlsx` (SheetJS): Spreadsheet workbook and CSV table parsing.
  - `utif`: Multi-page medical and archival TIFF decode.
  - `ag-psd`: Layered Adobe Photoshop PSD parser.
  - `dxf-parser`: 2D CAD engineering blueprint vector rendering.
  - `prismjs`: Syntax-highlighted paginated code printouts.
- **Hardware Protocols**: WebUSB API (`navigator.usb`), Web Bluetooth API (`navigator.bluetooth`), Local HTTP/Socket endpoints.
- **Storage**: Browser `IndexedDB` (via `idb`) + `CacheStorage` (Zero remote DBs).

---

## 📂 Universal Document Ingestion (Demuxers)

The **Universal Document Hopper** automatically normalizes and stitches multi-format file drops into a unified paginated print queue:

| Category | Supported Formats | Engine / Decoder | Output Mode |
| :--- | :--- | :--- | :--- |
| **Office & Documents** | PDF, DOCX, XLSX, XLS, CSV, ODS, TXT, RTF | `pdfjs-dist`, `docx-preview`, `xlsx` | Multi-page High-DPI Canvas |
| **Raster & Photos** | PNG, JPG, JPEG, WEBP, GIF, BMP, AVIF | Native Canvas API / ImageBitmap | Scaled Raster Canvas |
| **Specialized & Scans**| TIFF, TIF, PSD, HEIC | `utif`, `ag-psd`, `libheif-js` fallback | Multi-page / Layered Canvas |
| **CAD & Vector** | 2D DXF, SVG | `dxf-parser`, Native SVG DOM Engine | Crisp Blueprint Vectors |
| **Hardware Code** | Zebra ZPL (`^XA...^XZ`), ESC/POS Receipts | In-browser canvas emulator | Calibrated Label / Receipt Canvas |
| **Code & Markdown** | `.md`, `.js`, `.ts`, `.py`, `.html`, `.css`, etc. | Prism syntax highlighting & auto-pagination | Formatted Monospace Code Sheets |

*Drop 1 DOCX + 4 JPGs + 1 PDF together — PrintVLC stitches them seamlessly into one continuous print queue.*

---

## 🎨 The Master Pre-Flight Studio (8 Tabs)

> 🧑‍💻 **User Manual:** For step-by-step instructions on making saddle-stitch booklets, slicing wall posters, applying True Redaction, and variable data merging, read [docs/USER_GUIDE.md](docs/USER_GUIDE.md).

### Center Workspace:
- Real-time physical **millimeter and inch rulers** overlay with live cursor tracking.
- Red dashed non-printable hardware margin boundary lines.
- Live interactive mouse-drag tool for **permanent black-box redaction**.
- High-speed bottom thumbnail scrubber to slide across multi-hundred-page queues.
- Left filmstrip with drag-and-drop page reordering, per-page 90° rotation, duplicate, add blank page, and delete.

### 8 Studio Configuration Tabs:

#### TAB 1: Paper & Margins
- Standard formats: A0 through A6, US Letter, Legal, Tabloid, Photo 4×6", 5×7", 8×10", Index Cards.
- Custom roll dimensions in exact millimeters.
- Portrait / Landscape orientation toggle.
- 4-way independent margin inputs with link/unlink padlock toggle.
- Margin presets: Zero/Borderless, Standard Office (15mm), Minimal (6mm), Book Binding Gutter (25mm).
- Framed border generator (solid, dashed, double frames with custom thickness and color picker).

#### TAB 2: Scaling & Placement
- Fit to Printable Area (margin-aware).
- Fill Entire Sheet (full-bleed crop).
- Custom Percentage Scale Slider (1% to 500%).
- Exact Physical Millimeter Lock (type exact target width and height in mm).
- Center Horizontally & Vertically shortcuts.
- Magnetic 5mm grid snap and margin boundary snap aids.

#### TAB 3: Imposition & Multi-Page Layouts
- **N-Up Grid**: 1, 2, 4, 6, 8, 9, 16 pages per sheet with configurable cell gaps (mm) and optional scissor cut-lines.
- **Pro Booklet Maker**: Saddle-stitch signature calculation, auto-pads blank pages to multiples of 4, spine gutter margin, GSM-based Creep Compensation (shingling), and fold/staple tick marks.
- **Poster / Tiling Slicer**: Splits a single image across a 2×2 up to 10×10 sheet grid with overlap glue tabs (in mm), cut crosshairs (`+`), and coordinate stamps (`R1-C1`).
- **ID Photo Multiplier**: Clones 1 headshot into 6, 8, or 12 calibrated ID cuts on a 4×6" photo paper template.

#### TAB 4: Deskew & Geometry Restoration
- **In-Browser Auto-Deskew**: Gradient baseline edge sampler levels slanted scans automatically.
- **Manual Angle Dial**: Slider from -45° to +45° with 0.1° precision.
- **4-Point Perspective Warp**: Keystone correction pins flatten angled mobile camera shots.
- **Scanner Bed Auto-Crop**: Trims dark lid borders, shadow edges, and excess glass.

#### TAB 5: Document Cleanup & Restoration
- **Paper Background Whitener**: Forces aged, yellowed, browned, or grayed scanner noise to pure `#FFFFFF`.
- **Ghost Text Bleed-Through Suppressor**: Eliminates faint reverse-side ink bleed-through on thin paper.
- **Hole-Punch & Staple Inpainting**: Erases dark mechanical binding marks on margins.
- **Thumb & Spine Gutter Eraser**: Erases holding fingers and dark book spine shadows.

#### TAB 6: Annotation, Watermarks & Redaction
- **Watermark Engine**: Diagonal or horizontal text, 5%–100% opacity, Behind/Over layering, or custom company logo stamps.
- **Header & Footer Macro Stamper**: 6-position placement tags (`[PageNumber]`, `[TotalPages]`, `[Filename]`, `[CurrentDate]`, `[PrintTimestamp]`).
- **True Redaction Tool**: Destructively zeroes out underlying pixel memory — unrecoverable even if the file is extracted.
- **Freehand Markup**: Highlighters, lines, rectangles, arrows, and sticky notes.

#### TAB 7: Ink Intelligence & Prepress Tools
- **Pure K-Channel Black Lock**: Forces off-black (`#1A1A1A`) and dark RGB text to pure 100% K black, preventing color toner contamination on laser printers.
- **Eco Toner Saver**: Reduces halftone density by ~20%–25% while preserving sharp glyph edges.
- **Dark Mode Neutralizer**: Inverts dark websites or code backgrounds to crisp white and light text to dark.
- **CMYK Soft Proofing**: Simulates ink absorption on matte, glossy, and uncoated paper stocks.
- **Real-Time CMYK Coverage & Cost**: Calculates CMYK pixel percentage and live cost per sheet.
- **Orphan Page Squisher**: Scales margins down by 2%–4% and scale by 3% to pull trailing 2-line overflow pages into the previous sheet.
- **Diagnostic Targets**: Generates CMYK printhead purge bars and duplex registration grids.
- **Manual Duplex Wizard**: Interactive 3D paper flip guide for odd/even batch passes on single-sided printers.

#### TAB 8: Stationery Generator & Variable Data Merge
- **One-Click Stationery**: Graph paper (5mm), Isometric 3D grid, Dot grid journal, Millimeter engineering paper, College ruled paper, Music staves (5-line), Weekly planner, Monthly calendar.
- **Variable Data Batch Merge**: Parses CSV/Excel files, interpolates `{{Name}}` tags, and renders dynamic Code-128 and QR codes per page.

---

## 🔌 Hardware Connectivity & Drivers

> 🔌 **Hardware Setup Guide:** For step-by-step connection manuals, browser WebUSB permissions, Bluetooth pairing, and network port forwarding, read [docs/HARDWARE_SETUP.md](docs/HARDWARE_SETUP.md).

PrintVLC communicates directly with physical printing hardware without requiring OS driver installations:

```
PrintVLC Hardware Hub
│
├── 1. Direct WebUSB ────────► navigator.usb.requestDevice()
│                              (Zebra ZPL, Dymo, EPSON POS, USB printers)
│
├── 2. Local IPP / Wi-Fi ────► Port 631 (IPP) & Port 9100 (Raw JetDirect)
│                              (Network office printers, wireless multifunctionals)
│
├── 3. Web Bluetooth ────────► navigator.bluetooth.requestDevice()
│                              (Mobile SPP receipt & label belt-clip printers)
│
└── 4. System Spooler ───────► Zero-bleed @media print CSS engine
                               (Universal fallback to native OS print dialogue)
```

### Built-in Missing Driver Resolver:
- Auto-detects client operating system (Windows 11/10, macOS, Linux).
- Dynamic query generator opening verified manufacturer links:
  `https://www.google.com/search?q={Brand}+{Model}+official+driver+download+{OS}`
- Direct portals: OpenPrinting Database, HP Support Hub, Canon Global, Epson Setup, Brother Solutions Center, Zebra Downloads.

---

## 🧠 On-Device AI Assistant (WebGPU)

PrintVLC integrates an on-device neural core powered by WebGPU shaders:

- **Tier 1 (Semantic Text Engine)**: SmolLM2-135M (Q4 Quantized)
  - **1-Page Executive Cheatsheet**: Condenses multi-page documents into a structured single-page briefing.
  - **Automated PII Redaction**: Scans and blacklists Social Security Numbers, Credit Cards, Emails, and Phone Numbers, converting them to True Redaction boxes with one click.
- **Tier 2 (Vision & Scan Enhancer)**: Compact Real-ESRGAN + Scan Lighting Normalizer
  - Levels uneven mobile camera lighting gradients.
  - Sharpens text strokes and upscales low-resolution scans 2x/4x without pixelation.
- **Local Weight Caching**: Models are optionally cached in browser `CacheStorage` for offline use and can be purged instantly.

---

## 🔒 Privacy & Air-Gapped Security

PrintVLC is engineered for healthcare, legal, financial, and government environments requiring strict data residency compliance:

1. **Zero Server Uploads**: The application bundle is static. No document bytes ever touch a network interface.
2. **Zero Cloud Telemetry**: No Google Analytics, no tracking scripts, no third-party cookies.
3. **Selectable Storage Modes**:
   - **Local Workspace Mode**: Retains presets in local `IndexedDB`.
   - **Ephemeral RAM-Only Mode**: Guarantees zero disk writes. Explicitly revokes all Object URLs and terminates all workers on tab unload.

---

## 📜 License & Author

PrintVLC is created and maintained with pride by **[DaiviAeroBoy](https://github.com/DaiviAeroBoy)**.  
Released as free and open-source software under the **[MIT License](LICENSE)**.
