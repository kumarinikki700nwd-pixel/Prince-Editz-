import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:right-auto md:left-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900/95 text-white px-4 py-2.5 text-xs font-medium shadow-2xl backdrop-blur-md border border-slate-800">
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
      <span>Offline Mode — All notes and PDFs are saved locally on your device.</span>
    </div>
  );
};
