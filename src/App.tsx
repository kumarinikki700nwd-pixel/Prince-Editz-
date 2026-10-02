import React, { useState, useEffect } from 'react';
import { Note, PdfDocument, UserProfile } from './types';
import { Storage } from './lib/storage';
import { NavTab, BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { AndroidFrame } from './components/AndroidFrame';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ConfirmModal } from './components/ConfirmModal';

// Views
import { DashboardView } from './views/DashboardView';
import { NotesView } from './views/NotesView';
import { NoteEditorView } from './views/NoteEditorView';
import { PdfsView } from './views/PdfsView';
import { ApkView } from './views/ApkView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [user, setUser] = useState<UserProfile>(Storage.getUser());
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [activeEditingNoteId, setActiveEditingNoteId] = useState<string | null>(null);
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    destructive?: boolean;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Load data on mount
  useEffect(() => {
    setNotes(Storage.getNotes());
    setPdfs(Storage.getPdfs());
    setUser(Storage.getUser());
  }, []);

  const handleSelectTab = (tab: NavTab) => {
    if (tab === 'create') {
      setActiveEditingNoteId(null);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditNote = (id: string) => {
    setActiveEditingNoteId(id);
    setCurrentTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveNote = (savedNote: Note) => {
    const updated = Storage.saveNote(savedNote);
    setNotes(Storage.getNotes());
    setActiveEditingNoteId(updated.id);
  };

  const handleDuplicateNote = (id: string) => {
    const duplicated = Storage.duplicateNote(id);
    if (duplicated) {
      setNotes(Storage.getNotes());
    }
  };

  const handleDeleteNotePrompt = (id: string) => {
    const noteToDelete = notes.find((n) => n.id === id);
    setConfirmModal({
      open: true,
      title: 'Delete Note?',
      message: `Are you sure you want to permanently delete "${noteToDelete?.title || 'this note'}"? This cannot be undone.`,
      confirmText: 'Delete',
      destructive: true,
      onConfirm: () => {
        Storage.deleteNote(id);
        setNotes(Storage.getNotes());
        if (activeEditingNoteId === id) {
          setActiveEditingNoteId(null);
          setCurrentTab('notes');
        }
        setConfirmModal((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleTogglePinNote = (id: string) => {
    const target = notes.find((n) => n.id === id);
    if (target) {
      Storage.saveNote({ ...target, isPinned: !target.isPinned });
      setNotes(Storage.getNotes());
    }
  };

  const handleDeletePdfPrompt = (id: string) => {
    const pdfToDelete = pdfs.find((p) => p.id === id);
    setConfirmModal({
      open: true,
      title: 'Delete PDF Document?',
      message: `Are you sure you want to delete "${pdfToDelete?.title || 'this PDF'}"?`,
      confirmText: 'Delete',
      destructive: true,
      onConfirm: () => {
        Storage.deletePdf(id);
        setPdfs(Storage.getPdfs());
        setConfirmModal((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handlePdfSaved = (newPdf: PdfDocument) => {
    Storage.savePdf(newPdf);
    setPdfs(Storage.getPdfs());
  };

  const handleResetDataPrompt = () => {
    setConfirmModal({
      open: true,
      title: 'Reset Demo Data?',
      message: 'This will reset your notes and PDFs back to initial demo examples.',
      confirmText: 'Reset',
      destructive: true,
      onConfirm: () => {
        Storage.resetAll();
        setNotes(Storage.getNotes());
        setPdfs(Storage.getPdfs());
        setUser(Storage.getUser());
        setConfirmModal((prev) => ({ ...prev, open: false }));
      },
    });
  };

  // Find the note currently being edited
  const currentEditingNote = activeEditingNoteId
    ? notes.find((n) => n.id === activeEditingNoteId) || null
    : null;

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            user={user}
            notes={notes}
            pdfs={pdfs}
            onSelectTab={handleSelectTab}
            onEditNote={handleEditNote}
            onDuplicateNote={handleDuplicateNote}
            onDeleteNote={handleDeleteNotePrompt}
          />
        );

      case 'notes':
        return (
          <NotesView
            notes={notes}
            onNewNote={() => handleSelectTab('create')}
            onEditNote={handleEditNote}
            onDuplicateNote={handleDuplicateNote}
            onDeleteNote={handleDeleteNotePrompt}
            onTogglePinNote={handleTogglePinNote}
          />
        );

      case 'create':
        return (
          <NoteEditorView
            note={currentEditingNote}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNotePrompt}
            onBack={() => handleSelectTab('notes')}
            onPdfSaved={handlePdfSaved}
          />
        );

      case 'pdfs':
        return (
          <PdfsView
            pdfs={pdfs}
            onDeletePdf={handleDeletePdfPrompt}
            onNewNote={() => handleSelectTab('create')}
          />
        );

      case 'apk':
        return (
          <ApkView
            isSimulatorActive={isSimulatorActive}
            onToggleSimulator={() => setIsSimulatorActive(!isSimulatorActive)}
          />
        );

      case 'settings':
        return (
          <SettingsView
            user={user}
            notes={notes}
            pdfs={pdfs}
            onUpdateUser={(updated) => {
              Storage.saveUser(updated);
              setUser(updated);
            }}
            onResetData={handleResetDataPrompt}
            onDataImported={() => {
              setNotes(Storage.getNotes());
              setPdfs(Storage.getPdfs());
              setUser(Storage.getUser());
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AndroidFrame
      isSimulatorActive={isSimulatorActive}
      onToggleSimulator={() => setIsSimulatorActive(false)}
    >
      <div className="flex flex-col min-h-screen">
        {/* Sticky App Header */}
        <Header
          onSelectTab={handleSelectTab}
          isSimulatorActive={isSimulatorActive}
          onToggleSimulator={() => setIsSimulatorActive(!isSimulatorActive)}
        />

        {/* Active Tab Screen */}
        <main className="flex-1">{renderActiveView()}</main>

        {/* Bottom App Navigation */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          isSimulatorActive={isSimulatorActive}
        />

        {/* Global Offline Network Status Toast */}
        <OfflineIndicator />

        {/* Confirmation Modal */}
        <ConfirmModal
          open={confirmModal.open}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          destructive={confirmModal.destructive}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
        />
      </div>
    </AndroidFrame>
  );
}
