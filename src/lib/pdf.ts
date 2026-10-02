import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PaperSize, Orientation, MarginPreset, PdfSettings } from '../types';

export const MARGIN_PRESETS: Record<MarginPreset, number> = {
  small: 12,
  medium: 20,
  large: 32,
  custom: 20,
};

export const PAGE_DIMENSIONS_MM: Record<PaperSize, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  a5: { width: 148, height: 210 },
  letter: { width: 215.9, height: 279.4 },
};

const PX_PER_MM = 3.7795275591; // 96 DPI standard

export function getMarginMm(settings: PdfSettings): number {
  if (settings.marginPreset === 'custom' && typeof settings.customMargin === 'number') {
    return Math.max(5, Math.min(60, settings.customMargin));
  }
  return MARGIN_PRESETS[settings.marginPreset] ?? MARGIN_PRESETS.medium;
}

export function getPageDimensions(settings: PdfSettings) {
  const dims = PAGE_DIMENSIONS_MM[settings.paperSize];
  if (settings.orientation === 'landscape') {
    return { width: dims.height, height: dims.width };
  }
  return dims;
}

export function buildPrintableHtml(title: string, subtitle: string, content: string): string {
  return `
    <div class="pdf-document">
      <header class="pdf-header">
        <h1 class="pdf-title">${title || 'Untitled Note'}</h1>
        ${subtitle ? `<h2 class="pdf-subtitle">${subtitle}</h2>` : ''}
        <div class="pdf-meta-bar">
          <span class="pdf-badge">ColorNote Mobile</span>
          <span class="pdf-date">${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </header>
      <hr class="pdf-divider" />
      <div class="pdf-body">${content || '<p>No content</p>'}</div>
    </div>
  `;
}

export async function generatePdfBlob(
  title: string,
  subtitle: string,
  content: string,
  settings: PdfSettings
): Promise<{ blob: Blob; pageCount: number; base64: string }> {
  const marginMm = getMarginMm(settings);
  const { width: pageWidthMm, height: pageHeightMm } = getPageDimensions(settings);
  const contentWidthMm = pageWidthMm - marginMm * 2;
  const contentHeightMm = pageHeightMm - marginMm * 2;

  const container = document.createElement('div');
  container.innerHTML = buildPrintableHtml(title, subtitle, content);
  const printable = container.firstElementChild as HTMLElement;
  if (!printable) throw new Error('Failed to build printable content');

  printable.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: ${contentWidthMm * PX_PER_MM}px;
    min-height: ${contentHeightMm * PX_PER_MM}px;
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1e293b;
    background: #ffffff;
    box-sizing: border-box;
    overflow: visible;
  `;

  const style = document.createElement('style');
  style.textContent = `
    .pdf-header { margin-bottom: 16px; }
    .pdf-title { font-size: 26pt; font-weight: 800; margin: 0 0 6px 0; line-height: 1.2; color: #0f172a; letter-spacing: -0.5px; }
    .pdf-subtitle { font-size: 15pt; font-weight: 500; margin: 0 0 12px 0; color: #64748b; line-height: 1.4; }
    .pdf-meta-bar { display: flex; align-items: center; gap: 12px; font-size: 9pt; color: #94a3b8; }
    .pdf-badge { background: #4f46e5; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-weight: 600; text-transform: uppercase; font-size: 8pt; }
    .pdf-divider { border: none; border-top: 1.5px solid #e2e8f0; margin: 16px 0 20px 0; }
    .pdf-body p { margin: 0 0 12px 0; }
    .pdf-body h1 { font-size: 20pt; font-weight: 700; margin: 24px 0 10px 0; color: #1e293b; }
    .pdf-body h2 { font-size: 16pt; font-weight: 700; margin: 20px 0 8px 0; color: #334155; }
    .pdf-body h3 { font-size: 13pt; font-weight: 600; margin: 16px 0 6px 0; color: #475569; }
    .pdf-body ul, .pdf-body ol { margin: 0 0 12px 24px; padding: 0; }
    .pdf-body li { margin-bottom: 5px; }
    .pdf-body blockquote { margin: 16px 0; padding: 10px 16px; border-left: 4px solid #6366f1; background: #f8fafc; color: #475569; font-style: italic; border-radius: 0 8px 8px 0; }
    .pdf-body pre { background: #0f172a; color: #f8fafc; padding: 14px; border-radius: 8px; overflow-wrap: break-word; white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, monospace; font-size: 9.5pt; margin: 14px 0; }
    .pdf-body code { font-family: ui-monospace, SFMono-Regular, monospace; font-size: 9.5pt; background: #f1f5f9; color: #4f46e5; padding: 2px 5px; border-radius: 4px; }
    .pdf-body img { max-width: 100%; height: auto; display: block; margin: 14px 0; border-radius: 8px; }
    .pdf-body table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 10pt; }
    .pdf-body th { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-weight: 600; color: #334155; }
    .pdf-body td { border: 1px solid #e2e8f0; padding: 8px 12px; }
  `;

  document.body.appendChild(style);
  document.body.appendChild(printable);

  try {
    const scale = 2; // high resolution crisp 2x rendering
    const canvas = await html2canvas(printable, {
      scale,
      useCORS: true,
      logging: false,
      width: contentWidthMm * PX_PER_MM,
      windowWidth: contentWidthMm * PX_PER_MM,
      backgroundColor: '#ffffff',
    });

    const pageContentHeightPx = contentHeightMm * PX_PER_MM * scale;
    const totalHeightPx = canvas.height;
    const pageCount = Math.max(1, Math.ceil(totalHeightPx / pageContentHeightPx));

    const pdf = new jsPDF({
      unit: 'mm',
      format: settings.paperSize,
      orientation: settings.orientation,
    });

    for (let page = 0; page < pageCount; page++) {
      if (page > 0) pdf.addPage();
      const sourceY = page * pageContentHeightPx;
      const remainingHeight = totalHeightPx - sourceY;
      const sliceHeight = Math.min(pageContentHeightPx, remainingHeight);

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;
      const ctx = pageCanvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight
      );

      const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
      const sliceHeightMm = sliceHeight / scale / PX_PER_MM;

      pdf.addImage(imgData, 'JPEG', marginMm, marginMm, contentWidthMm, sliceHeightMm);

      // Add small page footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${page + 1} of ${pageCount} • Generated by ColorNote`,
        pageWidthMm / 2,
        pageHeightMm - 6,
        { align: 'center' }
      );
    }

    const blob = pdf.output('blob');
    const base64 = pdf.output('datauristring');
    return { blob, pageCount, base64 };
  } finally {
    printable.remove();
    style.remove();
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
