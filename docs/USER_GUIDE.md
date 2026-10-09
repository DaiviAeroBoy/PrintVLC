# PrintVLC — Step-by-Step Comprehensive User Guide

Welcome to the official user manual for **PrintVLC** (*The Universal "VLC Media Player" of Printing*), created and maintained by **[DaiviAeroBoy](https://github.com/DaiviAeroBoy)**.

This guide provides end-to-end instructions for every pre-flight studio tool, imposition layout, prepress optimization, hardware endpoint, and AI enhancement feature available in PrintVLC.

---

## 📑 Table of Contents
1. [Quick Start: Launching PrintVLC (Zero Terminal Required)](#1-quick-start-launching-printvlc-zero-terminal-required)
2. [Document Ingestion & Filmstrip Queue Management](#2-document-ingestion--filmstrip-queue-management)
3. [Tab 1: Paper Sizes, Custom Roll Dimensions & Margins](#3-tab-1-paper-sizes-custom-roll-dimensions--margins)
4. [Tab 2: Scaling, Placement & Exact Millimeter Lock](#4-tab-2-scaling-placement--exact-millimeter-lock)
5. [Tab 3: Professional Imposition Engine](#5-tab-3-professional-imposition-engine)
   - [Saddle-Stitched Booklets & GSM Creep Compensation](#51-saddle-stitched-booklets--gsm-creep-compensation)
   - [Multi-Sheet Poster Tiling](#52-multi-sheet-poster-tiling)
   - [N-Up Grids with Scissor Guides](#53-n-up-grids-with-scissor-guides)
   - [ID Photo Multiplier](#54-id-photo-multiplier)
6. [Tab 4: Deskew & 4-Point Perspective Geometry](#6-tab-4-deskew--4-point-perspective-geometry)
7. [Tab 5: Document Cleanup & Restoration](#7-tab-5-document-cleanup--restoration)
8. [Tab 6: Annotation, Watermarks & True Redaction](#8-tab-6-annotation-watermarks--true-redaction)
9. [Tab 7: Ink Intelligence, Prepress Tools & Duplex Wizard](#9-tab-7-ink-intelligence-prepress-tools--duplex-wizard)
10. [Tab 8: Stationery Generator & Variable Data Merge](#10-tab-8-stationery-generator--variable-data-merge)
11. [Hardware Connectivity & Driver Resolver](#11-hardware-connectivity--driver-resolver)
12. [On-Device AI Assistant (WebGPU)](#12-on-device-ai-assistant-webgpu)
13. [Exporting Master PDFs & Instant Printing](#13-exporting-master-pdfs--instant-printing)
14. [Keyboard Shortcuts & Pro Tips](#14-keyboard-shortcuts--pro-tips)

---

## 1. Quick Start: Launching PrintVLC (Zero Terminal Required)

You do **not** need to install complex software or use a command-line terminal to run PrintVLC.

### Method A: Single-File Executable (`PrintVLC.html`)
The fastest way to use PrintVLC on any device:
1. Double-click [`PrintVLC.html`](../PrintVLC.html) in your browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari, Opera, or Brave).
2. The entire studio boots instantly.
3. Works 100% offline — you can copy this single file to a USB flash drive or air-gapped laptop.

### Method B: 1-Click Windows Launcher (`START_PRINTVLC.bat`)
Recommended when connecting physical USB or Bluetooth printers (browsers require a local secure origin for WebUSB/Web Bluetooth):
1. Double-click [`START_PRINTVLC.bat`](../START_PRINTVLC.bat) in the project folder.
2. The launcher verifies dependencies and boots the sandboxed local server on `http://localhost:3000`.
3. Your default browser opens automatically.

### Method C: Download as Portable ZIP from GitHub
1. Visit the repository: [https://github.com/DaiviAeroBoy/PrintVLC](https://github.com/DaiviAeroBoy/PrintVLC).
2. Click the green **`<> Code`** button and select **`Download ZIP`** (or use [`PrintVLC-Portable.zip`](../PrintVLC-Portable.zip)).
3. Extract the ZIP anywhere on your system and launch via Method A or Method B.

---

## 2. Document Ingestion & Filmstrip Queue Management

PrintVLC features a **Universal Document Hopper** capable of demuxing more than 30 file formats without external codecs or server uploads.

### How to Ingest Files:
1. In the **Universal Dropzone (Screen 3)**, drag and drop one or multiple files simultaneously.
2. You can mix and match formats in a single drop (e.g., 1 Word document + 3 JPG photos + 1 PDF contract + 1 CAD blueprint).
3. PrintVLC normalizes every page into high-DPI canvases and stitches them into a unified print queue.

### Managing the Left Filmstrip:
- **Select Page:** Click any thumbnail to load that page into the center WYSIWYG studio canvas.
- **Rotate Page (90°):** Click the rotation icon on the thumbnail to rotate 90° clockwise.
- **Duplicate Page:** Click the duplicate icon to clone the page.
- **Add Blank Page:** Click **`[ + Blank Page ]`** at the top of the filmstrip to insert an unprinted spacer page.
- **Reorder Pages:** Drag and drop thumbnails to reorder pages in the queue.
- **Delete Page:** Click the trash icon to remove a page from the queue.

---

## 3. Tab 1: Paper Sizes, Custom Roll Dimensions & Margins

Control paper dimensions, orientations, and physical non-printable printer boundaries.

### Selecting Paper Sizes:
- **Standard Presets:** Choose from A0 through A6, US Letter, US Legal, Tabloid, Photo 4×6", Photo 5×7", Photo 8×10", or Index Cards.
- **Custom Roll Dimensions:** Select **Custom** to enter exact millimetric widths and heights (ideal for wide-format plotters and thermal receipt rolls).
- **Orientation:** Toggle between **Portrait** and **Landscape**.

### Configuring Margins:
- **Independent 4-Way Margins:** Set Top, Bottom, Left, and Right margins in millimeters.
- **Padlock Link Toggle:** Click the lock icon to adjust all four margins synchronously or independently.
- **Margin Presets:**
  - *Zero / Borderless (0mm):* For photo printers capable of edge-to-edge full bleed.
  - *Standard Office (15mm):* Safe margins for standard desktop inkjet and laser printers.
  - *Minimal (6mm):* Maximizes printable area while respecting standard laser grip rollers.
  - *Book Binding Gutter (25mm):* Adds extra inner margin space for spiral or adhesive binding.

### Framed Borders:
- Check **Enable Border** to draw an exact physical frame around the printable perimeter.
- Select style: **Solid**, **Dashed**, or **Double Line**.
- Configure border thickness in millimeters and choose a border color.

---

## 4. Tab 2: Scaling, Placement & Exact Millimeter Lock

Fine-tune how your content sits on the physical paper.

### Scale Modes:
- **Fit to Printable Area:** Automatically scales content to fit within your specified margins without cropping or distortion.
- **Fill Entire Sheet:** Scales content to cover the entire page area (crops excess overflow for full-bleed printing).
- **Custom Percentage:** Set a manual scale factor between 1% and 500% with the slider.
- **Exact Millimeter Lock:** Specify the exact target width and height in millimeters. PrintVLC mathematically locks the content to those dimensions on paper.

### Placement & Snapping:
- **Offsets:** Adjust X and Y offsets in millimeters to nudge content.
- **Center Shortcuts:** Click **Center Page** to snap content directly to sheet center.
- **Magnetic Snapping:** Enable **5mm Grid Snap** and **Margin Boundary Snap** for precise alignment.

---

## 5. Tab 3: Professional Imposition Engine

PrintVLC includes an industrial-grade imposition engine running entirely in browser memory.

### 5.1 Saddle-Stitched Booklets & GSM Creep Compensation
Create folded booklets ready for center-stapling:
1. Open **Tab 3: Imposition**.
2. Select **Pro Booklet Maker**.
3. **Automatic 4-Page Padding:** If your document page count is not divisible by 4, PrintVLC automatically inserts blank padding pages so front and back folios align properly.
4. **Spine Gutter Margin:** Adjust extra clearance in millimeters along the center fold.
5. **Creep Compensation (Paper Shingling):**
   - Enter your paper stock weight in the **Paper Weight (GSM)** field (e.g., `80` for standard copy paper, `120` for heavy stock).
   - PrintVLC calculates physical paper thickness ($T \approx \text{GSM} / 800\text{ mm}$) and shifts inner folios inward so margins remain uniform after folding and trimming.
6. **Fold & Staple Tick Marks:** Enable spine registration crossbars and folding guides.

### 5.2 Multi-Sheet Poster Tiling
Print oversized wall murals or engineering schematics on standard office sheets:
1. Select **Poster / Tiling Slicer**.
2. Set the grid matrix: **Columns** and **Rows** (e.g., 3 cols × 3 rows = 9 sheets).
3. **Overlap Glue Tab (mm):** Set overlap width (default `10 mm`). Each tile receives a dashed overlap tab for applying paste or tape.
4. **Cut Crosshairs (`+`):** Prints corner alignment crosshairs for precise scissor or rotary trimmer cuts.
5. **Coordinate Stamps (`R1-C1`):** Prints unobtrusive coordinate tags on each sheet (e.g., Row 1 - Column 2) for foolproof wall assembly.

### 5.3 N-Up Grids with Scissor Guides
Fit multiple logical pages onto a single sheet:
1. Select **N-Up Grid**.
2. Choose page count per sheet: **1, 2, 4, 6, 8, 9, or 16**.
3. Set **Cell Gap (mm)** to control spacing between mini-pages.
4. Check **Show Scissor Cut-Lines** to print dashed divider lines.

### 5.4 ID Photo Multiplier
Print multiple passport or ID headshots on a standard 4×6" photo paper:
1. Select **ID Photo Multiplier**.
2. Choose template cut count: **6, 8, or 12 ID Cuts**.
3. PrintVLC duplicates and calibrates headshots to international passport dimension guidelines with cut crosshairs.

---

## 6. Tab 4: Deskew & 4-Point Perspective Geometry

Restore crooked scans and perspective-distorted phone camera captures.

### In-Browser Auto-Deskew:
1. Click **`[ Auto-Deskew Scan ]`**.
2. PrintVLC samples horizontal text line baselines and calculates the tilt angle using gradient edge detection.
3. The page is automatically rotated by the compensation angle.

### Manual Angle Dial:
- Use the slider or number input to adjust rotation from **-45.0° to +45.0°** with 0.1° accuracy.

### 4-Point Perspective Keystone Correction:
- For documents photographed from an angle (e.g., receipts on a desk), adjust the four corner pins (**Top-Left**, **Top-Right**, **Bottom-Right**, **Bottom-Left**) to flatten perspective distortion onto a rectangular plane.

### Scanner Bed Auto-Crop:
- Enable **Scanner Bed Auto-Crop** to automatically detect and discard dark scanner lid borders, glass shadows, and excess margins.

---

## 7. Tab 5: Document Cleanup & Restoration

Clean up degraded, aged, or poorly scanned documents before printing.

### Paper Background Whitener:
- Adjust the **Paper Background Whitener** slider (0–100).
- Suppresses yellowing, aging, and scanner gray noise, forcing backgrounds to pure `#FFFFFF`.

### Ghost Text Bleed-Through Suppressor:
- Adjust the **Ghost Text Bleed-Through Suppressor** slider (0–100).
- Identifies faint ink showing through from the back of thin double-sided paper and filters it out.

### Mechanical Inpainting:
- **Hole-Punch & Staple Inpainting:** Automatically reconstructs margin areas damaged by binder hole punches or staple tears.
- **Thumb Mark Eraser:** Inpaints holding finger shadows and dark page edges.
- **Spine Gutter Shadow Eraser:** Whitens the dark shadow gradient created near the binding seam of open books.

---

## 8. Tab 6: Annotation, Watermarks & True Redaction

Add security labels, dynamic metadata stamps, and permanent privacy redactions.

### True Redaction vs Superficial Visual Masks:
> ⚠️ **Critical Security Advantage:** Standard PDF editors often draw vector black rectangles over text while leaving the underlying text and characters intact in the file stream, making them easy to extract.
> 
> **PrintVLC True Redaction permanently zeroes out the underlying pixel memory.** Once exported or spooled, the redacted data is physically gone and mathematically irrecoverable.

#### How to Apply Redactions:
1. Under **Canvas Interactive Tools**, select **Censor Box**.
2. On the center canvas, click and drag over the sensitive text or image.
3. The black redaction box appears immediately.
4. Click **Clear All Redactions** if you need to start over.

### Watermark Engine:
- Enable watermarking and enter text (e.g., `CONFIDENTIAL`, `DRAFT`, `SAMPLE`).
- Configure orientation: **Diagonal (45°)** or **Horizontal**.
- Set **Opacity** (5% to 100%), **Font Size**, and **Color**.
- Choose layer position: **Behind Content** (subtle background) or **Over Content** (protective overlay).
- Optionally upload a custom company logo image to use as a graphic watermark.

### Header & Footer Macro Stamper:
- Configure 6 placement positions: Top-Left, Top-Center, Top-Right, Bottom-Left, Bottom-Center, Bottom-Right.
- Supports dynamic real-time macro tags:
  - `[PageNumber]` — Current sheet number.
  - `[TotalPages]` — Total sheet count.
  - `[Filename]` — Original source document name.
  - `[CurrentDate]` — Local formatted date stamp.
  - `[PrintTimestamp]` — Exact execution timestamp.
- Customize font size and font color.

---

## 9. Tab 7: Ink Intelligence, Prepress Tools & Duplex Wizard

Save toner, prevent printer contamination, and audit ink costs.

### Pure K-Channel Black Lock:
- Forces near-black (`#1A1A1A`) and dark RGB text to pure 100% Key Black (`#000000`).
- Prevents laser printers from mixing expensive Cyan, Magenta, and Yellow toner into monochrome text.

### Eco Toner Saver:
- Applies an edge-preserving micro-halftone screening algorithm.
- Cuts toner/ink consumption by ~20%–25% while keeping glyph boundaries razor sharp.

### Dark Mode Neutralizer:
- Inverts dark code editor themes and web screenshots to clean white paper backgrounds with high-contrast dark text, saving massive amounts of ink.

### Prepress CMYK Density & Cost Estimator:
- Provides live pixel-by-pixel coverage percentages for Cyan, Magenta, Yellow, and Key Black.
- Calculates Total Ink Coverage (TIC) and provides an estimated per-sheet cost based on standard consumable pricing.

### Orphan Page Squisher:
- When your document leaves just 2 or 3 trailing lines on a final sheet, click **Squish Orphan Page**.
- Intelligently trims margins by 2mm and scales content by 3% to pull trailing lines into the previous sheet, saving entire sheets of paper.

### Diagnostic Test Patterns:
- **CMYK Purge Bars:** Generates full-density color blocks to clear clogged inkjet nozzles.
- **Duplex Alignment Grid:** Prints fine registration crossbars to test physical printer sheet feeding accuracy.

### Manual Duplex Wizard:
For single-sided printers:
1. Click **`[ Launch Manual Duplex Wizard ]`**.
2. **Pass 1:** Click **Print Odd Pages Batch** (prints sheets 1, 3, 5, 7...).
3. **Flip Guidance:** View the interactive 3D paper rotation visualizer showing the exact flip axis (long edge vs short edge) for re-inserting sheets into your feed tray.
4. **Pass 2:** Click **Print Even Pages Batch** (streams sheets 2, 4, 6... in reverse order onto the back).

---

## 10. Tab 8: Stationery Generator & Variable Data Merge

Generate technical paper templates and personalized batch print runs.

### One-Click Stationery Templates:
Select from 8 mathematical paper templates generated directly onto your chosen paper size:
- **Graph Paper:** 5mm grid with subtle coordinate major lines.
- **Isometric 3D Grid:** 30° triangular grid for technical and architectural sketching.
- **Dot Grid Journal:** 5mm dot matrix for bullet journaling.
- **Millimeter Engineering Paper:** Precision dual-intensity millimeter grid.
- **College Ruled Paper:** Standard lined writing sheet with margin guide.
- **Music Staves:** Five-line musical notation staves.
- **Weekly Planner:** Structured Monday–Sunday layout with habit tracker.
- **Monthly Calendar:** Printable month planner with date blocks.

### Variable Data Batch Merge:
1. Upload a CSV or Excel (`.xlsx`) dataset.
2. Field headers automatically become variable tags (e.g., `{{Name}}`, `{{ID}}`, `{{Role}}`, `{{Barcode}}`).
3. Add text with these tags to your layout — PrintVLC dynamically interpolates data per sheet.
4. **Dynamic Code-128 Barcodes:** Select an ID/SKU field to generate calibrated Code-128 barcodes per record.
5. **Dynamic QR Codes:** Select a URL/token field to generate high-contrast QR codes per record.
6. Use the record navigator (`◀ 1 / 150 ▶`) to inspect individual records before printing.

---

## 11. Hardware Connectivity & Driver Resolver

Navigate to **Screen 2: Hardware Hub** to manage physical endpoints.

### Connection Modes:
1. **Direct WebUSB (`navigator.usb`):** Direct binary communication with Zebra ZPL thermal labelers, Epson TM POS printers, Dymo label heads, and standard USB printers.
2. **Local Network IPP (Port 631):** Direct Internet Printing Protocol endpoint (`http://<printer-ip>:631/ipp/print`) for modern network and Wi-Fi printers.
3. **Raw JetDirect / AppSocket (Port 9100):** Raw TCP socket streaming for enterprise laser printers and warehouse barcode units.
4. **Web Bluetooth SPP (`navigator.bluetooth`):** Wireless serial streaming to mobile belt-clip receipt and label printers.
5. **System Print Spooler (Universal Fallback):** Renders high-DPI canvases into PrintVLC's zero-bleed `@media print` engine, passing directly to the operating system's native print dialogue.

### Integrated Missing Driver Resolver:
- Auto-detects operating system (Windows 11/10, macOS, Linux).
- Dynamic query generator opening verified manufacturer links:
  `https://www.google.com/search?q={Brand}+{Model}+official+driver+download+{OS}`
- Direct portals: OpenPrinting Database, HP Support Hub, Canon Global, Epson Setup, Brother Solutions Center, Zebra Downloads.

---

## 12. On-Device AI Assistant (WebGPU)

Click the **AI Assist** button in the top navigation bar to open the on-device neural core.

### Tier 1: Semantic Text Engine (SmolLM2-135M Q4)
- **1-Page Executive Cheatsheet:** Extracts key takeaways and action items from long multi-page documents, generating a single-page structured brief ready to print.
- **Automated PII Redaction:** Scans document text for Social Security Numbers, Credit Cards, Emails, and Phone Numbers, highlighting candidate fields with 1-click True Redaction conversion.

### Tier 2: Vision & Scan Enhancer (Real-ESRGAN + Lighting Mesh)
- **Lighting Gradient Normalizer:** Removes uneven lighting, smartphone shadows, and flash glare from paper surfaces.
- **Unsharp Mask & 2x/4x Super-Resolution:** Sharpens blurred characters and upscales low-resolution scans without pixelation.

---

## 13. Exporting Master PDFs & Instant Printing

### Print Ready Master PDF (`pdf-lib`):
- Click **`[ Save As Master ]`** in the top navigation bar.
- Generates a flattened, high-DPI PDF document adhering to PDF/X prepress specifications.
- Preserves all applied margins, imposition signatures, True Redactions, and watermarks.

### Direct Printing (`streamToSystemSpooler`):
- Click **`[ Print Document ]`** in the top bar.
- PrintVLC mounts the processed high-DPI canvases into a zero-margin DOM stream and invokes the system spooler.
- Celebratory confetti triggers upon successful spool dispatch!

---

## 14. Keyboard Shortcuts & Pro Tips

| Action | Shortcut / Gesture | Benefit |
| :--- | :--- | :--- |
| **Fit to Screen** | Bottom Scrubber `[ Fit ]` | Instantly resets canvas viewport zoom to 100% |
| **Inspect Page** | Click Filmstrip Thumbnail | Loads page instantly with full settings preserved |
| **Rotate 90°** | Thumbnail `[ ↻ ]` icon | Quickly levels sideways scans in the queue |
| **True Redaction** | Drag on Canvas with Redact Tool | Permanently destroys underlying pixel memory |
| **Paper Link** | Padlock Icon in Tab 1 | Adjusts all 4 margins simultaneously |
| **Duplex Guidance** | Tab 7 `[ Launch Duplex Wizard ]` | Prevents upside-down double-sided printing mistakes |

---

*PrintVLC — Built with care by **[DaiviAeroBoy](https://github.com/DaiviAeroBoy)**. Open source under the MIT License.*
