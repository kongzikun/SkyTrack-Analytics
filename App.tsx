import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Menu, 
  RefreshCw,
  CloudLightning,
  Users
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import { FlightVolumeChart, AirlineShareChart, StatusBarChart } from './components/Charts';
import { fetchDashboardData } from './services/geminiService';
import { DashboardData, FetchStatus } from './types';

const INITIAL_DATA: DashboardData = {
  dailyStats: [],
  airlineShares: [],
  summary: {
    totalFlightsLast30Days: 0,
    avgOnTimePerformance: 0,
    totalCancellations: 0,
    busiestDay: '-'
  },
  insights: []
};

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [scenario, setScenario] = useState<string>('standard');

  const loadData = useCallback(async (selectedScenario: string) => {
    setStatus(FetchStatus.LOADING);
    try {
      const result = await fetchDashboardData(selectedScenario);
      setData(result);
      setStatus(FetchStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(FetchStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    loadData('standard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScenarioChange = (newScenario: string) => {
    setScenario(newScenario);
    loadData(newScenario);
  };

  // Skeuomorphic Card Component
  const StatCard = ({ title, value, subtext, icon: Icon, colorClass }: any) => (
    <div className="relative p-5 rounded-2xl bg-slate-100 border-t border-white border-l border-white border-b border-slate-300 border-r border-slate-300 shadow-[5px_5px_10px_rgba(164,177,205,0.4),-5px_-5px_10px_#ffffff]">
      <div className="flex justify-between items-start mb-4">
        <div>
           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
           <div className="bg-slate-200/50 rounded-lg p-2 shadow-[inset_2px_2px_5px_rgba(164,177,205,0.3),inset_-2px_-2px_5px_#ffffff] border-b border-white/50">
             <h3 className="text-2xl font-mono font-bold text-slate-700">{value}</h3>
           </div>
        </div>
        {/* Icon Button Look */}
        <div className={`p-3 rounded-xl shadow-[3px_3px_6px_rgba(164,177,205,0.4),-2px_-2px_5px_#ffffff] border-t border-white ${colorClass}`}>
           <Icon className="w-6 h-6 text-white drop-shadow-sm" />
        </div>
      </div>
      {subtext && (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${subtext.includes('+') || value > 80 ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-slate-400'}`}></div>
          <p className="text-xs font-semibold text-slate-500">{subtext}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-[#e2e8f0] overflow-hidden font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top shadow overlay for depth under header */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/5 to-transparent z-10 pointer-events-none" />

        {/* Skeuomorphic Header */}
        <header className="h-20 bg-[#e2e8f0] flex items-center justify-between px-4 lg:px-8 z-20 border-b border-slate-300 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-indigo-600 active:scale-95 transition-transform"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-700 tracking-tight drop-shadow-sm hidden sm:block">
              Dashboard Overview
            </h2>
          </div>
          
          <div className="flex items-center gap-4 bg-[#e2e8f0] p-2 rounded-2xl shadow-[inset_3px_3px_6px_rgba(164,177,205,0.5),inset_-3px_-3px_6px_#ffffff]">
            {/* Inset Select Box */}
            <div className="relative group">
              <select 
                value={scenario}
                onChange={(e) => handleScenarioChange(e.target.value)}
                disabled={status === FetchStatus.LOADING}
                className="appearance-none bg-[#e2e8f0] text-sm font-bold text-slate-600 rounded-xl px-4 py-2 pr-8 border-none focus:ring-0 shadow-[4px_4px_8px_rgba(164,177,205,0.5),-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_rgba(164,177,205,0.5),inset_-2px_-2px_4px_#ffffff] transition-all cursor-pointer hover:text-indigo-600"
              >
                <option value="standard">Standard Traffic</option>
                <option value="holiday">Holiday Season</option>
                <option value="storm">Severe Weather</option>
                <option value="strike">Airline Strike</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                 <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-500"></div>
              </div>
            </div>
            
            {/* 3D Button */}
            <button 
              onClick={() => loadData(scenario)}
              disabled={status === FetchStatus.LOADING}
              className="relative group bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all 
                         shadow-[0_4px_0_#3730a3,0_6px_6px_rgba(0,0,0,0.2)] 
                         active:shadow-none active:translate-y-[4px] border-t border-indigo-400 disabled:opacity-70 disabled:active:translate-y-0 disabled:shadow-none"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${status === FetchStatus.LOADING ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{status === FetchStatus.LOADING ? 'Updating...' : 'Refresh'}</span>
              </div>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#e2e8f0]">
          {status === FetchStatus.ERROR ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="bg-red-100 p-6 rounded-full shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">System Malfunction</h3>
              <p className="text-slate-500 mb-8">Data retrieval failed. Check connection.</p>
              <button 
                onClick={() => loadData(scenario)}
                className="px-6 py-3 bg-slate-700 text-white font-bold rounded-xl shadow-[0_4px_0_#1e293b] active:shadow-none active:translate-y-[4px] transition-all"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Flights (30d)" 
                  value={status === FetchStatus.LOADING ? "----" : data.summary.totalFlightsLast30Days.toLocaleString()} 
                  subtext="+2.4% vs last month"
                  icon={Activity}
                  colorClass="bg-indigo-500"
                />
                <StatCard 
                  title="On-Time Perf" 
                  value={status === FetchStatus.LOADING ? "--" : `${data.summary.avgOnTimePerformance}%`} 
                  subtext={data.summary.avgOnTimePerformance > 85 ? "Optimal" : "Suboptimal"}
                  icon={CheckCircle2}
                  colorClass={data.summary.avgOnTimePerformance > 80 ? "bg-emerald-500" : "bg-amber-500"}
                />
                <StatCard 
                  title="Cancellations" 
                  value={status === FetchStatus.LOADING ? "--" : data.summary.totalCancellations} 
                  subtext="Critical Alerts"
                  icon={AlertCircle}
                  colorClass="bg-rose-500"
                />
                <StatCard 
                  title="Peak Volume" 
                  value={status === FetchStatus.LOADING ? "----" : data.summary.busiestDay.split('-').slice(1).join('/')} 
                  subtext="Busiest Day"
                  icon={TrendingUp}
                  colorClass="bg-blue-500"
                />
              </div>

              {/* Main Chart Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Flight Volume Line Chart - Raised Panel with Inset Screen */}
                <div className="lg:col-span-2 rounded-3xl bg-[#e2e8f0] border border-white shadow-[8px_8px_16px_rgba(164,177,205,0.4),-8px_-8px_16px_#ffffff] p-6">
                  <div className="flex items-center justify-between mb-6 px-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-700 drop-shadow-sm">Flight Volume Trends</h3>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">30 Day Analysis</p>
                    </div>
                    {/* Toggle-like Legend */}
                    <div className="flex bg-[#e2e8f0] p-1 rounded-lg shadow-[inset_2px_2px_4px_rgba(164,177,205,0.5),inset_-2px_-2px_4px_#ffffff]">
                      <div className="px-3 py-1 rounded-md text-xs font-bold text-indigo-600 bg-white shadow-sm">Total</div>
                      <div className="px-3 py-1 rounded-md text-xs font-bold text-amber-600">Delayed</div>
                    </div>
                  </div>
                  
                  {/* The "Screen" - Inset shadow */}
                  <div className="bg-slate-100 rounded-xl p-4 shadow-[inset_4px_4px_8px_rgba(164,177,205,0.3),inset_-4px_-4px_8px_#ffffff] border border-slate-200/50">
                    {status === FetchStatus.LOADING ? (
                      <div className="h-[350px] flex flex-col items-center justify-center text-slate-300 animate-pulse">
                         <Activity className="w-12 h-12 mb-2 opacity-50" />
                         <p className="font-mono text-sm">INITIALIZING VISUALIZATION...</p>
                      </div>
                    ) : (
                      <FlightVolumeChart data={data.dailyStats} />
                    )}
                  </div>
                </div>

                {/* AI Insights Panel - "Notepad" or "Message Log" style */}
                <div className="rounded-3xl bg-[#e2e8f0] border border-white shadow-[8px_8px_16px_rgba(164,177,205,0.4),-8px_-8px_16px_#ffffff] p-6 flex flex-col">
                   <div className="flex items-center gap-3 mb-6 border-b border-slate-300 pb-4">
                      <div className="p-2 bg-violet-500 rounded-lg shadow-[2px_2px_4px_rgba(0,0,0,0.2)] text-white">
                        <CloudLightning className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700">AI Analysis Log</h3>
                   </div>
                   
                   <div className="flex-1 space-y-4">
                     {status === FetchStatus.LOADING ? (
                       [1, 2, 3].map(i => (
                         <div key={i} className="h-24 rounded-xl bg-[#e2e8f0] shadow-[inset_2px_2px_4px_rgba(164,177,205,0.5),inset_-2px_-2px_4px_#ffffff] animate-pulse" />
                       ))
                     ) : (
                       data.insights.map((insight, idx) => (
                         <div key={idx} className="p-4 bg-slate-50 rounded-xl border-l-4 border-violet-400 shadow-[2px_2px_5px_rgba(164,177,205,0.2)] text-sm font-medium text-slate-600 leading-relaxed">
                           "{insight}"
                         </div>
                       ))
                     )}
                   </div>
                </div>
              </div>

              {/* Secondary Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
                 <div className="rounded-3xl bg-[#e2e8f0] border border-white shadow-[8px_8px_16px_rgba(164,177,205,0.4),-8px_-8px_16px_#ffffff] p-6">
                    <div className="flex items-center gap-3 mb-6 px-2">
                      <div className="p-2 bg-slate-200 rounded-full shadow-[3px_3px_6px_rgba(164,177,205,0.5),-3px_-3px_6px_#ffffff]">
                        <Users className="w-4 h-4 text-slate-500" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700">Market Share</h3>
                    </div>
                    <div className="bg-slate-100 rounded-xl p-2 shadow-[inset_4px_4px_8px_rgba(164,177,205,0.3),inset_-4px_-4px_8px_#ffffff]">
                      {status === FetchStatus.LOADING ? (
                         <div className="h-[300px] flex items-center justify-center text-slate-300 animate-pulse">
                            <div className="w-32 h-32 rounded-full border-8 border-slate-200 border-t-slate-300" />
                         </div>
                      ) : (
                         <AirlineShareChart data={data.airlineShares} />
                      )}
                    </div>
                 </div>

                 <div className="rounded-3xl bg-[#e2e8f0] border border-white shadow-[8px_8px_16px_rgba(164,177,205,0.4),-8px_-8px_16px_#ffffff] p-6">
                    <div className="flex items-center gap-3 mb-6 px-2">
                      <div className="p-2 bg-slate-200 rounded-full shadow-[3px_3px_6px_rgba(164,177,205,0.5),-3px_-3px_6px_#ffffff]">
                        <Activity className="w-4 h-4 text-slate-500" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700">7-Day Performance</h3>
                    </div>
                    <div className="bg-slate-100 rounded-xl p-2 shadow-[inset_4px_4px_8px_rgba(164,177,205,0.3),inset_-4px_-4px_8px_#ffffff]">
                      {status === FetchStatus.LOADING ? (
                         <div className="h-[300px] flex items-end justify-around px-8 pb-8 animate-pulse">
                            {[1,2,3,4,5,6,7].map(h => <div key={h} className="w-8 bg-slate-200 rounded-t-lg" style={{height: `${Math.random() * 60 + 20}%`}} />)}
                         </div>
                      ) : (
                         <StatusBarChart data={data.dailyStats} />
                      )}
                    </div>
                 </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;