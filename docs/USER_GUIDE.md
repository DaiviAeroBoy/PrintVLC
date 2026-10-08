# PrintVLC — Step-by-Step User Guide

This user guide walks you through the advanced publishing, imposition, and print production workflows available in PrintVLC.

---

## 1. Quick Start: Download as ZIP & Run Instantly (Zero npm Required)

You do **not** need to install software, install Node/npm, or use a terminal.

### Step 1: Download the Project
- On GitHub ([https://github.com/daiviaerooy/PrintVLC](https://github.com/daiviaerooy/PrintVLC)), click the green **`<> Code`** button and click **`Download ZIP`**.
- Alternatively, download [`PrintVLC-Portable.zip`](../PrintVLC-Portable.zip) directly.

### Step 2: Extract & Launch
- Extract the ZIP file anywhere on your computer (e.g., Desktop or Documents).
- **Run Method A (Single-File Offline)**: Double-click [`PrintVLC.html`](../PrintVLC.html). It immediately opens the entire studio in any browser without needing an internet connection.
- **Run Method B (1-Click Windows Launcher)**: Double-click [`START_PRINTVLC.bat`](../START_PRINTVLC.bat). It boots a local sandboxed server providing direct WebUSB and Web Bluetooth hardware support.

---

## 2. How to Create a Saddle-Stitched Booklet

PrintVLC's **Pro Booklet Maker** automatically organizes pages into saddle-stitch signatures so you can fold and staple them into a booklet.

```
Original Document: [1, 2, 3, 4, 5, 6, 7, 8]
Booklet Sheet 1 Front:  [Page 8]  |  [Page 1]
Booklet Sheet 1 Back:   [Page 2]  |  [Page 7]
Booklet Sheet 2 Front:  [Page 6]  |  [Page 3]
Booklet Sheet 2 Back:   [Page 4]  |  [Page 5]
```

### Steps:
1. In the Studio (Screen 4), open **TAB 3: Imposition & Multi-Page Layouts**.
2. Click **Pro Booklet Maker**.
3. **Auto-Padding**: If your document is not a multiple of 4 (e.g., a 6-page document), PrintVLC automatically adds blank padding sheets to maintain correct signature alignment.
4. **Spine Gutter**: Adjust the **Spine Gutter Margin (mm)** to leave extra breathing room where the booklet will be stapled.
5. **Creep Compensation (Shingling)**:
   - Enter your paper weight in the **Paper Weight (GSM)** input (e.g., `80` for standard copy paper, `120` for premium stock).
   - PrintVLC automatically shifts inner pages inward so that when the booklet is folded and trimmed, all margins remain consistent.
6. Enable **Draw Fold & Staple Tick Marks** to display center spine alignment guides.
7. Click **Print** or **Save As Master**.

---

## 2. How to Slice a Multi-Sheet Poster (Tiling)

Need to print a large wall poster using standard A4 or US Letter paper? Use the **Poster / Tiling Slicer**.

### Steps:
1. Load your high-resolution image into the Dropzone.
2. Open **TAB 3: Imposition**.
3. Select **Poster / Tiling Slicer**.
4. Set the **Columns** and **Rows** grid (e.g., 3 columns × 3 rows = 9 sheets).
5. **Overlap Glue Tab (mm)**: Set the overlap tab (default `10 mm`). Each tile will receive a dashed border strip for applying glue.
6. Enable **Cut Crosshairs (+)** to print crop guides at the corners.
7. Enable **Coordinate Stamps (R1-C1)** so each sheet is labeled with its grid position (e.g., Row 1 - Column 1) for assembly.
8. Click **Print**. Trim the dashed overlap tabs and glue the tiles together.

---

## 3. How to Irreversibly Redact Sensitive Information

Standard PDF editors often draw superficial black boxes over text that can still be highlighted, copied, or extracted from the underlying file. PrintVLC uses **True Redaction**: underlying pixel data is permanently overwritten in memory with pure black pixels (`#000000`).

### Steps:
1. Open **TAB 6: Annotation, Watermarks & Redaction**.
2. Under **Canvas Interactive Tools**, click **Censor Box**.
3. On the center canvas, click and drag a rectangle over the text, account number, or image you want to redact.
4. The box appears immediately on the preview.
5. When you click **Save As Master** or **Print**, the underlying pixels are permanently destroyed in the exported canvas buffer.

---

## 4. How to Run Variable Data Merge (Badges, Certificates, Letters)

Personalize hundreds of pages with dynamic names, serial numbers, barcodes, and QR codes using a single CSV or Excel file.

### Steps:
1. Open **TAB 8: Stationery Generator & Variable Data Merge**.
2. Click `[ Upload CSV / Excel Dataset ]` and select your spreadsheet.
3. Your column headers appear as available tags (e.g., `{{Name}}`, `{{ID}}`, `{{Role}}`).
4. Type or format text containing these tags on your document. PrintVLC interpolates the values per record.
5. **Dynamic Barcodes**:
   - In the **Code-128 Tag** dropdown, select an ID or SKU column. PrintVLC will draw a dynamic Code-128 barcode per record.
6. **Dynamic QR Codes**:
   - In the **QR Code Tag** dropdown, select a URL or verification code column. PrintVLC will render a high-contrast QR code per page.
7. Use the record navigator (`◀ 1 / 150 ▶`) to preview any record live.

---

## 5. How to Use the Manual Duplex Wizard

If your printer only supports single-sided printing, the **Manual Duplex Wizard** prevents frustrating paper-jam mistakes:

### Steps:
1. Open **TAB 7: Ink Intelligence & Prepress Tools**.
2. Click `[ Launch Manual Duplex Wizard ]`.
3. **Step 1**: Click `[ Print Odd Pages Batch ]`. PrintVLC sends only pages 1, 3, 5, 7... to your printer.
4. **Step 2**: The wizard displays an interactive 3D paper rotation visualizer. Select whether your printer flips on the long edge or short edge, then follow the on-screen animation to flip the printed stack and re-insert it into the paper tray.
5. **Step 3**: Click `[ Print Even Pages ]`. PrintVLC streams pages 2, 4, 6... in reverse order directly onto the back of the stack.

---

## 6. How to Use the On-Device AI Assistant (WebGPU)

PrintVLC includes an on-device AI model running entirely on your local GPU:

### 1-Page Executive Cheatsheet:
1. In the top navigation bar, click the **AI Assist** button.
2. Select **Tier 1: Semantic Text Engine**.
3. Click `[ Generate Cheatsheet ]`. SmolLM2-135M summarizes the entire document into an executive overview ready for print.

### Automated PII Redaction:
1. Under Tier 1, click `[ Scan Document for PII ]`.
2. The model scans the text for Social Security Numbers, Credit Cards, Emails, and Phone Numbers.
3. Review the candidate list and click `[ Apply All Redactions ]`. Redaction boxes are automatically placed over all sensitive fields.

### Scan Enhancement (2x Super-Resolution):
1. In the AI Assistant modal, switch to **Tier 2: Vision & Scan Enhancer**.
2. Click `[ Enhance Scan & Lighting ]`.
3. The convolutional model flattens uneven mobile shadows and upscales the resolution with edge sharpening.
4. Click `[ Apply to Active Page ]`.
