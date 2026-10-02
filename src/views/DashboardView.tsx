import React from 'react';
import { Note, PdfDocument, UserProfile } from '../types';
import { NavTab } from '../components/BottomNav';
import {
  FileText,
  FileCheck2,
  Plus,
  PackageCheck,
  Sparkles,
  ArrowRight,
  Pin,
  Clock,
  Trash2,
  Copy,
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  notes: Note[];
  pdfs: PdfDocument[];
  onSelectTab: (tab: NavTab) => void;
  onEditNote: (id: string) => void;
  onDuplicateNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

const themeGradients: Record<string, string> = {
  blue: 'from-blue-500 to-indigo-600',
  purple: 'from-purple-500 to-violet-600',
  green: 'from-emerald-500 to-teal-600',
  orange: 'from-amber-500 to-orange-600',
  red: 'from-rose-500 to-red-600',
  yellow: 'from-amber-400 to-yellow-500',
  gray: 'from-slate-500 to-slate-700',
};

const themeBorders: Record<string, string> = {
  blue: 'border-l-blue-500',
  purple: 'border-l-purple-500',
  green: 'border-l-emerald-500',
  orange: 'border-l-amber-500',
  red: 'border-l-rose-500',
  yellow: 'border-l-amber-400',
  gray: 'border-l-slate-500',
};

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  notes,
  pdfs,
  onSelectTab,
  onEditNote,
  onDuplicateNote,
  onDeleteNote,
}) => {
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const pinnedNotesCount = notes.filter((n) => n.isPinned).length;

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-6xl mx-auto px-4 sm:px-6 pt-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Android APK &amp; Mobile Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
            Create rich color-coded notes, export publication-grade PDFs, or convert this app directly into an Android APK.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('create')}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 shadow-md hover:bg-indigo-50 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create New Note</span>
            </button>
            <button
              onClick={() => onSelectTab('apk')}
              className="flex items-center gap-2 rounded-xl bg-indigo-950/40 px-4 py-2.5 text-sm font-semibold text-white border border-white/25 hover:bg-indigo-950/60 transition backdrop-blur-md"
            >
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              <span>Convert to APK</span>
            </button>
          </div>
        </div>

        {/* Decorative graphic */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => onSelectTab('notes')}
          className="cursor-pointer rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Notes</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{notes.length}</p>
          <p className="mt-1 text-xs text-indigo-600 font-medium flex items-center gap-1">
            <span>View library</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        <div
          onClick={() => onSelectTab('pdfs')}
          className="cursor-pointer rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Exported PDFs</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{pdfs.length}</p>
          <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
            <span>View documents</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        <div
          onClick={() => onSelectTab('notes')}
          className="cursor-pointer rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pinned Notes</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Pin className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{pinnedNotesCount}</p>
          <p className="mt-1 text-xs text-amber-600 font-medium">Prioritized notes</p>
        </div>

        <div
          onClick={() => onSelectTab('apk')}
          className="cursor-pointer rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-xs hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">APK Package</span>
            <div className="p-2 rounded-xl bg-white/20 text-white group-hover:scale-110 transition-transform">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">v2.4.0</p>
          <p className="mt-1 text-xs text-emerald-100 font-medium flex items-center gap-1">
            <span>Download APK source</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* Recent Notes Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recent Notes</h2>
          <p className="text-xs text-slate-500">Pick up where you left off</p>
        </div>
        <button
          onClick={() => onSelectTab('notes')}
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <span>View all ({notes.length})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recent Notes Grid */}
      {recentNotes.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No notes found</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Create your first rich color note and export it as a clean PDF!
          </p>
          <button
            onClick={() => onSelectTab('create')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Note</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentNotes.map((note) => (
            <div
              key={note.id}
              className={`flex flex-col rounded-2xl bg-white p-5 border border-slate-200/80 border-l-4 ${
                themeBorders[note.theme] || 'border-l-indigo-500'
              } shadow-xs hover:shadow-md transition-all group`}
            >
              {/* Note Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-8 rounded-full bg-gradient-to-r ${
                        themeGradients[note.theme] || themeGradients.blue
                      }`}
                    />
                    {note.isPinned && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Pin className="w-3 h-3 fill-amber-500" />
                        Pinned
                      </span>
                    )}
                  </div>
                  <h3
                    onClick={() => onEditNote(note.id)}
                    className="mt-2 text-base font-bold text-slate-900 truncate hover:text-indigo-600 cursor-pointer"
                  >
                    {note.title || 'Untitled Note'}
                  </h3>
                  {note.subtitle && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">{note.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Note Content preview */}
              <p
                onClick={() => onEditNote(note.id)}
                className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed flex-1 cursor-pointer"
              >
                {stripHtml(note.content) || 'Empty note...'}
              </p>

              {/* Note Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(note.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onDuplicateNote(note.id)}
                    title="Duplicate note"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    title="Delete note"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEditNote(note.id)}
                    className="ml-1 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
