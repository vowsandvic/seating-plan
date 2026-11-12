import { useMemo } from 'react';
import { qrMatrix, qrSvgPath } from '../../domain/qr';

const MARGIN = 4; // quiet zone in modules, per the QR spec

/** Crisp, resolution-independent QR as inline SVG (always black on white for scanners). */
export function QrCode({ text, size = 200, label }: { text: string; size?: number; label?: string }) {
  const { view, d } = useMemo(() => {
    const m = qrMatrix(text);
    return { view: m.size + MARGIN * 2, d: qrSvgPath(m, MARGIN) };
  }, [text]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${view} ${view}`} shapeRendering="crispEdges" role="img" aria-label={label ?? text}>
      <rect width={view} height={view} fill="#fff" />
      <path d={d} fill="#000" />
    </svg>
  );
}

/** Renders the QR onto a canvas and triggers a PNG download (about 1024px, print-friendly). */
export function downloadQrPng(text: string, filename: string) {
  const m = qrMatrix(text);
  const view = m.size + MARGIN * 2;
  const cell = Math.max(4, Math.floor(1024 / view));
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = view * cell;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) {
      if (m.isDark(r, c)) ctx.fillRect((c + MARGIN) * cell, (r + MARGIN) * cell, cell, cell);
    }
  }
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
