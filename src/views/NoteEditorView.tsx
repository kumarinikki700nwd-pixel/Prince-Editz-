import React, { useState, useEffect, useRef } from 'react';
import { Note, NoteTheme, PaperSize, Orientation, MarginPreset, PdfDocument } from '../types';
import {
  generatePdfBlob,
  getPageDimensions,
  getMarginMm,
  downloadBlob,
} from '../lib/pdf';
import {
  ArrowLeft,
  Save,
  FileCheck2,
  Edit3,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Image,
  Table,
  Undo,
  Redo,
  CheckCircle2,
  Trash2,
  Download,
  Loader2,
} from 'lucide-react';

interface NoteEditorViewProps {
  note: Note | null; // null if creating a new note
  onSaveNote: (note: Note) => void;
  onDeleteNote?: (id: string) => void;
  onBack: () => void;
  onPdfSaved: (pdf: PdfDocument) => void;
}

const themeOptions: { value: NoteTheme; label: string; twBg: string }[] = [
  { value: 'blue', label: 'Blue', twBg: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', twBg: 'bg-purple-500' },
  { value: 'green', label: 'Green', twBg: 'bg-emerald-500' },
  { value: 'orange', label: 'Orange', twBg: 'bg-amber-500' },
  { value: 'red', label: 'Red', twBg: 'bg-rose-500' },
  { value: 'yellow', label: 'Yellow', twBg: 'bg-amber-400' },
  { value: 'gray', label: 'Gray', twBg: 'bg-slate-500' },
];

export const NoteEditorView: React.FC<NoteEditorViewProps> = ({
  note,
  onSaveNote,
  onDeleteNote,
  onBack,
  onPdfSaved,
}) => {
  const isNew = !note;
  const [title, setTitle] = useState(note?.title ?? 'Untitled Note');
  const [subtitle, setSubtitle] = useState(note?.subtitle ?? '');
  const [content, setContent] = useState(
    note?.content ?? '<p>Write your note here with rich formatting, lists, tables, and images...</p>'
  );
  const [theme, setTheme] = useState<NoteTheme>(note?.theme ?? 'blue');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // PDF Settings
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [marginPreset, setMarginPreset] = useState<MarginPreset>('medium');
  const [customMargin, setCustomMargin] = useState(20);

  // States
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && activeTab === 'editor') {
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content;
      }
    }
  }, [activeTab]);

  // Formatting helpers using document.execCommand
  const format = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertImage = () => {
    const url = window.prompt(
      'Enter image URL (e.g. https://images.unsplash.com/photo-1517842645767-c639042777db?w=600)'
    );
    if (url) {
      format('insertImage', url);
    }
  };

  const insertTable = () => {
    const rows = parseInt(window.prompt('Number of rows:', '3') || '3', 10);
    const cols = parseInt(window.prompt('Number of columns:', '3') || '3', 10);
    if (rows > 0 && cols > 0) {
      let html = '<table style="width:100%; border-collapse:collapse; margin: 12px 0;"><tbody>';
      for (let r = 0; r < rows; r++) {
        html += '<tr>';
        for (let c = 0; c < cols; c++) {
          html +=
            r === 0
              ? '<th style="border:1px solid #cbd5e1; background:#f1f5f9; padding:8px;">Header</th>'
              : '<td style="border:1px solid #e2e8f0; padding:8px;">Data</td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table><p></p>';
      format('insertHTML', html);
    }
  };

  const handleSave = (silent = false) => {
    const updatedNote: Note = {
      id: note?.id || 'note-' + Date.now(),
      title: title.trim() || 'Untitled Note',
      subtitle: subtitle.trim(),
      content: content,
      theme,
      isPinned: note?.isPinned || false,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveNote(updatedNote);
    if (!silent) {
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(''), 2500);
    }
  };

  // Auto-save every 25 seconds if changes occurred
  useEffect(() => {
    const interval = setInterval(() => {
      if (editorRef.current) {
        handleSave(true);
      }
    }, 25000);
    return () => clearInterval(interval);
  }, [title, subtitle, content, theme]);

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const { blob, pageCount, base64 } = await generatePdfBlob(title, subtitle, content, {
        paperSize,
        orientation,
        marginPreset,
        customMargin,
      });

      // Save PDF to library
      const newPdf: PdfDocument = {
        id: 'pdf-' + Date.now(),
        noteId: note?.id,
        title: title || 'Untitled Document',
        fileData: base64,
        pageCount,
        paperSize,
        orientation,
        margins: getMarginMm({ paperSize, orientation, marginPreset, customMargin }),
        fileSizeKb: Math.round(blob.size / 1024),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onPdfSaved(newPdf);

      // Download file to browser/device
      const cleanFileName = `ColorNote-${(title || 'Note').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      downloadBlob(blob, cleanFileName);

      setSaveStatus('PDF Exported & Downloaded!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Unable to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // PDF Preview scale calculations
  const marginMm = getMarginMm({ paperSize, orientation, marginPreset, customMargin });
  const { width: pageWidthMm, height: pageHeightMm } = getPageDimensions({
    paperSize,
    orientation,
    marginPreset,
    customMargin,
  });
  const previewScale = 0.52;
  const previewWidth = pageWidthMm * previewScale;
  const previewHeight = pageHeightMm * previewScale;

  return (
    <div className="space-y-4 pb-24 md:pb-12 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-slate-900">
            {isNew ? 'New Note' : 'Editing Note'}
          </span>
          {saveStatus && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveStatus}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs: Editor vs PDF Preview */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'editor'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'preview'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>PDF Preview</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={() => handleSave(false)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span className="hidden xs:inline">Save</span>
          </button>

          {/* Delete Option if editing existing */}
          {!isNew && onDeleteNote && note && (
            <button
              onClick={() => onDeleteNote(note.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
              title="Delete Note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {activeTab === 'editor' ? (
        /* =================== RICH TEXT EDITOR =================== */
        <div className="space-y-4">
          {/* Meta & Theme */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title..."
                className="w-full text-2xl sm:text-3xl font-black text-slate-900 placeholder:text-slate-300 outline-none"
              />
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Add a subtitle or description (optional)..."
                className="w-full mt-1 text-sm sm:text-base text-slate-500 placeholder:text-slate-300 outline-none font-medium"
              />
            </div>

            {/* Theme Picker */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Color Theme:</span>
              <div className="flex items-center gap-1.5">
                {themeOptions.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTheme(t.value)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                      theme === t.value
                        ? 'bg-slate-900 text-white shadow-xs ring-2 ring-indigo-400'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${t.twBg}`} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-1">
            <button
              onClick={() => format('bold')}
              title="Bold"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => format('italic')}
              title="Italic"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => format('underline')}
              title="Underline"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              onClick={() => format('strikeThrough')}
              title="Strikethrough"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-slate-200 mx-1" />

            <button
              onClick={() => format('formatBlock', '<h1>')}
              title="Heading 1"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => format('formatBlock', '<h2>')}
              title="Heading 2"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => format('formatBlock', '<h3>')}
              title="Heading 3"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-slate-200 mx-1" />

            <button
              onClick={() => format('insertUnorderedList')}
              title="Bullet List"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => format('insertOrderedList')}
              title="Numbered List"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-slate-200 mx-1" />

            <button
              onClick={() => format('justifyLeft')}
              title="Align Left"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => format('justifyCenter')}
              title="Align Center"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => format('justifyRight')}
              title="Align Right"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-slate-200 mx-1" />

            <button
              onClick={() => format('formatBlock', '<blockquote>')}
              title="Quote block"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              onClick={() => format('formatBlock', '<pre>')}
              title="Code block"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={insertTable}
              title="Insert Table"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={insertImage}
              title="Insert Image"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Image className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-slate-200 mx-1" />

            <button
              onClick={() => format('undo')}
              title="Undo"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => format('redo')}
              title="Redo"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Editable Canvas */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs min-h-[480px]">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditorInput}
              className="outline-none min-h-[440px] text-slate-800 text-sm sm:text-base leading-relaxed focus:outline-none selection:bg-indigo-100"
            />
          </div>
        </div>
      ) : (
        /* =================== PDF PREVIEW & EXPORT =================== */
        <div className="space-y-4">
          {/* PDF Settings Controls */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              Document Layout &amp; Margin Settings
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Paper Size</label>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value as PaperSize)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                >
                  <option value="a4">A4 (210 × 297 mm)</option>
                  <option value="a5">A5 (148 × 210 mm)</option>
                  <option value="letter">Letter (8.5 × 11 in)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Orientation</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as Orientation)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Margins</label>
                <select
                  value={marginPreset}
                  onChange={(e) => setMarginPreset(e.target.value as MarginPreset)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                >
                  <option value="small">Small (12 mm)</option>
                  <option value="medium">Medium (20 mm)</option>
                  <option value="large">Large (32 mm)</option>
                  <option value="custom">Custom Margin</option>
                </select>
              </div>

              {marginPreset === 'custom' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Custom Margin (mm)</label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={customMargin}
                    onChange={(e) => setCustomMargin(Number(e.target.value) || 20)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                  />
                </div>
              ) : (
                <div className="flex items-end">
                  <button
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-2 px-3 text-xs font-bold text-white shadow-md shadow-red-200 transition disabled:opacity-50"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Export PDF</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {marginPreset === 'custom' && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-2 px-4 text-xs font-bold text-white shadow-md shadow-red-200 transition disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Rendering PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Export &amp; Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Scaled Sheet Preview */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-200/70 rounded-2xl border border-slate-300/80 overflow-x-auto">
            <p className="text-xs font-semibold text-slate-500 mb-3">
              Live Page Sheet Preview • {paperSize.toUpperCase()} {orientation} ({marginMm}mm margins)
            </p>

            <div
              className="relative bg-white shadow-2xl rounded-sm transition-all"
              style={{
                width: `${previewWidth}mm`,
                minHeight: `${previewHeight}mm`,
                padding: `${marginMm * previewScale}mm`,
              }}
            >
              <div className="border-b border-slate-200 pb-2 mb-3">
                <h1
                  className="font-extrabold text-slate-900 break-words leading-tight"
                  style={{ fontSize: `${24 * previewScale}pt` }}
                >
                  {title || 'Untitled Note'}
                </h1>
                {subtitle && (
                  <h2
                    className="font-medium text-slate-600 break-words mt-1"
                    style={{ fontSize: `${14 * previewScale}pt` }}
                  >
                    {subtitle}
                  </h2>
                )}
                <div className="flex items-center gap-2 mt-2 text-[9px] text-slate-400 uppercase font-semibold">
                  <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded text-[8px]">
                    ColorNote
                  </span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div
                className="prose prose-xs text-slate-800 break-words"
                style={{ fontSize: `${11 * previewScale}pt`, lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
