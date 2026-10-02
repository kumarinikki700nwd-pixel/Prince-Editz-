export type NoteTheme = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'gray';

export type PaperSize = 'a4' | 'a5' | 'letter';
export type Orientation = 'portrait' | 'landscape';
export type MarginPreset = 'small' | 'medium' | 'large' | 'custom';

export interface Note {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  theme: NoteTheme;
  isPinned?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PdfDocument {
  id: string;
  noteId?: string;
  title: string;
  fileData?: string; // base64 data URL
  pageCount: number;
  paperSize: PaperSize;
  orientation: Orientation;
  margins: number; // in mm
  createdAt: string;
  updatedAt: string;
  fileSizeKb?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
}

export interface PdfSettings {
  paperSize: PaperSize;
  orientation: Orientation;
  marginPreset: MarginPreset;
  customMargin?: number;
}
