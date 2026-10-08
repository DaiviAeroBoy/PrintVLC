# PrintVLC — Hardware Connection & Driver Setup Guide

PrintVLC is designed to print directly to hardware **without installing proprietary drivers or bloatware**. This guide covers configuring each connection type.

> 💡 **Quick Note for Single-File Users:**
> - If running the standalone [`PrintVLC.html`](../PrintVLC.html) directly via `file:///`, all canvas editing, imposition, paper formats, and the **System Print Spooler** work 100% offline.
> - For raw physical **WebUSB** and **Web Bluetooth** endpoints, modern browsers require a secure origin (`http://localhost:3000` or HTTPS). Use [`START_PRINTVLC.bat`](../START_PRINTVLC.bat) to launch the app on localhost with complete WebUSB/Bluetooth permissions.

---

## 1. Direct WebUSB Connection

WebUSB allows Chromium-based browsers (Google Chrome, Microsoft Edge, Opera, Brave) to communicate directly with physical USB ports.

### Supported Devices:
- Zebra ZPL and EPL thermal label printers (ZD410, ZD420, GX420d, etc.)
- EPSON TM-T88 and TM-series POS receipt printers
- Dymo LabelWriter series
- Standard USB desktop and laser printers

### How to Connect:
1. Plug your printer into your computer via USB.
2. In PrintVLC, navigate to **Hardware Connection Hub** (Screen 2).
3. Under the **Direct USB Port** card, click `[ Scan USB Devices ]`.
4. Your browser will present a security permission prompt listing detected USB devices.
5. Select your printer from the list and click **Connect**.
6. PrintVLC will claim the USB interface (`classCode: 7` Printer class) and stream binary output directly to the device.

---

## 2. Web Bluetooth SPP (Serial Port Profile)

Web Bluetooth enables wireless printing to portable belt-clip printers and mobile POS units.

### Supported Devices:
- Portable 58mm / 80mm Bluetooth receipt printers
- Mobile warehouse barcode label printers
- Bluetooth SPP hardware endpoints

### How to Connect:
1. Turn on your Bluetooth printer and ensure it is in pairing mode.
2. Click `[ Pair Bluetooth Printer ]` on Connection Card 3.
3. Select your printer from the browser's Bluetooth discovery dialog.
4. PrintVLC pairs with the GATT server and streams raw ESC/POS or text byte streams.

---

## 3. Local Network / Wi-Fi (Port 631 IPP & Port 9100 RAW)

For network-connected office and enterprise printers, PrintVLC supports two standard protocols:

### Protocol 1: IPP (Internet Printing Protocol — Port 631)
- **URL Endpoint**: `http://<printer-ip>:631/ipp/print`
- **Recommended for**: Modern network multi-function printers, HP ePrint, AirPrint-compatible devices.

### Protocol 2: AppSocket / Raw JetDirect (Port 9100)
- **Port**: `9100`
- **Recommended for**: Enterprise laser printers, network label printers, and barcode printers.

### Steps:
1. Enter your printer's local IPv4 address (e.g., `192.168.1.150`).
2. Toggle between **Port 631 (IPP)** and **Port 9100 (RAW)**.
3. Click `[ Connect Network Printer ]` to run an instant handshake test.

---

## 4. System Print Spooler (Universal Fallback)

If your device is already connected to your operating system via Wi-Fi or USB, PrintVLC can route the processed canvas directly to the OS print spooler.

### Benefits of PrintVLC's System Spooler Engine:
- **Zero-Margin Printing**: Leverages PrintVLC's `@media print` CSS engine with `@page { margin: 0; }` to eliminate unwanted browser margins.
- **High-DPI Quality**: High-resolution canvases (150–300 DPI) are streamed directly to the print stream.
- **Pre-Processed Enhancements**: All deskewing, paper whitening, and pure K-channel black locks are pre-applied to the print stream.

---

## 5. Missing Driver Resolver

If your printer requires official OEM drivers, PrintVLC provides an integrated resolver:

1. **Operating System Auto-Detection**: Automatically identifies if you are on Windows 11/10, macOS, or Linux.
2. **Manufacturer Search Generator**: Select your brand (HP, Canon, Epson, Brother, Zebra, Pantum, Ricoh, Samsung, Dymo) and enter your model number to launch a direct verified Google search query:
   ```
   https://www.google.com/search?q={Brand}+{Model}+official+driver+download+{OS}
   ```
3. **Official Repositories**:
   - [OpenPrinting Database](https://www.openprinting.org/printers) — Linux/UNIX CUPS drivers.
   - [HP Support Hub](https://support.hp.com/us-en/drivers/printers) — LaserJet, DeskJet, OfficeJet.
   - [Canon Global Support](https://global.canon/en/support/) — PIXMA, imageRUNNER.
   - [Epson Setup](https://epson.com/Support/sl/s) — EcoTank, WorkForce.
   - [Brother Solutions Center](https://support.brother.com/g/b/countrytop.aspx) — HL, MFC series.
   - [Zebra Downloads](https://www.zebra.com/us/en/support-downloads/printers.html) — ZPL, thermal label software.
