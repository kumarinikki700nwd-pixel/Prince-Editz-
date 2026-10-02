import React from 'react';
import { Home, FileText, PlusCircle, FileCheck2, PackageCheck, Settings } from 'lucide-react';

export type NavTab = 'dashboard' | 'notes' | 'create' | 'pdfs' | 'apk' | 'settings';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isSimulatorActive?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  isSimulatorActive = false,
}) => {
  const navItems: { tab: NavTab; label: string; icon: React.ReactNode; isFab?: boolean }[] = [
    { tab: 'dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { tab: 'notes', label: 'Notes', icon: <FileText className="w-5 h-5" /> },
    {
      tab: 'create',
      label: 'New',
      icon: <PlusCircle className="w-7 h-7 text-white" />,
      isFab: true,
    },
    { tab: 'pdfs', label: 'PDFs', icon: <FileCheck2 className="w-5 h-5" /> },
    { tab: 'apk', label: 'APK', icon: <PackageCheck className="w-5 h-5" /> },
    { tab: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav
      className={`${
        isSimulatorActive ? 'sticky' : 'fixed'
      } bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 transition-all shadow-[0_-4px_20px_rgba(0,0,0,0.04)]`}
    >
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;

          if (item.isFab) {
            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                className="group relative -top-3 flex flex-col items-center focus:outline-none"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-300/50 transition-transform group-hover:scale-110 group-active:scale-95">
                  {item.icon}
                </div>
                <span className="text-[10px] font-semibold text-indigo-600 mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.tab}
              onClick={() => onSelectTab(item.tab)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
