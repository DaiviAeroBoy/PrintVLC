import React, { useState } from 'react';
import { 
  Usb, 
  Wifi, 
  Bluetooth, 
  Printer, 
  Search, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Laptop, 
  Sliders, 
  Layers 
} from 'lucide-react';
import { PRINTER_BRANDS, OFFICIAL_DRIVER_PORTALS, detectClientOS, generateDriverSearchUrl } from '../constants/hardwareDrivers';
import { scanUsbPrinters, pairBluetoothPrinter, testNetworkPrinter } from '../utils/hardwareConnector';
import { NetworkPrinterConfig, USBDeviceInfo, BluetoothDeviceInfo } from '../types/hardware';

interface Screen2HardwareHubProps {
  activeConnectionType: string;
  onSelectConnectionType: (type: 'usb' | 'network' | 'bluetooth' | 'spooler') => void;
  onProceedToStudio: () => void;
}

export const Screen2HardwareHub: React.FC<Screen2HardwareHubProps> = ({
  activeConnectionType,
  onSelectConnectionType,
  onProceedToStudio
}) => {
  // Connection states
  const [usbDevice, setUsbDevice] = useState<USBDeviceInfo | null>(null);
  const [usbStatusMsg, setUsbStatusMsg] = useState<string>('');
  const [isScanningUsb, setIsScanningUsb] = useState(false);

  const [btDevice, setBtDevice] = useState<BluetoothDeviceInfo | null>(null);
  const [btStatusMsg, setBtStatusMsg] = useState<string>('');
  const [isPairingBt, setIsPairingBt] = useState(false);

  const [networkConfig, setNetworkConfig] = useState<NetworkPrinterConfig>({
    ipAddress: '192.168.1.150',
    port: 631,
    protocol: 'ipp',
    status: 'disconnected'
  });
  const [isTestingNetwork, setIsTestingNetwork] = useState(false);

  // Driver resolver states
  const clientOS = detectClientOS();
  const [selectedBrand, setSelectedBrand] = useState(PRINTER_BRANDS[0]);
  const [modelNumber, setModelNumber] = useState('');

  // Handle USB
  const handleScanUsb = async () => {
    setIsScanningUsb(true);
    setUsbStatusMsg('Scanning USB bus...');
    try {
      const dev = await scanUsbPrinters();
      if (dev) {
        setUsbDevice(dev);
        setUsbStatusMsg(`Connected: ${dev.productName}`);
        onSelectConnectionType('usb');
      } else {
        setUsbStatusMsg('Device selection cancelled.');
      }
    } catch (err: any) {
      setUsbStatusMsg(err.message || 'WebUSB error');
    } finally {
      setIsScanningUsb(false);
    }
  };

  // Handle Bluetooth
  const handlePairBt = async () => {
    setIsPairingBt(true);
    setBtStatusMsg('Listening for Bluetooth beacons...');
    try {
      const dev = await pairBluetoothPrinter();
      if (dev) {
        setBtDevice(dev);
        setBtStatusMsg(`Paired: ${dev.name}`);
        onSelectConnectionType('bluetooth');
      } else {
        setBtStatusMsg('Bluetooth pairing cancelled.');
      }
    } catch (err: any) {
      setBtStatusMsg(err.message || 'Bluetooth connection error');
    } finally {
      setIsPairingBt(false);
    }
  };

  // Handle Network
  const handleTestNetwork = async () => {
    setIsTestingNetwork(true);
    setNetworkConfig(prev => ({ ...prev, status: 'testing' }));
    try {
      const res = await testNetworkPrinter(networkConfig);
      setNetworkConfig(prev => ({
        ...prev,
        status: res.reachable ? 'connected' : 'error',
        lastStatusMessage: res.message
      }));
      if (res.reachable) {
        onSelectConnectionType('network');
      }
    } finally {
      setIsTestingNetwork(false);
    }
  };

  // Handle Search Official Drivers
  const handleSearchDrivers = () => {
    const url = generateDriverSearchUrl(selectedBrand, modelNumber || 'printer', clientOS);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#2a2a34] bg-gradient-to-r from-[#17171d] via-[#1a1a22] to-[#17171d] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-md bg-[#ff781f]/10 border border-[#ff781f]/30 px-2 py-0.5 text-[11px] font-mono font-semibold text-[#ff781f]">
                HARDWARE DISCOVERY HUB
              </span>
              <span className="text-xs text-[#9ca3af] font-mono">Direct I/O Sandboxed Protocol</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Connect Any Printer Without Installing Drivers
            </h1>
            <p className="text-xs text-[#9ca3af] mt-1">
              PrintVLC speaks directly to USB thermal/label heads, Bluetooth SPP endpoints, local network raw sockets, or routes through the OS spooler.
            </p>
          </div>

          <button
            onClick={onProceedToStudio}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#0ea5e9] text-black font-semibold text-xs font-mono uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#00e5ff]/15"
          >
            <Layers className="h-4 w-4" />
            <span>Open Studio Canvas</span>
          </button>
        </div>
      </div>

      {/* 4 Connection Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: USB (Direct WebUSB) */}
        <div 
          onClick={() => onSelectConnectionType('usb')}
          className={`cursor-pointer rounded-xl border p-5 transition-all flex flex-col justify-between ${
            activeConnectionType === 'usb'
              ? 'border-[#ff781f] bg-[#ff781f]/10 ring-1 ring-[#ff781f]'
              : 'border-[#262630] bg-[#1a1a1e] hover:border-[#383848]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-[#24242d] text-[#ff781f]">
                <Usb className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#252530] text-[#9ca3af]">
                WebUSB API
              </span>
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Direct USB Port</h3>
            <p className="text-xs text-[#9ca3af] mb-4">
              Direct binary pipeline for Zebra ZPL label makers, Dymo, EPSON POS, and standard USB printers.
            </p>
            {usbStatusMsg && (
              <div className="mb-3 text-[11px] font-mono text-amber-300 p-2 rounded bg-black/40 border border-[#2b2b36]">
                {usbStatusMsg}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleScanUsb();
            }}
            disabled={isScanningUsb}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#272733] hover:bg-[#323242] text-xs font-mono text-white border border-[#39394d] transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isScanningUsb ? 'animate-spin text-[#ff781f]' : ''}`} />
            <span>{isScanningUsb ? 'Scanning...' : '[ Scan USB Devices ]'}</span>
          </button>
        </div>

        {/* CARD 2: Wi-Fi / Local Network */}
        <div 
          onClick={() => onSelectConnectionType('network')}
          className={`cursor-pointer rounded-xl border p-5 transition-all flex flex-col justify-between ${
            activeConnectionType === 'network'
              ? 'border-[#00e5ff] bg-[#00e5ff]/10 ring-1 ring-[#00e5ff]'
              : 'border-[#262630] bg-[#1a1a1e] hover:border-[#383848]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-[#24242d] text-[#00e5ff]">
                <Wifi className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#252530] text-[#9ca3af]">
                IPP / 9100
              </span>
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Wi-Fi & LAN IP</h3>
            <p className="text-xs text-[#9ca3af] mb-3">
              Stream raw PCL, PostScript, or PDF over port 631 (IPP) or port 9100 (Raw JetDirect).
            </p>

            <div className="space-y-2 mb-3">
              <input
                type="text"
                placeholder="192.168.1.150"
                value={networkConfig.ipAddress}
                onChange={(e) => setNetworkConfig({ ...networkConfig, ipAddress: e.target.value })}
                className="w-full bg-[#121215] border border-[#2d2d3a] rounded px-2.5 py-1.5 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#00e5ff]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNetworkConfig({ ...networkConfig, port: 631, protocol: 'ipp' })}
                  className={`flex-1 py-1 text-[10px] font-mono rounded border ${
                    networkConfig.port === 631 ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]' : 'border-[#2d2d3a] text-gray-400'
                  }`}
                >
                  Port 631 (IPP)
                </button>
                <button
                  type="button"
                  onClick={() => setNetworkConfig({ ...networkConfig, port: 9100, protocol: 'raw' })}
                  className={`flex-1 py-1 text-[10px] font-mono rounded border ${
                    networkConfig.port === 9100 ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]' : 'border-[#2d2d3a] text-gray-400'
                  }`}
                >
                  Port 9100 (RAW)
                </button>
              </div>
            </div>

            {networkConfig.lastStatusMessage && (
              <div className="mb-3 text-[10px] font-mono text-cyan-300 p-2 rounded bg-black/40 border border-[#2b2b36]">
                {networkConfig.lastStatusMessage}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleTestNetwork();
            }}
            disabled={isTestingNetwork}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#272733] hover:bg-[#323242] text-xs font-mono text-white border border-[#39394d] transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isTestingNetwork ? 'animate-spin text-[#00e5ff]' : ''}`} />
            <span>{isTestingNetwork ? 'Connecting...' : '[ Connect Network Printer ]'}</span>
          </button>
        </div>

        {/* CARD 3: Bluetooth */}
        <div 
          onClick={() => onSelectConnectionType('bluetooth')}
          className={`cursor-pointer rounded-xl border p-5 transition-all flex flex-col justify-between ${
            activeConnectionType === 'bluetooth'
              ? 'border-indigo-400 bg-indigo-500/10 ring-1 ring-indigo-400'
              : 'border-[#262630] bg-[#1a1a1e] hover:border-[#383848]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-[#24242d] text-indigo-400">
                <Bluetooth className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#252530] text-[#9ca3af]">
                Web Bluetooth
              </span>
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Bluetooth SPP</h3>
            <p className="text-xs text-[#9ca3af] mb-4">
              Wirelessly pair portable belt clip receipt printers, mobile barcode printers, and Bluetooth SPP hardware.
            </p>
            {btStatusMsg && (
              <div className="mb-3 text-[11px] font-mono text-indigo-300 p-2 rounded bg-black/40 border border-[#2b2b36]">
                {btStatusMsg}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePairBt();
            }}
            disabled={isPairingBt}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#272733] hover:bg-[#323242] text-xs font-mono text-white border border-[#39394d] transition-colors"
          >
            <Bluetooth className="h-3.5 w-3.5 text-indigo-400" />
            <span>{isPairingBt ? 'Pairing...' : '[ Pair Bluetooth Printer ]'}</span>
          </button>
        </div>

        {/* CARD 4: System Spooler (Default) */}
        <div 
          onClick={() => onSelectConnectionType('spooler')}
          className={`cursor-pointer rounded-xl border p-5 transition-all flex flex-col justify-between ${
            activeConnectionType === 'spooler'
              ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
              : 'border-[#262630] bg-[#1a1a1e] hover:border-[#383848]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-[#24242d] text-emerald-400">
                <Printer className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                Default / Universal
              </span>
            </div>
            <h3 className="font-bold text-sm text-white mb-1">System Spooler</h3>
            <p className="text-xs text-[#9ca3af] mb-4">
              Renders high-DPI canvases directly to your OS printing dialog via PrintVLC's zero-bleed <code className="text-emerald-400 font-mono">@media print</code> engine.
            </p>
            <div className="p-2 rounded bg-black/40 border border-[#2b2b36] text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 mb-3">
              <CheckCircle className="h-3.5 w-3.5" /> 100% Zero Driver Requirement
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectConnectionType('spooler');
              onProceedToStudio();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-semibold text-black transition-colors"
          >
            <span>[ Use OS Print Dialogue ]</span>
          </button>
        </div>

      </div>

      {/* HELPER CARD: "Don't Have Drivers? Install Here" */}
      <div className="rounded-2xl border border-[#2a2a34] bg-[#16161b] p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Don't Have Drivers? Install Here</h3>
              <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#252530] text-[#00e5ff] border border-[#2f2f3d]">
                <Laptop className="h-3 w-3" /> Auto-Detected: {clientOS}
              </span>
            </div>
            <p className="text-xs text-[#9ca3af]">
              Instantly locate manufacturer software without visiting spammy driver mirrors.
            </p>
          </div>
        </div>

        {/* Brand & Model Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="w-full sm:w-48">
            <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Manufacturer Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-[#1e1e26] border border-[#313140] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff781f]"
            >
              {PRINTER_BRANDS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Model Number / Series</label>
            <input
              type="text"
              placeholder="e.g. LaserJet Pro M404, EcoTank ET-2800, ZD420..."
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value)}
              className="w-full bg-[#1e1e26] border border-[#313140] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#ff781f]"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearchDrivers}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#ff781f] text-black font-semibold text-xs font-mono hover:bg-[#ff8e3d] transition-all shadow-md shadow-[#ff781f]/10"
            >
              <Search className="h-4 w-4" />
              <span>[ 🔍 Find Official Drivers on Google ]</span>
            </button>
          </div>
        </div>

        {/* Quick Links to Official Repositories */}
        <div>
          <span className="text-[11px] font-mono text-[#6b7280] block mb-2">
            DIRECT MANUFACTURER SUPPORT REPOSITORIES:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {OFFICIAL_DRIVER_PORTALS.map(portal => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#1c1c24] border border-[#2b2b36] hover:border-[#434354] hover:bg-[#22222c] text-xs text-[#d1d5db] transition-all"
                title={portal.description}
              >
                <span className="font-medium truncate">{portal.name}</span>
                <ExternalLink className="h-3 w-3 text-gray-500 shrink-0 ml-1" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
