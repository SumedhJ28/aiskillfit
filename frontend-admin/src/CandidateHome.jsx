import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Video, Mic, LayoutGrid, ShieldCheck, Languages, Lock, Globe, ChevronLeft, Volume2, CheckCircle2, ShieldAlert, BadgeCheck, Clock, XCircle, Briefcase, Activity } from 'lucide-react';

export default function CandidateHome({ onNavigateToAdmin }) {
  const [step, setStep] = useState('welcome'); // welcome | register | interview | result
  const [language, setLanguage] = useState('english');
  const [candidateId, setCandidateId] = useState(null);
  
  // Register State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [skill, setSkill] = useState('');

  // Interview State
  const [interviewPhase, setInterviewPhase] = useState('idle'); // idle | recording | analyzing | done
  const [recordingTime, setRecordingTime] = useState(0);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  // Handle Camera Access
  useEffect(() => {
    if (step === 'interview') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera/microphone:", err);
          alert("Could not access camera. Please allow camera permissions.");
        });
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const newId = crypto.randomUUID();
    setCandidateId(newId);

    // Try to insert (fire and forget for UI flow)
    supabase.from('candidates').insert([{
      id: newId,
      full_name: fullName,
      phone_number: phone,
      district: district,
      skill: skill
    }]).then();

    setStep('interview');
  };

  const handleStartRecord = () => {
    setInterviewPhase('recording');
    setRecordingTime(0);
    
    // Start simple timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // If we wanted to actually save the file we would use MediaRecorder here
    if (streamRef.current) {
      try {
        const mediaRecorder = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
      } catch (e) {
        console.error("MediaRecorder start failed:", e);
      }
    }
  };

  const handleStopRecord = () => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setInterviewPhase('analyzing');
    
    // Simulate backend processing delay, then save results to DB
    setTimeout(async () => {
      setInterviewPhase('done');
      
      if (candidateId) {
        // Save the AI assessment results to Supabase
        await supabase.from('candidates').update({
          classification: 'Job Ready',
          score: 82,
          fraud_score: 9,
          status: 'completed'
        }).eq('id', candidateId);
      }
    }, 4000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const translations = {
    english: {
      title: "AI SkillFit",
      subtitle: "AI-Powered Video Assessment for Workforce Fitment",
      choose: "Choose Your Language",
      start: "Start Interview",
      admin: "Admin Dashboard",
      // Register
      regTitle: "Candidate Registration",
      fullName: "Full Name",
      phone: "Phone Number",
      district: "Select District",
      distPlaceholder: "Select district",
      trade: "Select Your Trade / Skill",
      continue: "Continue →",
      // Interview
      q1: "Question 1 of 5",
      exp: "EXPERIENCE",
      qText: "Tell me about your work experience. What kind of work have you done before?",
      listen: "Listen to question",
      face: "Face Detected",
      rec: "Recording...",
      analyzing: "Analyzing your response...",
      stt: "Speech → Text",
      lang: "Language Detection",
      nlp: "NLP Analysis",
      fraud: "Fraud Check",
      resRecorded: "Response Recorded",
      rel: "Relevance",
      conf: "Confidence",
      nextQ: "Next Question →",
      tapStart: "Tap to Start Recording",
      tapStop: "Tap to Stop",
      // Results
      resTitle: "Assessment Results",
      ovrScore: "Overall Score",
      class: "Classification",
      jobReady: "Job Ready",
      jobCat: "Job Category",
      blueCollar: "Blue Collar",
      scores: "Scores",
      fraudScore: "Fraud Score",
      intQual: "Interview Quality:",
      good: "Good",
      detSkills: "Detected Skills",
      experience: "Experience",
      aiSum: "AI Summary",
      sumText: "Candidate demonstrates good proficiency in Electrician work. Detected 3 key skills with 3 years of experience. Recommended for immediate placement.",
      done: "Done"
    },
    hindi: {
      title: "AI स्किलफिट",
      subtitle: "कार्यबल उपयुक्तता के लिए AI-संचालित वीडियो मूल्यांकन",
      choose: "अपनी भाषा चुनें",
      start: "साक्षात्कार शुरू करें",
      admin: "एडमिन डैशबोर्ड",
      // Register
      regTitle: "उम्मीदवार पंजीकरण",
      fullName: "पूरा नाम",
      phone: "फ़ोन नंबर",
      district: "ज़िला चुनें",
      distPlaceholder: "ज़िला चुनें",
      trade: "अपना व्यापार / कौशल चुनें",
      continue: "आगे बढ़ें →",
      // Interview
      q1: "5 में से 1 प्रश्न",
      exp: "अनुभव",
      qText: "मुझे अपने काम के अनुभव के बारे में बताएं। आपने पहले किस तरह का काम किया है?",
      listen: "प्रश्न सुनें",
      face: "चेहरा पहचाना गया",
      rec: "रिकॉर्डिंग...",
      analyzing: "आपकी प्रतिक्रिया का विश्लेषण...",
      stt: "भाषण → पाठ",
      lang: "भाषा पहचान",
      nlp: "NLP विश्लेषण",
      fraud: "धोखाधड़ी जांच",
      resRecorded: "प्रतिक्रिया दर्ज की गई",
      rel: "प्रासंगिकता",
      conf: "आत्मविश्वास",
      nextQ: "अगला प्रश्न →",
      tapStart: "रिकॉर्डिंग शुरू करने के लिए टैप करें",
      tapStop: "रोकने के लिए टैप करें",
      // Results
      resTitle: "मूल्यांकन परिणाम",
      ovrScore: "कुल स्कोर",
      class: "वर्गीकरण",
      jobReady: "नौकरी के लिए तैयार",
      jobCat: "नौकरी श्रेणी",
      blueCollar: "ब्लू कॉलर",
      scores: "स्कोर",
      fraudScore: "धोखाधड़ी स्कोर",
      intQual: "साक्षात्कार की गुणवत्ता:",
      good: "अच्छा",
      detSkills: "पहचाने गए कौशल",
      experience: "अनुभव",
      aiSum: "AI सारांश",
      sumText: "उम्मीदवार इलेक्ट्रीशियन के काम में अच्छी दक्षता दिखाता है। 3 साल के अनुभव के साथ 3 प्रमुख कौशल का पता चला। तत्काल नियुक्ति के लिए अनुशंसित।",
      done: "हो गया"
    },
    kannada: {
      title: "AI ಸ್ಕಿಲ್‌ಫಿಟ್",
      subtitle: "ಕಾರ್ಮಿಕ ಸೂಕ್ತತೆಗಾಗಿ AI ಆಧಾರಿತ ವೀಡಿಯೊ ಮೌಲ್ಯಮಾಪನ",
      choose: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      start: "ಸಂದರ್ಶನ ಪ್ರಾರಂಭಿಸಿ",
      admin: "ನಿರ್ವಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      // Register
      regTitle: "ಅಭ್ಯರ್ಥಿ ನೋಂದಣಿ",
      fullName: "ಪೂರ್ಣ ಹೆಸರು",
      phone: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
      district: "ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      distPlaceholder: "ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      trade: "ನಿಮ್ಮ ಕೌಶಲ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      continue: "ಮುಂದುವರಿಯಿರಿ →",
      // Interview
      q1: "5 ರಲ್ಲಿ 1 ನೇ ಪ್ರಶ್ನೆ",
      exp: "ಅನುಭವ",
      qText: "ನಿಮ್ಮ ಕೆಲಸದ ಅನುಭವದ ಬಗ್ಗೆ ಹೇಳಿ. ನೀವು ಮೊದಲು ಯಾವ ರೀತಿಯ ಕೆಲಸ ಮಾಡಿದ್ದೀರಿ?",
      listen: "ಪ್ರಶ್ನೆಯನ್ನು ಆಲಿಸಿ",
      face: "ಮುಖ ಪತ್ತೆಯಾಗಿದೆ",
      rec: "ರೆಕಾರ್ಡಿಂಗ್...",
      analyzing: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
      stt: "ಮಾತು → ಪಠ್ಯ",
      lang: "ಭಾಷೆ ಪತ್ತೆ",
      nlp: "NLP ವಿಶ್ಲೇಷಣೆ",
      fraud: "ವಂಚನೆ ತಪಾಸಣೆ",
      resRecorded: "ಪ್ರತಿಕ್ರಿಯೆ ದಾಖಲಿಸಲಾಗಿದೆ",
      rel: "ಪ್ರಸ್ತುತತೆ",
      conf: "ಆತ್ಮವಿಶ್ವಾಸ",
      nextQ: "ಮುಂದಿನ ಪ್ರಶ್ನೆ →",
      tapStart: "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
      tapStop: "ನಿಲ್ಲಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
      // Results
      resTitle: "ಮೌಲ್ಯಮಾಪನ ಫಲಿತಾಂಶಗಳು",
      ovrScore: "ಒಟ್ಟು ಸ್ಕೋರ್",
      class: "ವರ್ಗೀಕರಣ",
      jobReady: "ಉದ್ಯೋಗಕ್ಕೆ ಸಿದ್ಧ",
      jobCat: "ಉದ್ಯೋಗ ವರ್ಗ",
      blueCollar: "ಬ್ಲೂ ಕಾಲರ್",
      scores: "ಸ್ಕೋರ್‌ಗಳು",
      fraudScore: "ವಂಚನೆ ಸ್ಕೋರ್",
      intQual: "ಸಂದರ್ಶನದ ಗುಣಮಟ್ಟ:",
      good: "ಉತ್ತಮ",
      detSkills: "ಪತ್ತೆಯಾದ ಕೌಶಲ್ಯಗಳು",
      experience: "ಅನುಭವ",
      aiSum: "AI ಸಾರಾಂಶ",
      sumText: "ಅಭ್ಯರ್ಥಿಯು ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ ಕೆಲಸದಲ್ಲಿ ಉತ್ತಮ ಪ್ರಾವೀಣ್ಯತೆಯನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತಾನೆ. 3 ವರ್ಷಗಳ ಅನುಭವದೊಂದಿಗೆ 3 ಪ್ರಮುಖ ಕೌಶಲ್ಯಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗಿದೆ. ತಕ್ಷಣದ ನಿಯೋಜನೆಗೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.",
      done: "ಮುಗಿದಿದೆ"
    }
  };

  const t = translations[language];

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-sm flex flex-col items-center z-10">
          <div className="w-20 h-20 bg-[#1e293b] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.2)] border border-white/5">
            <Video className="w-8 h-8 text-blue-500" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-white">{t.title}</h1>
            <p className="text-slate-400 text-sm max-w-[280px] mx-auto leading-relaxed">{t.subtitle}</p>
          </div>

          <div className="w-full mb-8">
            <p className="text-center text-slate-300 text-sm font-medium mb-4">{t.choose}</p>
            <div className="flex gap-3 justify-center">
              {['kannada', 'hindi', 'english'].map((l) => (
                <button key={l} onClick={() => setLanguage(l)}
                  className={`relative flex flex-col items-center justify-center w-[100px] h-[110px] rounded-2xl transition-all duration-300 ${
                    language === l ? `bg-[#1e293b] border-2 shadow-lg ${l === 'kannada' ? 'border-orange-500 shadow-orange-500/20' : l === 'hindi' ? 'border-emerald-500 shadow-emerald-500/20' : 'border-blue-500 shadow-blue-500/20'}` 
                    : 'bg-[#1e293b] border-2 border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {language === l && (
                    <div className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center ${l === 'kannada' ? 'bg-orange-500' : l === 'hindi' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                      <CheckIcon />
                    </div>
                  )}
                  {l === 'english' ? <Globe className={`w-5 h-5 mb-2 ${language === l ? 'text-blue-500' : 'text-slate-400'}`} /> : <span className="text-slate-400 font-bold text-sm mb-2">IN</span>}
                  <span className={`font-bold text-xl mb-1 ${language === l ? (l === 'kannada' ? 'text-orange-500' : l === 'hindi' ? 'text-emerald-500' : 'text-blue-500') : 'text-white'}`}>
                    {l === 'kannada' ? 'ಕನ್ನಡ' : l === 'hindi' ? 'हिन्दी' : 'English'}
                  </span>
                  <span className="text-slate-500 text-[10px] capitalize">{l === 'kannada' ? 'Kannada' : l === 'hindi' ? 'Hindi' : 'ಇಂಗ್ಲಿಷ್'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full space-y-3">
            <button onClick={() => setStep('register')} className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Mic size={18} /> {t.start}
            </button>
            <button onClick={onNavigateToAdmin} className="w-full py-4 rounded-xl bg-[#1e293b] text-slate-300 font-bold flex items-center justify-center gap-2 border border-slate-700">
              <LayoutGrid size={18} /> {t.admin}
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-emerald-500" /><span className="text-slate-500 text-xs">AI Verified</span></div>
            <div className="flex items-center gap-1.5"><Languages className="w-3 h-3 text-blue-500" /><span className="text-slate-500 text-xs">Multilingual</span></div>
            <div className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-amber-500" /><span className="text-slate-500 text-xs">Fraud Safe</span></div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'register') {
    const trades = ['Electrician', 'Plumber', 'Welder', 'Carpenter', 'Painter', 'Driver', 'Mason', 'Fitter', 'Mechanic', 'Tailor', 'Cook', 'Security Guard', 'Construction Worker', 'Agricultural Worker'];
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex justify-center font-sans">
        <div className="w-full max-w-md bg-[#1e293b] min-h-screen shadow-2xl relative flex flex-col">
          <header className="flex items-center gap-3 p-5 border-b border-slate-700">
            <button onClick={() => setStep('welcome')}><ChevronLeft className="text-slate-400" /></button>
            <h1 className="text-lg font-bold">{t.regTitle}</h1>
          </header>
          
          <form onSubmit={handleRegister} className="flex-1 p-5 flex flex-col gap-5 overflow-y-auto pb-24">
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">{t.fullName}</label>
              <input required value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your full name" className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">{t.phone}</label>
              <input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="9876543210" className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">{t.district}</label>
              <select required value={district} onChange={e=>setDistrict(e.target.value)} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 appearance-none text-slate-300">
                <option value="">{t.distPlaceholder}</option>
                <option value="Bengaluru Urban">Bengaluru Urban</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Tumakuru">Tumakuru</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium mb-3 block">{t.trade}</label>
              <div className="flex flex-wrap gap-2">
                {trades.map(tr => (
                  <button type="button" key={tr} onClick={() => setSkill(tr)} className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${skill === tr ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#0f172a] border-slate-700 text-slate-300 hover:border-slate-500'}`}>
                    ⚡ {tr}
                  </button>
                ))}
              </div>
            </div>
          </form>

          <div className="absolute bottom-0 w-full p-5 bg-[#1e293b] border-t border-slate-700">
            <button onClick={handleRegister} disabled={!fullName || !phone || !district || !skill} className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              {t.continue}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'interview') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex justify-center font-sans">
        <div className="w-full max-w-md bg-[#1e293b] min-h-screen shadow-2xl flex flex-col relative">
          <div className="p-5 text-sm text-slate-400 font-medium">{t.q1}</div>
          
          <div className="flex-1 flex flex-col px-5 pb-10">
            {/* Live Camera View (always rendered, sometimes hidden) */}
            <div className={`mt-4 w-full aspect-[3/4] bg-[#0f172a] rounded-2xl border ${interviewPhase === 'recording' ? 'border-red-500/50' : 'border-slate-700/50'} relative overflow-hidden transition-all shadow-xl ${interviewPhase === 'done' || interviewPhase === 'analyzing' ? 'hidden' : 'block'}`}>
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover mirror"
                style={{ transform: 'scaleX(-1)' }}
              />
              
              {/* Overlays */}
              {interviewPhase === 'recording' && (
                <div className="absolute top-4 left-4 bg-red-500 text-[10px] font-bold px-2 py-0.5 rounded text-white flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> REC
                </div>
              )}
              
              <div className="absolute bottom-4 left-0 w-full flex justify-center">
                <span className="bg-slate-900/60 backdrop-blur px-3 py-1 rounded-full text-green-400 text-[10px] font-bold border border-green-500/30 flex items-center gap-1">
                  <CheckCircle2 size={12} /> {t.face}
                </span>
              </div>
            </div>

            {/* Top Prompt */}
            {interviewPhase === 'idle' && (
              <div className="mt-6 text-center">
                <div className="inline-flex px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold tracking-wider mb-4 border border-blue-500/20">
                  <Mic className="w-3 h-3 inline mr-1" /> {t.exp}
                </div>
                <h2 className="text-xl font-bold leading-tight mb-4 text-left">
                  {t.qText}
                </h2>
                <button className="text-orange-500 text-sm font-medium flex items-center gap-2">
                  <Volume2 size={16} /> {t.listen}
                </button>
              </div>
            )}

            {/* Recording Info */}
            {interviewPhase === 'recording' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-red-400 font-medium animate-pulse">
                <div className="w-2 h-2 bg-red-500 rounded-full" /> {t.rec} {formatTime(recordingTime)}
              </div>
            )}

            {/* Analyzing View */}
            {interviewPhase === 'analyzing' && (
              <div className="mt-16 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full border border-blue-500/30 flex items-center justify-center mb-6 relative">
                  <div className="absolute w-full h-full border-t-2 border-blue-500 rounded-full animate-spin" />
                  <Activity className="text-blue-400" />
                </div>
                <h3 className="text-lg font-bold mb-8">{t.analyzing}</h3>
                <div className="space-y-3 w-full max-w-[200px] text-left">
                  <div className="flex items-center gap-2 text-sm text-green-400"><CheckCircle2 size={16} /> {t.stt}</div>
                  <div className="flex items-center gap-2 text-sm text-green-400"><CheckCircle2 size={16} /> {t.lang}</div>
                  <div className="flex items-center gap-2 text-sm text-green-400"><CheckCircle2 size={16} /> {t.nlp}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-500"><div className="w-4 h-4 rounded-full border border-slate-500" /> {t.fraud}</div>
                </div>
              </div>
            )}

            {/* Done View */}
            {interviewPhase === 'done' && (
              <div className="mt-16 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full border border-green-500 flex items-center justify-center mb-6">
                  <CheckCircle2 className="text-green-500 w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-green-400 mb-8">{t.resRecorded}</h3>
                <div className="w-full bg-[#0f172a] rounded-xl p-4 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{t.rel}</span>
                    <span className="font-bold">66%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{t.conf}</span>
                    <span className="font-bold">89%</span>
                  </div>
                  <div className="flex gap-2 mt-4 justify-center">
                    <span className="px-2 py-1 bg-slate-800 rounded text-xs text-blue-400 border border-blue-900">wiring</span>
                    <span className="px-2 py-1 bg-slate-800 rounded text-xs text-blue-400 border border-blue-900">motor repair</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex-1" />

            {/* Bottom Actions */}
            {interviewPhase === 'idle' && (
              <button onClick={handleStartRecord} className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <Mic size={24} className="text-white" />
              </button>
            )}
            {interviewPhase === 'recording' && (
              <button onClick={handleStopRecord} className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <div className="w-6 h-6 bg-white rounded-sm" />
              </button>
            )}
            {interviewPhase === 'done' && (
              <button onClick={() => setStep('result')} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                {t.nextQ}
              </button>
            )}
            
            {interviewPhase !== 'done' && (
              <p className="text-center text-slate-500 text-xs mt-4">
                {interviewPhase === 'idle' ? t.tapStart : interviewPhase === 'recording' ? t.tapStop : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex justify-center font-sans">
        <div className="w-full max-w-md bg-[#1e293b] min-h-screen shadow-2xl flex flex-col p-5 overflow-y-auto">
          <header className="flex justify-between items-center mb-8">
            <button onClick={() => setStep('welcome')}><XCircle size={20} className="text-slate-400" /></button>
            <h1 className="font-bold">{t.resTitle}</h1>
            <div className="w-5" />
          </header>

          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center mb-4 relative shadow-[0_0_30px_rgba(37,99,235,0.2)]">
              <div className="text-4xl font-black">82.81<span className="text-sm text-slate-400 font-normal">/100</span></div>
            </div>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">{t.ovrScore}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#0f172a] border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-500 font-bold mb-2 tracking-wider uppercase">{t.class}</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> {t.jobReady}
              </span>
            </div>
            <div className="bg-[#0f172a] border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-500 font-bold mb-2 tracking-wider uppercase">{t.jobCat}</span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold flex items-center gap-1">
                <Briefcase size={12} /> {t.blueCollar}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-sm mb-4">{t.scores}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mic size={14} className="text-blue-400" /> <span className="w-24 text-slate-400">{t.conf}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[90%]" /></div>
                <span className="font-bold text-xs w-8 text-right">90%</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-emerald-400 font-bold w-3">?</span> <span className="w-24 text-slate-400">{t.rel}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[94%]" /></div>
                <span className="font-bold text-xs w-8 text-right">94%</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldAlert size={14} className="text-red-400" /> <span className="w-24 text-slate-400">{t.fraudScore}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[9%]" /></div>
                <span className="font-bold text-xs w-8 text-right">9%</span>
              </div>
              <div className="flex items-center gap-3 text-sm pt-2">
                <span className="text-amber-500">★</span> <span className="text-slate-400">{t.intQual}</span> <span className="text-green-400 font-bold">{t.good}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-sm mb-4">{t.detSkills}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-[#0f172a] border border-green-500/30 text-green-400 rounded-full text-xs font-medium">✓ wiring</span>
              <span className="px-3 py-1 bg-[#0f172a] border border-green-500/30 text-green-400 rounded-full text-xs font-medium">✓ motor repair</span>
              <span className="px-3 py-1 bg-[#0f172a] border border-green-500/30 text-green-400 rounded-full text-xs font-medium">✓ circuit testing</span>
            </div>
            <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-lg flex justify-between items-center text-sm">
              <span className="text-slate-400 flex items-center gap-2"><Clock size={14} className="text-orange-400" /> {t.experience}</span>
              <span className="font-bold text-orange-400">3 years</span>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="font-bold text-sm mb-4">{t.aiSum}</h3>
            <div className="bg-[#0f172a] border border-slate-700 p-4 rounded-xl text-sm leading-relaxed text-slate-300 flex items-start gap-3">
              <BadgeCheck className="text-blue-500 shrink-0 mt-0.5" size={18} />
              <p>{t.sumText}</p>
            </div>
          </div>

          <button onClick={() => setStep('welcome')} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            {t.done}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
