export type HardwareConnectionType = 'usb' | 'network' | 'bluetooth' | 'spooler';

export interface USBDeviceInfo {
  productName: string;
  manufacturerName: string;
  vendorId: number;
  productId: number;
  serialNumber?: string;
  connected: boolean;
}

export interface NetworkPrinterConfig {
  ipAddress: string;
  port: number; // 631 for IPP, 9100 for AppSocket/RAW
  protocol: 'ipp' | 'raw';
  status: 'disconnected' | 'testing' | 'connected' | 'error';
  lastStatusMessage?: string;
}

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  connected: boolean;
}

export interface DriverResolverState {
  detectedOS: string;
  selectedBrand: string;
  modelNumber: string;
}

export interface OfficialDriverLink {
  brand: string;
  name: string;
  url: string;
  description: string;
}
