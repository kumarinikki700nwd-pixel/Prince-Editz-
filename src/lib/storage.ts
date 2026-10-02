import { Note, PdfDocument, UserProfile } from '../types';

const STORAGE_KEY_NOTES = 'colornote_notes_v1';
const STORAGE_KEY_PDFS = 'colornote_pdfs_v1';
const STORAGE_KEY_USER = 'colornote_user_v1';

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Welcome to ColorNote Mobile & APK',
    subtitle: 'Professional Note-taking & PDF Publishing',
    content: `
      <h2>✨ All-in-one Notes &amp; PDF Powerhouse</h2>
      <p>Welcome to <strong>ColorNote</strong>! Designed specifically for mobile Android experience, desktop productivity, and instant APK compilation.</p>
      <ul>
        <li><strong>Color Coding:</strong> Organize your thoughts with 7 distinctive color themes.</li>
        <li><strong>Rich Formatting:</strong> Headings, blockquotes, code blocks, lists, and tables.</li>
        <li><strong>PDF Export:</strong> One-tap pixel-perfect document rendering with custom paper sizes (A4, A5, Letter) and margins.</li>
        <li><strong>Offline-First:</strong> All notes are stored securely on your device with zero cloud dependency.</li>
      </ul>
      <blockquote>"Simplicity is the prerequisite for reliability." — Edsger W. Dijkstra</blockquote>
      <p>Tap the <strong>APK button</strong> in the top bar to install on your Android device or export the complete Android Studio APK project!</p>
    `.trim(),
    theme: 'blue',
    isPinned: true,
    tags: ['Overview', 'Guide'],
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'note-2',
    title: 'Android APK Conversion Guide',
    subtitle: 'How this app transforms into a native Android APK',
    content: `
      <h3>🚀 3 Ways to Convert to APK</h3>
      <ol>
        <li><strong>Direct Android WebAPK Install:</strong> Tap <em>Install APK</em>. Android Chrome/Samsung Internet packages this app instantly into a genuine Android WebAPK with an app icon in your app drawer.</li>
        <li><strong>Download Android Studio Project (.zip):</strong> Head over to the APK Center tab. Click <em>Generate Android Studio ZIP</em> to get full Java / Gradle sources configured with package <code>com.colornote.app</code>.</li>
        <li><strong>Cloud Build (PWABuilder / Bubblewrap):</strong> Use Google's official Bubblewrap or PWABuilder to generate signed Google Play Store APK/AAB binaries in under 2 minutes.</li>
      </ol>
      <p>The code includes complete Android manifests, permissions, and native splash screens.</p>
    `.trim(),
    theme: 'green',
    isPinned: true,
    tags: ['APK', 'Android'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'note-3',
    title: 'Product Launch Checklist & Roadmap',
    subtitle: 'Sprint milestones & release schedule',
    content: `
      <h3>📋 Release Goals</h3>
      <ul>
        <li>✅ Finalize Rich Text WYSIWYG Editor</li>
        <li>✅ Implement jsPDF Canvas rendering engine</li>
        <li>✅ Configure Android PWA manifest &amp; WebAPK compliance</li>
        <li>✅ Package Android Studio Gradle project exporter</li>
        <li>⏳ Publish to Google Play Store &amp; F-Droid</li>
      </ul>
      <p>Ensure all margins and paper orientations are calibrated for print &amp; digital distribution.</p>
    `.trim(),
    theme: 'purple',
    isPinned: false,
    tags: ['Work', 'Roadmap'],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'note-4',
    title: 'Meeting Minutes & Action Items',
    subtitle: 'Weekly engineering sync',
    content: `
      <h3>Key Discussions</h3>
      <p>Discussed client-side storage architecture, ensuring lightning-fast load times even without an active internet connection. Tested PDF generation on mobile viewports with 96 DPI scale.</p>
      <p><strong>Next Steps:</strong> Verify background synchronization and offline state handling.</p>
    `.trim(),
    theme: 'orange',
    isPinned: false,
    tags: ['Meeting'],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

const INITIAL_USER: UserProfile = {
  name: 'Nikki Kumari',
  email: 'kumarinikki700nwd@gmail.com',
  joinedAt: new Date().toISOString(),
};

export const Storage = {
  getNotes(): Note[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_NOTES);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(INITIAL_NOTES));
        return INITIAL_NOTES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTES;
    }
  },

  saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  },

  getNoteById(id: string): Note | undefined {
    return this.getNotes().find((n) => n.id === id);
  },

  saveNote(note: Note): Note {
    const notes = this.getNotes();
    const existingIndex = notes.findIndex((n) => n.id === note.id);
    const now = new Date().toISOString();
    const updatedNote = {
      ...note,
      updatedAt: now,
      createdAt: note.createdAt || now,
    };

    if (existingIndex >= 0) {
      notes[existingIndex] = updatedNote;
    } else {
      notes.unshift(updatedNote);
    }
    this.saveNotes(notes);
    return updatedNote;
  },

  deleteNote(id: string): void {
    const notes = this.getNotes().filter((n) => n.id !== id);
    this.saveNotes(notes);
  },

  duplicateNote(id: string): Note | null {
    const note = this.getNoteById(id);
    if (!note) return null;
    const newNote: Note = {
      ...note,
      id: 'note-' + Date.now(),
      title: `${note.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.saveNote(newNote);
  },

  getPdfs(): PdfDocument[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PDFS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  savePdfs(pdfs: PdfDocument[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_PDFS, JSON.stringify(pdfs));
    } catch (err) {
      console.error('Failed to save pdfs:', err);
    }
  },

  savePdf(pdf: PdfDocument): PdfDocument {
    const pdfs = this.getPdfs();
    const existingIndex = pdfs.findIndex((p) => p.id === pdf.id);
    if (existingIndex >= 0) {
      pdfs[existingIndex] = pdf;
    } else {
      pdfs.unshift(pdf);
    }
    this.savePdfs(pdfs);
    return pdf;
  },

  deletePdf(id: string): void {
    const pdfs = this.getPdfs().filter((p) => p.id !== id);
    this.savePdfs(pdfs);
  },

  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(INITIAL_USER));
        return INITIAL_USER;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_USER;
    }
  },

  saveUser(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  },

  exportAllData(): string {
    const payload = {
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      notes: this.getNotes(),
      pdfs: this.getPdfs().map((p) => ({ ...p, fileData: undefined })), // avoid huge base64 in metadata dump
    };
    return JSON.stringify(payload, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.notes)) {
        this.saveNotes(parsed.notes);
      }
      if (parsed.user) {
        this.saveUser(parsed.user);
      }
      return true;
    } catch {
      return false;
    }
  },

  resetAll(): void {
    localStorage.removeItem(STORAGE_KEY_NOTES);
    localStorage.removeItem(STORAGE_KEY_PDFS);
    localStorage.removeItem(STORAGE_KEY_USER);
  },
};
