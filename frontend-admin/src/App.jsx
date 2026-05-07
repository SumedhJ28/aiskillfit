import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './Login';
import CandidateHome from './CandidateHome';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [view, setView] = useState('candidate'); // 'candidate' | 'admin'
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setLoading(true);
        setSession(session);
        fetchRole(session.user.id);
      } else {
        setSession(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (data) {
        setRole(data.role);
      } else {
        setRole('candidate'); // default if not found
      }
    } catch (err) {
      console.error("Error fetching role", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session && role === 'admin') {
      fetchRealCandidates();
    }
  }, [session, role]);

  const fetchRealCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data) {
        setCandidates(data.map(c => ({
          id: c.id,
          name: c.full_name || 'Unknown',
          trade: c.skill || 'Unspecified',
          district: c.district || 'Unspecified',
          classification: c.classification || 'Pending Review',
          score: c.score || 0,
          status: c.status || 'pending',
          fraudScore: c.fraud_score || 0
        })));
      }
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('candidate');
  };

  // Public Candidate Flow (No Auth Required)
  if (view === 'candidate') {
    return <CandidateHome onNavigateToAdmin={() => setView('admin')} />;
  }

  // Protected Admin Flow
  if (loading) {
    return <div className="flex h-screen bg-slate-900 items-center justify-center text-white">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="relative">
        <button 
          onClick={() => setView('candidate')}
          className="absolute top-4 left-4 z-50 text-slate-400 hover:text-white flex items-center gap-2"
        >
          ← Back to App
        </button>
        <Login onLogin={setSession} />
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="flex flex-col h-screen bg-slate-900 items-center justify-center text-white p-8">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h2>
        <p className="text-slate-400 mb-6 text-center max-w-md">
          You are successfully logged in, but your account does not have the "admin" role in the database.
        </p>
        
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-md mb-8 shadow-xl">
          <p className="text-sm font-bold text-slate-300 mb-2">Your Current User ID:</p>
          <code className="block bg-[#0f172a] p-3 rounded text-blue-400 text-sm break-all font-mono select-all">
            {session.user.id}
          </code>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            To fix this, run this query in your Supabase SQL Editor:<br/><br/>
            <span className="text-green-400 font-mono">
              INSERT INTO profiles (id, role) VALUES ('{session.user.id}', 'admin');
            </span>
          </p>
        </div>

        <button 
          onClick={handleLogout}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold shadow-lg shadow-blue-500/20"
        >
          Sign Out & Return Home
        </button>
      </div>
    );
  }

  return <AdminDashboard session={session} candidates={candidates} handleLogout={handleLogout} />;
}
