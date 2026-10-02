import React, { useState } from 'react';
import {
  DEFAULT_APK_CONFIG,
  ApkConfig,
  downloadAndroidStudioProjectZip,
} from '../lib/apk-generator';
import { PWAInstallButton } from '../components/PWAInstallButton';
import {
  PackageCheck,
  Download,
  Terminal,
  Smartphone,
  CheckCircle,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Layers,
  FileCode,
  FolderArchive,
  Loader2,
  Play,
} from 'lucide-react';

interface ApkViewProps {
  isSimulatorActive: boolean;
  onToggleSimulator: () => void;
}

export const ApkView: React.FC<ApkViewProps> = ({ isSimulatorActive, onToggleSimulator }) => {
  const [apkConfig, setApkConfig] = useState<ApkConfig>({
    ...DEFAULT_APK_CONFIG,
    appUrl: window.location.origin,
  });
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'instant' | 'source' | 'cloud' | 'cli'>('source');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsGeneratingZip(true);
    try {
      await downloadAndroidStudioProjectZip(apkConfig);
    } catch (err) {
      console.error('Failed to generate APK project zip:', err);
      alert('Error generating APK source zip. Please try again.');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const currentUrl = window.location.origin;

  return (
    <div className="space-y-6 pb-28 md:pb-12 max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-indigo-900/50">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30 mb-3">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Android APK Conversion Suite</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Convert ColorNote to Android APK
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Your notes and PDF application is fully prepared for Android. You can install it directly as an Android WebAPK, download the complete Android Studio Gradle source project (.zip), or compile a signed release binary.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isGeneratingZip}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/40 hover:from-emerald-600 hover:to-teal-700 transition active:scale-95 disabled:opacity-50"
            >
              {isGeneratingZip ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Packaging Project...</span>
                </>
              ) : (
                <>
                  <FolderArchive className="w-4 h-4" />
                  <span>Download Android Studio ZIP</span>
                </>
              )}
            </button>

            <button
              onClick={onToggleSimulator}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 transition backdrop-blur-md"
            >
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>{isSimulatorActive ? 'Exit Phone Frame' : 'Live Android Simulator'}</span>
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Conversion Method Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveTab('source')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'source'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          <span>1. Android Studio Project (.zip)</span>
        </button>

        <button
          onClick={() => setActiveTab('instant')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'instant'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>2. Direct WebAPK Install</span>
        </button>

        <button
          onClick={() => setActiveTab('cloud')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'cloud'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ExternalLink className="w-4 h-4" />
          <span>3. Cloud APK Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('cli')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'cli'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>4. CLI / Bubblewrap Build</span>
        </button>
      </div>

      {/* Tab 1: Android Studio Project Source (.zip) */}
      {activeTab === 'source' && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FolderArchive className="w-5 h-5 text-indigo-600" />
                  Full Android Studio Project Exporter
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Generates an Android Gradle project ready to compile into an APK using Android Studio or command-line Gradle.
                </p>
              </div>

              <button
                onClick={handleDownloadZip}
                disabled={isGeneratingZip}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 px-5 text-xs font-bold text-white shadow-md shadow-indigo-200 transition active:scale-95 disabled:opacity-50"
              >
                {isGeneratingZip ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating ZIP...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Project (.zip)</span>
                  </>
                )}
              </button>
            </div>

            {/* Included Files Overview */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Pre-configured Files in Downloaded ZIP:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <FileCode className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">app/src/main/AndroidManifest.xml</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Configured with Package <code>{apkConfig.appId}</code>, Internet permissions, and Portrait lock.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <FileCode className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">app/build.gradle</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Target SDK 34 (Android 14), Min SDK 24 (Android 7.0+), Version Code {apkConfig.versionCode}.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <Code2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">MainActivity.java</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Hardware-accelerated WebView container with offline storage and native hardware back-button handling.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <Layers className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">res/values/ (styles, strings, colors)</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Native Material theme styling, action bar suppression, and brand colors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick 2-Step Build Instructions */}
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
              <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                How to compile your .apk in 60 seconds:
              </h4>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-indigo-900 leading-relaxed">
                <li>
                  Download and unzip <code>ColorNote-Android-APK-Project-v2.4.0.zip</code>.
                </li>
                <li>
                  Open terminal inside the unzipped folder and run:
                  <div className="mt-1.5 relative">
                    <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto">
                      ./gradlew assembleDebug
                    </pre>
                    <button
                      onClick={() => handleCopy('./gradlew assembleDebug', 'gradle')}
                      className="absolute right-2 top-2 p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                    >
                      {copiedCmd === 'gradle' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </li>
                <li>
                  Your installable <code>app-debug.apk</code> is produced at{' '}
                  <code className="bg-white/80 px-1 py-0.5 rounded text-indigo-950 font-semibold">
                    app/build/outputs/apk/debug/app-debug.apk
                  </code>
                  !
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Direct WebAPK Install */}
      {activeTab === 'instant' && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                Direct Android WebAPK Installation
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Zero compilation required! Android creates an official WebAPK binary that installs right into your app drawer.
              </p>
            </div>
            <PWAInstallButton label="Install APK Now" variant="primary" />
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Why WebAPK on Android?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                <h5 className="font-bold text-slate-900">Official Android Package</h5>
                <p className="text-slate-500 text-[11px]">
                  Google Play Services automatically signs and installs an APK file on your Android device.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <Sparkles className="w-5 h-5 text-indigo-600 mb-1" />
                <h5 className="font-bold text-slate-900">Fullscreen Experience</h5>
                <p className="text-slate-500 text-[11px]">
                  No browser URL bar or navigation buttons. Runs exactly like a native Android app from Play Store.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <CheckCircle className="w-5 h-5 text-indigo-600 mb-1" />
                <h5 className="font-bold text-slate-900">100% Offline Capable</h5>
                <p className="text-slate-500 text-[11px]">
                  Service worker caches all app resources. Notes and PDFs are saved locally and load without network.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cloud 1-Click APK Builder */}
      {activeTab === 'cloud' && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-indigo-600" />
              Cloud 1-Click APK Generator (PWABuilder)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Use Microsoft&apos;s open-source <strong>PWABuilder</strong> to generate ready-to-publish Google Play APK &amp; AAB packages directly in the cloud.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <p className="text-xs text-slate-700">
              1. Copy your application URL:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-mono text-slate-800 outline-none"
              />
              <button
                onClick={() => handleCopy(currentUrl, 'url')}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-semibold text-slate-800 transition"
              >
                {copiedCmd === 'url' ? 'Copied!' : 'Copy URL'}
              </button>
            </div>

            <p className="text-xs text-slate-700 pt-2">
              2. Open PWABuilder, paste your URL, and click <strong>Package for Android</strong>:
            </p>
            <a
              href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition"
            >
              <span>Launch PWABuilder Cloud Packaging</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Tab 4: Bubblewrap CLI */}
      {activeTab === 'cli' && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-600" />
              Build with Google&apos;s Official Bubblewrap CLI
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Bubblewrap is Google&apos;s command-line tool for generating Trusted Web Activity (TWA) APK binaries for Android.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Step 1: Install Bubblewrap
              </label>
              <div className="relative">
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                  npm install -g @bubblewrap/cli
                </pre>
                <button
                  onClick={() => handleCopy('npm install -g @bubblewrap/cli', 'cli1')}
                  className="absolute right-2.5 top-2.5 p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  {copiedCmd === 'cli1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Step 2: Initialize Android Project from Manifest
              </label>
              <div className="relative">
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                  {`bubblewrap init --manifest="${currentUrl}/manifest.webmanifest"`}
                </pre>
                <button
                  onClick={() =>
                    handleCopy(`bubblewrap init --manifest="${currentUrl}/manifest.webmanifest"`, 'cli2')
                  }
                  className="absolute right-2.5 top-2.5 p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  {copiedCmd === 'cli2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Step 3: Build APK
              </label>
              <div className="relative">
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                  bubblewrap build
                </pre>
                <button
                  onClick={() => handleCopy('bubblewrap build', 'cli3')}
                  className="absolute right-2.5 top-2.5 p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  {copiedCmd === 'cli3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APK Configuration Specification Card */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-600" />
          Android Package Configuration Specs
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Application Name</span>
            <span className="font-bold text-slate-800 text-sm">{apkConfig.appName}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Package ID</span>
            <span className="font-bold text-slate-800 text-sm font-mono">{apkConfig.appId}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Version Name / Code</span>
            <span className="font-bold text-slate-800 text-sm">v{apkConfig.versionName} ({apkConfig.versionCode})</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">SDK Support</span>
            <span className="font-bold text-slate-800 text-sm">Android 7.0 - 14.0 (API 24-34)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
