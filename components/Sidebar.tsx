import React from 'react';
import { 
  LayoutDashboard, 
  Plane, 
  CalendarDays, 
  Settings, 
  PieChart,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const navItems = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: Plane, label: "Live Traffic", active: false },
    { icon: CalendarDays, label: "Schedule", active: false },
    { icon: PieChart, label: "Analytics", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container - Industrial Dark Theme */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-72 text-slate-300 transition-transform duration-300 ease-out
        lg:translate-x-0 lg:static lg:block
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-[#1e293b] border-r-4 border-[#0f172a] shadow-[10px_0_20px_rgba(0,0,0,0.3)]
      `}>
        {/* Logo Section with "Metal Plate" look */}
        <div className="flex items-center gap-3 p-6 border-b border-slate-700/50 bg-gradient-to-b from-[#1e293b] to-[#0f172a]">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2.5 rounded-xl shadow-[0_4px_0_#312e81,0_5px_10px_rgba(0,0,0,0.5)] border-t border-indigo-400">
            <Plane className="w-6 h-6 text-white drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>SkyTrack</h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Control Unit v2.5</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`
                relative w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-lg transition-all duration-100 group
                ${item.active 
                  ? 'text-indigo-400 bg-[#0f172a] shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)] translate-y-[1px]' 
                  : 'text-slate-400 bg-gradient-to-b from-[#334155] to-[#1e293b] shadow-[0_4px_0_#0f172a,0_5px_5px_rgba(0,0,0,0.4)] border-t border-slate-600 hover:brightness-110 active:shadow-none active:translate-y-[4px] active:border-t-0'}
              `}
            >
              {/* Little LED indicator for active state */}
              <div className={`w-1.5 h-1.5 rounded-full mr-1 transition-colors duration-300 ${item.active ? 'bg-indigo-400 shadow-[0_0_8px_#6366f1]' : 'bg-slate-600'}`} />
              
              <item.icon className={`w-5 h-5 ${item.active ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span style={{ textShadow: item.active ? '0 0 10px rgba(99, 102, 241, 0.3)' : 'none' }}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50 bg-[#1e293b]">
          <button className="flex items-center w-full gap-3 px-4 py-3 text-sm font-bold text-slate-400 bg-[#1e293b] hover:text-white rounded-lg border border-slate-700 hover:bg-slate-700 active:bg-slate-800 transition-colors shadow-sm">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;