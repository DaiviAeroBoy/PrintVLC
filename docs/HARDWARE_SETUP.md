# PrintVLC — Hardware Connection & Driver Setup Guide

Created and maintained by **[DaiviAeroBoy](https://github.com/DaiviAeroBoy)**.  
Repository: **[DaiviAeroBoy/PrintVLC](https://github.com/DaiviAeroBoy/PrintVLC)**.

PrintVLC is engineered to communicate directly with physical printing hardware **without requiring bulky manufacturer software or proprietary drivers**. This guide provides complete instructions for configuring every connection channel.

---

## 📑 Table of Contents
1. [Prerequisites & Secure Origin Requirements](#1-prerequisites--secure-origin-requirements)
2. [Direct WebUSB Connection](#2-direct-webusb-connection)
3. [Web Bluetooth Serial Port Profile (SPP)](#3-web-bluetooth-serial-port-profile-spp)
4. [Local Network Endpoints (Port 631 IPP & Port 9100 RAW)](#4-local-network-endpoints-port-631-ipp--port-9100-raw)
5. [System Print Spooler (Universal Fallback)](#5-system-print-spooler-universal-fallback)
6. [Integrated Missing Driver Resolver](#6-integrated-missing-driver-resolver)
7. [Thermal Label & Receipt Hardware Calibration Tips](#7-thermal-label--receipt-hardware-calibration-tips)
8. [Hardware Troubleshooting Matrix](#8-hardware-troubleshooting-matrix)

---

## 1. Prerequisites & Secure Origin Requirements

Modern browsers implement strict security boundaries for raw hardware APIs:

| Feature | Single-File `file:///` Mode (`PrintVLC.html`) | Localhost Mode (`START_PRINTVLC.bat`) | HTTPS Web Origin |
| :--- | :---: | :---: | :---: |
| **All Studio Tabs & Imposition** | ✅ 100% Offline | ✅ 100% Offline | ✅ Full Support |
| **System Print Spooler (`window.print`)** | ✅ Fully Functional | ✅ Fully Functional | ✅ Full Support |
| **PDF/X Master Export** | ✅ Fully Functional | ✅ Fully Functional | ✅ Full Support |
| **WebUSB Direct Hardware** | ⚠️ Restricted by Browser Security | ✅ **Enabled** (`http://localhost:3000`) | ✅ **Enabled** |
| **Web Bluetooth Direct Hardware** | ⚠️ Restricted by Browser Security | ✅ **Enabled** (`http://localhost:3000`) | ✅ **Enabled** |

> 💡 **Recommendation:** For direct WebUSB or Bluetooth streaming, run PrintVLC via [`START_PRINTVLC.bat`](../START_PRINTVLC.bat), which serves the application on `http://localhost:3000` (classified as a Secure Context by Chromium).

---

## 2. Direct WebUSB Connection

The WebUSB API (`navigator.usb`) allows Chromium-based browsers (Google Chrome, Microsoft Edge, Opera, Brave) to communicate directly with USB hardware endpoints without passing through the operating system's spooler.

### Supported Hardware:
- **Zebra Thermal Label Printers:** ZD410, ZD420, GX420d, GK420t, ZT230, etc.
- **EPSON POS Receipt Printers:** TM-T88 series, TM-T20, TM-m30.
- **Dymo LabelWriter Series:** 450, 4XL, 550.
- **Standard Desktop USB Printers:** Utilizing USB Device Class `0x07` (Printer Class).

### Vendor ID Registry in PrintVLC:
```typescript
filters: [
  { classCode: 7 },     // Standard USB Printer Class
  { vendorId: 0x04b8 }, // Epson
  { vendorId: 0x03f0 }, // HP
  { vendorId: 0x04a9 }, // Canon
  { vendorId: 0x04f9 }, // Brother
  { vendorId: 0x0a5f }, // Zebra
  { vendorId: 0x0922 }, // Dymo
]
```

### Step-by-Step Connection:
1. Connect your printer to your workstation via USB cable and power it on.
2. Open PrintVLC and click **Hardware Hub** (Screen 2) in the navigation bar.
3. In the **Direct USB Port** card, click **`[ Scan USB Devices ]`**.
4. The browser displays a hardware authorization prompt listing detected USB devices.
5. Select your printer and click **Connect**.
6. PrintVLC claims interface `0`, initializes the endpoint, and streams raw commands (ZPL, ESC/POS, or binary raster buffers) directly.

### Windows Note (WinUSB Binding):
On Windows, if the operating system binds a proprietary vendor driver to the USB device, the browser may report `Access Denied`. If this happens:
- You can either use PrintVLC's **System Spooler mode** (which prints through the Windows driver with all PrintVLC prepress optimizations applied), or
- Use the open-source utility **Zadig** to associate the device interface with the generic `WinUSB` driver.

---

## 3. Web Bluetooth Serial Port Profile (SPP)

Web Bluetooth enables cable-free printing to portable receipt and label printers commonly used in mobile retail, field logistics, and warehouse environments.

### Supported Devices:
- 58mm & 80mm mobile Bluetooth thermal receipt printers (ESC/POS compatible).
- Portable warehouse barcode printers.
- Bluetooth SPP hardware endpoints.

### Supported Service UUIDs:
- `000018f0-0000-1000-8000-00805f9b34fb` (Standard Printer Service)
- `e7810a71-73ae-499d-8c15-faa9aef0c3f2` (Common Serial Port Profile)

### Step-by-Step Connection:
1. Turn on the Bluetooth printer and confirm Bluetooth pairing mode is active.
2. Ensure your computer or mobile device has Bluetooth turned on.
3. In PrintVLC Screen 2, locate the **Web Bluetooth** card and click **`[ Pair Bluetooth Printer ]`**.
4. Choose your printer from the browser's pairing dialog and click **Pair**.
5. PrintVLC connects to the GATT server and opens the primary data characteristic for raw streaming.

---

## 4. Local Network Endpoints (Port 631 IPP & Port 9100 RAW)

For networked office multifunction printers and enterprise network label units, PrintVLC supports two standard local protocols:

### Protocol 1: IPP (Internet Printing Protocol — Port 631)
- **Endpoint URL:** `http://<printer-ip>:631/ipp/print`
- **Recommended For:** Modern office printers, AirPrint-compatible devices, and HP/Canon/Epson network copiers.
- **Payload:** High-DPI master PDF stream or binary IPP raster.

### Protocol 2: Raw JetDirect / AppSocket (Port 9100)
- **Port:** `9100`
- **Recommended For:** Enterprise laser printers, industrial Zebra network heads, and high-speed line printers.
- **Payload:** Raw PostScript, PCL, or ZPL byte stream.

### Step-by-Step Connection:
1. Identify your printer's local IPv4 address (e.g., `192.168.1.150`) via the printer display panel or router table.
2. In PrintVLC Screen 2, select the **Local Network / Wi-Fi** card.
3. Enter the IP address and choose your target port (**Port 631 IPP** or **Port 9100 RAW**).
4. Click **`[ Connect Network Printer ]`** to perform an instant pre-flight ping.

---

## 5. System Print Spooler (Universal Fallback)

If your device is already paired to your operating system, PrintVLC's **System Spooler Engine** provides the ideal universal path.

### Why PrintVLC's Spooler Beats Native Browser Printing:
1. **Zero-Margin Layout:** Standard browser printing often injects unwanted headers, footers, and margins. PrintVLC injects calibrated CSS:
   ```css
   @page {
     margin: 0;
     size: auto;
   }
   ```
2. **High-DPI Canvas Rendering:** Raw high-resolution canvases (150–300 DPI) are mounted directly to the print container, avoiding low-res screen rasterization.
3. **Pre-Processed Ingestion:** All deskewing, paper background whitening, Pure K-channel black locks, and True Redactions are pre-rendered into the pixel stream before hitting the OS print queue.

---

## 6. Integrated Missing Driver Resolver

If an unusual legacy printer requires official OEM manufacturer software, PrintVLC includes a built-in resolver:

1. **OS Auto-Detection:** Detects whether your workstation runs Windows 11/10, macOS, or Linux.
2. **Dynamic Search Query:** Select your manufacturer and enter your model to generate an official driver query:
   ```
   https://www.google.com/search?q={Brand}+{Model}+official+driver+download+{OS}
   ```
3. **Direct Verified Manufacturer Portals:**
   - [OpenPrinting Database](https://www.openprinting.org/printers) — Linux/UNIX CUPS database.
   - [HP Support Hub](https://support.hp.com/us-en/drivers/printers) — LaserJet, DeskJet, OfficeJet.
   - [Canon Global Support](https://global.canon/en/support/) — PIXMA, imageRUNNER, imageCLASS.
   - [Epson Setup](https://epson.com/Support/sl/s) — EcoTank, WorkForce, Expression.
   - [Brother Solutions Center](https://support.brother.com/g/b/countrytop.aspx) — HL, MFC series.
   - [Zebra Downloads](https://www.zebra.com/us/en/support-downloads/printers.html) — ZPL drivers and setup utilities.

---

## 7. Thermal Label & Receipt Hardware Calibration Tips

### Resolution Standards:
- Standard desktop thermal printers operate at **203 DPI** (8 dots/mm) or **300 DPI** (12 dots/mm).
- For barcode clarity, ensure Code-128 barcode modules align with integer dot pitches (avoid fractional dot scaling to prevent barcode scanner read errors).

### Tear-Off Margin Compensation:
- Most thermal label heads have a physical distance of 2mm to 4mm between the thermal burn line and the tear bar.
- Use PrintVLC's **Top Margin** setting in Tab 1 to calibrate content so labels don't clip at the tear line.

---

## 8. Hardware Troubleshooting Matrix

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **WebUSB device list empty** | Device not in Printer Class or driver claimed by OS | Run via `START_PRINTVLC.bat` on `localhost:3000`. If on Windows, check Zadig WinUSB or use System Spooler mode. |
| **Bluetooth pairing fails** | Printer not in discoverable mode | Power cycle printer and hold the pairing button until the LED blinks rapidly. |
| **Network IP unreachable** | Printer on different subnet or blocked by firewall | Verify workstation and printer share the same subnet mask (e.g. `192.168.1.x`). Ensure port 631/9100 is unblocked. |
| **Unwanted browser headers on paper** | Native browser print dialog settings | In the native print dialog, expand *More settings* and uncheck *Headers and footers*. |

---

*Authored by **[DaiviAeroBoy](https://github.com/DaiviAeroBoy)**. Open source under the MIT License.*
