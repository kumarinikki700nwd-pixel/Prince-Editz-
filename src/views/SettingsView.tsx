import React, { useState, useRef } from 'react';
import { UserProfile, Note, PdfDocument } from '../types';
import { Storage } from '../lib/storage';
import {
  User,
  Settings as SettingsIcon,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  PackageCheck,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Mail,
  Calendar,
} from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  notes: Note[];
  pdfs: PdfDocument[];
  onUpdateUser: (user: UserProfile) => void;
  onResetData: () => void;
  onDataImported: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  notes,
  pdfs,
  onUpdateUser,
  onResetData,
  onDataImported,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [statusMsg, setStatusMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, name: name.trim(), email: email.trim() };
    onUpdateUser(updated);
    setStatusMsg('Profile updated!');
    setTimeout(() => setStatusMsg(''), 2500);
  };

  const handleExportBackup = () => {
    const dataStr = Storage.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ColorNote-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatusMsg('Backup downloaded!');
    setTimeout(() => setStatusMsg(''), 2500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const success = Storage.importData(text);
        if (success) {
          onDataImported();
          setStatusMsg('Data successfully imported!');
        } else {
          alert('Invalid backup file format');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 pb-28 md:pb-12 max-w-4xl mx-auto px-4 sm:px-6 pt-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settings &amp; Storage</h1>
        <p className="text-xs text-slate-500">Manage user profile, local storage, backups and APK diagnostics</p>
      </div>

      {statusMsg && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* User Profile Card */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          User Profile
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Data & Storage Management */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-indigo-600" />
          Local Storage &amp; Data Management
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block">Total Notes Saved</span>
            <span className="text-lg font-bold text-slate-800">{notes.length}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block">Total PDFs Generated</span>
            <span className="text-lg font-bold text-slate-800">{pdfs.length}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block">Persistence</span>
            <span className="text-lg font-bold text-emerald-600">Offline-First</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-2.5">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Restore Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            onClick={onResetData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 transition ml-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Notes</span>
          </button>
        </div>
      </div>

      {/* APK Diagnostics Card */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-indigo-600" />
          APK &amp; System Information
        </h2>

        <div className="space-y-2 text-xs text-slate-600 divide-y divide-slate-100">
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Application</span>
            <span className="font-semibold text-slate-800">ColorNote: Notes &amp; PDF</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Package Identifier</span>
            <span className="font-mono font-semibold text-slate-800">com.colornote.app</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Release Version</span>
            <span className="font-semibold text-slate-800">2.4.0 (Build 24)</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Platform Target</span>
            <span className="font-semibold text-emerald-600">Android 7.0 - 14.0 (API 24 - 34)</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Rendering Engine</span>
            <span className="font-semibold text-slate-800">React 19 + jsPDF + HTML2Canvas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
