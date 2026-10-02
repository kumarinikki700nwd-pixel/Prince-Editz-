import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, X } from 'lucide-react';

interface Props {
  className?: string;
  variant?: 'primary' | 'subtle' | 'compact';
  label?: string;
}

export const PWAInstallButton: React.FC<Props> = ({
  className = '',
  variant = 'primary',
  label = 'Install APK / App',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showModalFallback, setShowModalFallback] = useState(false);

  // If already installed as native PWA/WebAPK, show an "Installed" badge or null
  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        APK Installed
      </span>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowModalFallback(true);
    }
  };

  const getButtonStyles = () => {
    if (variant === 'compact') {
      return 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition';
    }
    if (variant === 'subtle') {
      return 'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition';
    }
    return 'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200 active:scale-95 transition';
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`${getButtonStyles()} ${className}`}
        title="Install as Android WebAPK on your device"
      >
        <Smartphone className="w-4 h-4 shrink-0" />
        <span>{label}</span>
      </button>

      {/* iOS Safari Instructions */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                Install on iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">1</span>
                <p>Tap the <strong>Share</strong> button in the bottom Safari toolbar.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">2</span>
                <p>Scroll down and select <strong>Add to Home Screen</strong>.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">3</span>
                <p>Tap <strong>Add</strong> in the top right corner to launch as a standalone app.</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Android / Desktop Instructions Fallback */}
      {showModalFallback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-600" />
                Install ColorNote APK / App
              </h3>
              <button
                onClick={() => setShowModalFallback(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p className="text-slate-800 font-medium">To install on Android:</p>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 text-sm">
                <li>Open this app in <strong>Chrome</strong> or <strong>Samsung Internet</strong> on Android.</li>
                <li>Tap the <strong>three vertical dots menu (⋮)</strong> in the top right corner.</li>
                <li>Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
                <li>Android will generate an official WebAPK and add it directly to your app launcher!</li>
              </ol>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-800">
                💡 <strong>Need the actual .apk file or source?</strong> Click the <strong>APK Center</strong> tab in the navigation bar to download the complete ready-to-compile Android Studio project (.zip)!
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowModalFallback(false)}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
