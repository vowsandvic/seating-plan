// QR rendering helpers built on qrcode-generator. Pure: produce an SVG path / module grid
// the UI can draw as inline SVG or paint onto a canvas for a PNG download.
import qrcode from 'qrcode-generator';

export interface QrMatrix {
  size: number;
  isDark: (row: number, col: number) => boolean;
}

/** Medium error correction: survives a smudged print while keeping the code sparse. */
export function qrMatrix(text: string): QrMatrix {
  const qr = qrcode(0, 'M');
  qr.addData(text, 'Byte');
  qr.make();
  return { size: qr.getModuleCount(), isDark: (r, c) => qr.isDark(r, c) };
}

/** One SVG path (`M x y h1 v1 h-1 z` per dark module) in module units, offset by `margin`. */
export function qrSvgPath(m: QrMatrix, margin: number): string {
  let d = '';
  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) {
      if (m.isDark(r, c)) d += `M${c + margin} ${r + margin}h1v1h-1z`;
    }
  }
  return d;
}
