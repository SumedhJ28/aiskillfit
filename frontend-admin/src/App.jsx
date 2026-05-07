import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, ShieldAlert, Activity, Search, Filter, PlayCircle, CheckCircle, XCircle } from 'lucide-react';

export default function App() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Mock fetch from backend
    setCandidates([
      { id: 'c1', name: 'Ramesh K.', trade: 'Electrician', district: 'Bengaluru Urban', classification: 'Job Ready', score: 85, status: 'pending', fraudScore: 5 },
      { id: 'c2', name: 'Suresh P.', trade: 'Plumber', district: 'Mysuru', classification: 'Needs Training', score: 45, status: 'pending', fraudScore: 12 },
      { id: 'c3', name: 'Unknown User', trade: 'Welder', district: 'Tumakuru', classification: 'Suspected Fraud', score: 10, status: 'flagged', fraudScore: 95 }
    ]);
  }, []);

  const getStatusColor = (classification) => {
    switch(classification) {
      case 'Job Ready': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Needs Training': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Suspected Fraud': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 p-4">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Activity size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">AI SkillFit</h1>
        </div>
        
        <nav className="space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Users size={20} />} label="Candidates" />
          <NavItem icon={<ShieldAlert size={20} />} label="Fraud Alerts" badge="3" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between px-8">
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
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Candidates" value="1,248" trend="+12%" />
            <StatCard label="Job Ready" value="842" color="text-green-400" />
            <StatCard label="Needs Training" value="315" color="text-yellow-400" />
            <StatCard label="Fraud Flagged" value="91" color="text-red-400" />
          </div>

          {/* Table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Candidate</th>
                  <th className="p-4 font-medium">Trade & Location</th>
                  <th className="p-4 font-medium">AI Classification</th>
                  <th className="p-4 font-medium">Scores</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {candidates.map(c => (
                  <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                            <PlayCircle size={20} className="text-white opacity-0 group-hover:opacity-100 absolute z-10 transition-opacity" />
                            <div className="w-full h-full bg-slate-600 group-hover:opacity-50 transition-opacity" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{c.name}</div>
                          <div className="text-xs text-slate-500">ID: {c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-300">{c.trade}</div>
                      <div className="text-xs text-slate-500">{c.district}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(c.classification)}`}>
                        {c.classification}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs">Overall</div>
                          <div className={c.score > 70 ? 'text-green-400' : 'text-yellow-400'}>{c.score}%</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs">Fraud Risk</div>
                          <div className={c.fraudScore > 50 ? 'text-red-400' : 'text-slate-300'}>{c.fraudScore}%</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-1.5 text-green-400 hover:bg-green-400/10 rounded transition-colors" title="Approve">
                          <CheckCircle size={18} />
                        </button>
                        <button className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Reject">
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
    <div className="text-slate-400 text-sm mb-2">{label}</div>
    <div className="flex items-end justify-between">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      {trend && <div className="text-green-400 text-sm font-medium">{trend}</div>}
    </div>
  </div>
);
