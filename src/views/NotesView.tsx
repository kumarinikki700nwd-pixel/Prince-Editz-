import React, { useState, useMemo } from 'react';
import { Note, NoteTheme } from '../types';
import {
  Search,
  Plus,
  Pin,
  Clock,
  LayoutGrid,
  List,
  Copy,
  Trash2,
  FileEdit,
  FileCheck2,
} from 'lucide-react';

interface NotesViewProps {
  notes: Note[];
  onNewNote: () => void;
  onEditNote: (id: string) => void;
  onDuplicateNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onTogglePinNote: (id: string) => void;
}

const themeOptions: { value: 'all' | NoteTheme; label: string; twBg: string }[] = [
  { value: 'all', label: 'All', twBg: 'bg-slate-700' },
  { value: 'blue', label: 'Blue', twBg: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', twBg: 'bg-purple-500' },
  { value: 'green', label: 'Green', twBg: 'bg-emerald-500' },
  { value: 'orange', label: 'Orange', twBg: 'bg-amber-500' },
  { value: 'red', label: 'Red', twBg: 'bg-rose-500' },
  { value: 'yellow', label: 'Yellow', twBg: 'bg-amber-400' },
  { value: 'gray', label: 'Gray', twBg: 'bg-slate-500' },
];

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

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onNewNote,
  onEditNote,
  onDuplicateNote,
  onDeleteNote,
  onTogglePinNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<'all' | NoteTheme>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'newest' | 'oldest' | 'az'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredNotes = useMemo(() => {
    let result = notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.subtitle && note.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTheme = selectedTheme === 'all' || note.theme === selectedTheme;
      return matchesSearch && matchesTheme;
    });

    result = [...result].sort((a, b) => {
      // Pinned notes always surface first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'az':
          return a.title.localeCompare(b.title);
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return result;
  }, [notes, searchQuery, selectedTheme, sortBy]);

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-6xl mx-auto px-4 sm:px-6 pt-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notes Library</h1>
          <p className="text-xs text-slate-500">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} available
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onNewNote}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in title or content..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 font-medium outline-none focus:border-indigo-500 transition"
        >
          <option value="updated">Recently Updated</option>
          <option value="newest">Date Created (Newest)</option>
          <option value="oldest">Date Created (Oldest)</option>
          <option value="az">Title (A-Z)</option>
        </select>
      </div>

      {/* Color Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {themeOptions.map((opt) => {
          const isActive = selectedTheme === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSelectedTheme(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${opt.twBg}`} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Notes Display */}
      {filteredNotes.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center border border-slate-200/80 shadow-xs">
          <p className="text-base font-bold text-slate-900">No notes found</p>
          <p className="mt-1 text-xs text-slate-500">
            {searchQuery
              ? `No notes matched "${searchQuery}". Try a different keyword.`
              : 'Try selecting a different color tag or create a new note.'}
          </p>
          <button
            onClick={onNewNote}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Note</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
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
                    <span className="text-[11px] font-semibold uppercase text-slate-400">
                      {note.theme}
                    </span>
                    {note.isPinned && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Pin className="w-2.5 h-2.5 fill-amber-500" />
                        PINNED
                      </span>
                    )}
                  </div>
                  <h3
                    onClick={() => onEditNote(note.id)}
                    className="mt-1.5 text-base font-bold text-slate-900 truncate hover:text-indigo-600 cursor-pointer"
                  >
                    {note.title || 'Untitled Note'}
                  </h3>
                  {note.subtitle && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">{note.subtitle}</p>
                  )}
                </div>

                <button
                  onClick={() => onTogglePinNote(note.id)}
                  title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                  className={`p-1.5 rounded-lg transition ${
                    note.isPinned
                      ? 'text-amber-500 bg-amber-50'
                      : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-amber-500' : ''}`} />
                </button>
              </div>

              {/* Note snippet */}
              <p
                onClick={() => onEditNote(note.id)}
                className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed flex-1 cursor-pointer"
              >
                {stripHtml(note.content) || 'Empty note...'}
              </p>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(note.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                <div className="flex items-center gap-1">
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
                    className="ml-1 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1"
                  >
                    <FileEdit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-slate-100 rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition border-l-4 ${
                themeBorders[note.theme] || 'border-l-indigo-500'
              }`}
            >
              <div
                onClick={() => onEditNote(note.id)}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 truncate hover:text-indigo-600">
                    {note.title || 'Untitled Note'}
                  </h3>
                  {note.isPinned && (
                    <Pin className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {note.subtitle || stripHtml(note.content) || 'No content'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onTogglePinNote(note.id)}
                  className={`p-1.5 rounded-lg transition ${
                    note.isPinned
                      ? 'text-amber-500 bg-amber-50'
                      : 'text-slate-300 hover:text-slate-600'
                  }`}
                >
                  <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-500' : ''}`} />
                </button>
                <button
                  onClick={() => onDuplicateNote(note.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onEditNote(note.id)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
