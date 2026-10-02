import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isSimulatorActive: boolean;
  onToggleSimulator: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isSimulatorActive,
  onToggleSimulator,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isSimulatorActive) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-center">
      {/* Device Frame Bar */}
      <div className="mb-4 flex items-center justify-between w-full max-w-[430px] px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-200">Android APK Preview Mode</span>
        </div>
        <button
          onClick={onToggleSimulator}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Exit Mobile Frame</span>
        </button>
      </div>

      {/* Simulated Android Device (Pixel 8 / Galaxy S24) */}
      <div className="relative w-full max-w-[420px] h-[860px] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[6px] border-slate-700 ring-1 ring-slate-800 flex flex-col overflow-hidden">
        {/* Android Punch Hole Camera */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 ring-2 ring-slate-800 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900 ring-1 ring-indigo-950" />
        </div>

        {/* Android Status Bar */}
        <div className="relative z-40 bg-white/95 backdrop-blur-md px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-slate-800 select-none border-b border-slate-100/50">
          <span>{timeStr || '09:41'}</span>
          <div className="flex items-center gap-2 text-slate-700">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* App Screen Content */}
        <div className="relative flex-1 bg-slate-50 overflow-y-auto overflow-x-hidden flex flex-col">
          {children}
        </div>

        {/* Android Bottom Navigation Pill */}
        <div className="relative z-40 bg-white px-4 py-2 flex justify-center items-center select-none border-t border-slate-100">
          <div className="w-32 h-1 bg-slate-400 rounded-full" />
        </div>
      </div>
    </div>
  );
};
