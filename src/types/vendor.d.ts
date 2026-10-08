declare module 'utif' {
  export function decode(buffer: ArrayBuffer): any[];
  export function decodeImage(buffer: ArrayBuffer, ifd: any): void;
  export function toRGBA8(ifd: any): Uint8Array;
}

declare module 'dxf-parser' {
  export default class DxfParser {
    parseSync(dxfString: string): any;
  }
}
