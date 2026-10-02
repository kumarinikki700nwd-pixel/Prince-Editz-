import React from 'react';
import { Smartphone, Monitor, PackageCheck } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { NavTab } from './BottomNav';

interface HeaderProps {
  onSelectTab: (tab: NavTab) => void;
  isSimulatorActive: boolean;
  onToggleSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTab,
  isSimulatorActive,
  onToggleSimulator,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-lg shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            C
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                ColorNote
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200/60 uppercase">
                APK
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 font-medium">
              Notes, PDF &amp; Android App
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* APK Center Quick Button */}
          <button
            onClick={() => onSelectTab('apk')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition border border-indigo-200/80"
          >
            <PackageCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="hidden xs:inline">APK Center</span>
          </button>

          {/* Toggle Simulator */}
          <button
            onClick={onToggleSimulator}
            title={isSimulatorActive ? 'Switch to Fullscreen / Desktop view' : 'Preview in Android Phone Frame'}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            {isSimulatorActive ? (
              <>
                <Monitor className="w-4 h-4 text-slate-600" />
                <span>Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span>Phone Frame</span>
              </>
            )}
          </button>

          {/* Direct Install APK Button */}
          <PWAInstallButton variant="primary" label="Install APK" className="text-xs sm:text-sm" />
        </div>
      </div>
    </header>
  );
};
