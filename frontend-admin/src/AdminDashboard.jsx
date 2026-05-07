import React from 'react';
import { LayoutDashboard, Users, ShieldAlert, Activity, Search, Filter, PlayCircle, CheckCircle, XCircle, LogOut } from 'lucide-react';

export default function AdminDashboard({ session, candidates, handleLogout }) {
  const getStatusColor = (classification) => {
    switch(classification) {
      case 'Job Ready': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Needs Training': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Suspected Fraud': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-900 text-slate-200 font-sans">
      {/* Sidebar - hidden on mobile, visible on md screens */}
      <div className="hidden md:flex w-64 bg-slate-800 border-r border-slate-700 p-4 flex-col shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Activity size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">AI SkillFit</h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Users size={20} />} label="Candidates" />
          <NavItem icon={<ShieldAlert size={20} />} label="Fraud Alerts" badge="3" />
        </nav>

        <div className="border-t border-slate-700 pt-4 mt-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header (visible only on small screens) */}
        <header className="md:hidden h-16 border-b border-slate-700 bg-slate-800 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-blue-500" />
            <h1 className="font-bold text-white">AI SkillFit</h1>
          </div>
          <button onClick={handleLogout} className="text-sm font-medium text-red-400">Sign Out</button>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-16 border-b border-slate-700 bg-slate-800/50 items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-semibold text-white">Candidate Review</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                className="bg-slate-900 border border-slate-700 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full border border-slate-700">
              <Filter size={16} />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white border border-blue-500">
              {session?.user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {/* Mobile Search - only visible on small screens */}
          <div className="md:hidden mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              className="bg-slate-800 border border-slate-700 rounded-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 w-full"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard label="Total Candidates" value="1,248" trend="+12%" />
            <StatCard label="Job Ready" value="842" color="text-green-400" />
            <StatCard label="Needs Training" value="315" color="text-yellow-400" />
            <StatCard label="Fraud Flagged" value="91" color="text-red-400" />
          </div>

          {/* Table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-xs md:text-sm uppercase tracking-wider bg-slate-800/50">
                    <th className="p-3 md:p-4 font-medium whitespace-nowrap">Candidate</th>
                    <th className="p-3 md:p-4 font-medium whitespace-nowrap">Trade & Location</th>
                    <th className="p-3 md:p-4 font-medium whitespace-nowrap">AI Classification</th>
                    <th className="p-3 md:p-4 font-medium whitespace-nowrap">Scores</th>
                    <th className="p-3 md:p-4 font-medium whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {candidates.map(c => (
                    <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-3 md:p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-slate-700 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                              <PlayCircle size={20} className="text-white opacity-0 group-hover:opacity-100 absolute z-10 transition-opacity" />
                              <div className="w-full h-full bg-slate-600 group-hover:opacity-50 transition-opacity" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-white truncate text-sm md:text-base">{c.name}</div>
                            <div className="text-[10px] md:text-xs text-slate-500 truncate w-32 md:w-48">ID: {c.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 md:p-4">
                        <div className="text-sm text-slate-300 truncate">{c.trade}</div>
                        <div className="text-xs text-slate-500 truncate">{c.district}</div>
                      </td>
                      <td className="p-3 md:p-4">
                        <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium border whitespace-nowrap ${getStatusColor(c.classification)}`}>
                          {c.classification}
                        </span>
                      </td>
                      <td className="p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm">
                          <div>
                            <div className="text-slate-500 text-[10px] md:text-xs">Overall</div>
                            <div className={`font-medium ${c.score > 70 ? 'text-green-400' : 'text-yellow-400'}`}>{c.score}%</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-[10px] md:text-xs">Fraud Risk</div>
                            <div className={`font-medium ${c.fraudScore > 50 ? 'text-red-400' : 'text-slate-300'}`}>{c.fraudScore}%</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 md:p-4">
                        <div className="flex gap-1 md:gap-2">
                          <button className="p-1 md:p-1.5 text-green-400 hover:bg-green-400/10 rounded transition-colors" title="Approve">
                            <CheckCircle size={18} />
                          </button>
                          <button className="p-1 md:p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Reject">
                            <XCircle size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const NavItem = ({ icon, label, active, badge }) => (
  <a href="#" className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${active ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
    {badge && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
  </a>
);

const StatCard = ({ label, value, trend, color = "text-white" }) => (
  <div className="bg-slate-800 p-4 md:p-6 rounded-xl border border-slate-700">
    <div className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">{label}</div>
    <div className="flex items-end justify-between">
      <div className={`text-xl md:text-3xl font-bold ${color}`}>{value}</div>
      {trend && <div className="text-green-400 text-xs md:text-sm font-medium">{trend}</div>}
    </div>
  </div>
);
