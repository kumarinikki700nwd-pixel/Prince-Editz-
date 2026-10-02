import React, { useState } from 'react';
import { PdfDocument } from '../types';
import { downloadBlob } from '../lib/pdf';
import {
  FileCheck2,
  Download,
  Trash2,
  ExternalLink,
  Plus,
  Clock,
  FileText,
  X,
  Eye,
} from 'lucide-react';

interface PdfsViewProps {
  pdfs: PdfDocument[];
  onDeletePdf: (id: string) => void;
  onNewNote: () => void;
}

export const PdfsView: React.FC<PdfsViewProps> = ({ pdfs, onDeletePdf, onNewNote }) => {
  const [activeViewerPdf, setActiveViewerPdf] = useState<PdfDocument | null>(null);

  const handleDownload = (pdf: PdfDocument) => {
    if (!pdf.fileData) return;
    const a = document.createElement('a');
    a.href = pdf.fileData;
    a.download = `ColorNote-${(pdf.title || 'Document').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-6xl mx-auto px-4 sm:px-6 pt-6">
      {/* Title Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Exported PDFs</h1>
          <p className="text-xs text-slate-500">
            {pdfs.length} {pdfs.length === 1 ? 'document' : 'documents'} generated
          </p>
        </div>

        <button
          onClick={onNewNote}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Note</span>
        </button>
      </div>

      {pdfs.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-3">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No PDFs exported yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Open any note and tap the <strong>PDF Preview</strong> tab to export clean, publication-ready PDF files.
          </p>
          <button
            onClick={onNewNote}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create a Note</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="flex flex-col rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all group"
            >
              {/* Document Thumbnail Preview Icon */}
              <div
                onClick={() => setActiveViewerPdf(pdf)}
                className="cursor-pointer relative aspect-[16/10] w-full bg-gradient-to-br from-slate-100 to-slate-200/60 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-4 overflow-hidden group-hover:border-indigo-300 transition-colors"
              >
                <div className="w-12 h-16 bg-white rounded-md shadow-sm border border-slate-200/80 flex flex-col items-center justify-center relative">
                  <div className="w-6 h-1 bg-red-500 rounded-full mb-1" />
                  <div className="w-7 h-0.5 bg-slate-300 rounded mb-0.5" />
                  <div className="w-7 h-0.5 bg-slate-300 rounded mb-0.5" />
                  <div className="w-5 h-0.5 bg-slate-300 rounded" />
                  <span className="absolute bottom-1 right-1 text-[7px] font-bold text-red-600">
                    PDF
                  </span>
                </div>
                <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-indigo-700 font-bold text-xs rounded-full shadow-md">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </span>
                </div>
              </div>

              {/* PDF Details */}
              <div className="mt-3 flex-1">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {pdf.title || 'Untitled Document'}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 uppercase font-semibold">
                    {pdf.paperSize}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{pdf.orientation}</span>
                  <span>•</span>
                  <span>{pdf.margins}mm margin</span>
                  {pdf.fileSizeKb && (
                    <>
                      <span>•</span>
                      <span>{pdf.fileSizeKb} KB</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(pdf.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveViewerPdf(pdf)}
                    title="View PDF"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(pdf)}
                    title="Download .pdf file"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeletePdf(pdf.id)}
                    title="Delete PDF"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Full Viewer Modal */}
      {activeViewerPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 min-w-0">
                <FileCheck2 className="w-5 h-5 text-red-600 shrink-0" />
                <h3 className="font-bold text-slate-900 truncate">
                  {activeViewerPdf.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(activeViewerPdf)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setActiveViewerPdf(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
              {activeViewerPdf.fileData ? (
                <iframe
                  src={activeViewerPdf.fileData}
                  className="w-full h-full border-none"
                  title="PDF Document"
                />
              ) : (
                <p className="text-white text-sm">PDF content unavailable</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
