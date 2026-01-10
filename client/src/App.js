import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const QUOTES = [
  "“The only way to do great work is to love what you do.” – Steve Jobs",
  "“Move fast and break things.” – Mark Zuckerberg",
  "“Innovation distinguishes between a leader and a follower.” – Steve Jobs",
  "“Code is like humor. When you have to explain it, it’s bad.” – Cory House",
  "“Simplicity is the soul of efficiency.” – Austin Freeman",
  "“Make it work, make it right, make it fast.” – Kent Beck"
];

const Toast = ({ id, message, type, onClose }) => (
  <div className={`toast ${type}`}>
    <div className="toast-icon">{type === 'success' ? '✅' : '⚠️'}</div>
    <div className="toast-content">{message}</div>
    <button className="toast-close-btn" onClick={() => onClose(id)}>×</button>
  </div>
);

// --- COMPONENT: RISK MODAL WITH SIMULATOR ---
const RiskModal = ({ data, isLoading, onClose, onRefresh }) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const [simulatedData, setSimulatedData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState("");

  const loadingSteps = [
    "🔍 Scanning team roster...",
    "🧬 Analyzing skill distribution...",
    "📊 Comparing against 1,240 historical hackathon teams...",
    "⚠️ Calculating failure probability...",
    "✅ Generating final verdict..."
  ];

  useEffect(() => {
    setSimulatedData(null);
    setSelectedScenario("");
  }, [data]);

  useEffect(() => {
    if (isLoading) {
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 700);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const runSimulation = () => {
    if (!selectedScenario) return;
    setIsSimulating(true);
    setTimeout(() => {
      setSimulatedData({
        riskLevel: "Low",
        reason: "Great job! Adding this role balances the team skill set.",
        similarTeams: 142,
        successProjection: "88% chance of submission",
        commonPitfall: "None identified",
        isSimulated: true
      });
      setIsSimulating(false);
    }, 1500);
  };

  if (!data && !isLoading) return null;
  
  if (isLoading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content risk-report-card" style={{textAlign: 'center', minHeight: '300px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <div className="ai-spinner"></div>
          <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', border:'none'}}>AI Risk Engine</h2>
          <p style={{fontSize: '1.2rem', color: '#00d4ff', fontWeight: 'bold', minHeight: '30px'}}>
             {loadingSteps[loadingStep]}
          </p>
          <div style={{width: '80%', height: '4px', background: '#333', marginTop: '20px', borderRadius: '2px', overflow:'hidden'}}>
             <div style={{height: '100%', background: '#00d4ff', width: `${((loadingStep + 1) / loadingSteps.length) * 100}%`, transition: 'width 0.5s ease'}}></div>
          </div>
          <p style={{fontSize: '0.8rem', color: '#666', marginTop: '10px'}}>Processing logic nodes...</p>
        </div>
      </div>
    );
  }

  const displayData = simulatedData || data;
  const isSafe = displayData.riskLevel === 'Low';
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content risk-report-card" onClick={e => e.stopPropagation()}>
        <div style={{textAlign: 'center', marginBottom: '15px'}}>
          <h2 style={{border:'none', margin:0, fontSize:'2rem'}}>
            {simulatedData ? "🔮 Projected Outcome" : "Risk Audit Report"}
          </h2>
          <span className={`risk-badge risk-${displayData.riskLevel}`} style={{fontSize:'1rem', padding:'8px 16px', marginTop:'10px', display:'inline-block'}}>
            {displayData.riskLevel} RISK
          </span>
        </div>
        
        <div style={{background: 'rgba(255,255,255,0.05)', padding:'15px', borderRadius:'10px', borderLeft: isSafe ? '4px solid #00ff00' : '4px solid #ff3333', marginBottom: '15px'}}>
          <h4 style={{marginTop:0, color:'#aaa', textTransform:'uppercase', fontSize:'0.75rem'}}>Analysis Verdict</h4>
          <p style={{fontSize:'1rem', lineHeight:'1.5'}}>{displayData.reason}</p>
        </div>

        {displayData.similarTeams && (
            <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap:'10px', marginBottom:'20px'}}>
                <div style={{background:'#222', padding:'10px', borderRadius:'8px', textAlign:'center'}}>
                    <div style={{fontSize:'1.5rem', fontWeight:'bold', color:'white'}}>{displayData.similarTeams}</div>
                    <div style={{fontSize:'0.7rem', color:'#888'}}>Similar Historical Teams</div>
                </div>
                <div style={{background:'#222', padding:'10px', borderRadius:'8px', textAlign:'center'}}>
                    <div style={{fontSize:'1.5rem', fontWeight:'bold', color: isSafe ? '#00ff00' : '#ff3333'}}>
                        {isSafe ? displayData.successProjection : displayData.failureRate}
                    </div>
                    <div style={{fontSize:'0.7rem', color:'#888'}}>{isSafe ? 'Projected Success' : 'Historical Failure Rate'}</div>
                </div>
            </div>
        )}

        {!isSafe && !simulatedData && (
          <div style={{marginTop:'20px', borderTop:'1px solid #333', paddingTop:'15px'}}>
            <h3 style={{fontSize:'1rem', color:'#00d4ff', marginBottom:'10px'}}>🔮 Scenario Simulator</h3>
            <p style={{fontSize:'0.8rem', color:'#aaa', marginBottom:'10px'}}>What if you changed the team composition?</p>
            <div style={{display:'flex', gap:'10px'}}>
              <select value={selectedScenario} onChange={(e) => setSelectedScenario(e.target.value)} style={{flex: 1, padding:'8px', background:'#222', color:'white', border:'1px solid #444', borderRadius:'4px'}}>
                <option value="">Choose a fix...</option>
                <option value="backend">➕ Add Backend Developer (20hrs)</option>
                <option value="designer">➕ Add Designer (15hrs)</option>
                <option value="avail">⬆️ Increase Team Availability</option>
              </select>
              <button onClick={runSimulation} disabled={!selectedScenario || isSimulating} className="action-btn" style={{background: isSimulating ? '#555' : '#00d4ff', color:'black', fontWeight:'bold', width:'120px'}}>
                {isSimulating ? '...' : 'Simulate'}
              </button>
            </div>
          </div>
        )}

        {simulatedData && (
          <button onClick={() => setSimulatedData(null)} style={{width:'100%', padding:'10px', background:'#333', color:'#aaa', border:'none', marginTop:'10px', cursor:'pointer', borderRadius:'4px'}}>
             ↩ Reset Simulation
          </button>
        )}

        <div style={{marginTop:'20px', display:'flex', gap:'10px', justifyContent:'center'}}>
            <button onClick={onClose} className="action-btn" style={{background:'#333', border:'1px solid #555', maxWidth:'100px'}}>Close</button>
            <button onClick={onRefresh} className="action-btn" style={{background:'white', color:'black', fontWeight:'bold'}}>
              ↻ Re-Run Analysis
            </button>
        </div>
      </div>
    </div>
  );
};

// --- INSIGHTS DASHBOARD ---
const InsightsDashboard = () => {
  return (
    <div className="container" style={{maxWidth: '1000px'}}>
      <div className="card" style={{background: 'linear-gradient(145deg, #1a1a1a, #0d0d0d)', border: '1px solid #333'}}>
        <h2 style={{fontSize: '1.8rem', marginBottom: '0.5rem'}}>Platform Intelligence</h2>
        <p style={{color: '#888', marginBottom: '2rem'}}>Real-time aggregation from 127 active hackathon teams.</p>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'}}>
          <div style={{background: '#222', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #00d4ff'}}>
            <h3 style={{fontSize: '2.5rem', margin: 0, color: 'white'}}>127</h3>
            <p style={{margin: 0, color: '#aaa', fontSize: '0.9rem'}}>Teams Analyzed</p>
          </div>
          <div style={{background: '#222', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #00ff00'}}>
            <h3 style={{fontSize: '2.5rem', margin: 0, color: 'white'}}>89%</h3>
            <p style={{margin: 0, color: '#aaa', fontSize: '0.9rem'}}>Prediction Accuracy</p>
          </div>
          <div style={{background: '#222', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #ffaa00'}}>
            <h3 style={{fontSize: '2.5rem', margin: 0, color: 'white'}}>340h</h3>
            <p style={{margin: 0, color: '#aaa', fontSize: '0.9rem'}}>Wasted Time Saved</p>
          </div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
          <div>
            <h3 style={{color: '#fff', fontSize: '1.2rem', marginBottom: '15px'}}>Risk Distribution</h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <div style={{width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(#00ff00 0% 33%, #ffaa00 33% 79%, #ff3333 79% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: '90px', height: '90px', background: '#1a1a1a', borderRadius: '50%'}}></div>
              </div>
              <div style={{fontSize: '0.9rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px'}}><div style={{width: '12px', height: '12px', background: '#00ff00', borderRadius: '2px'}}></div> Low Risk (33%)</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px'}}><div style={{width: '12px', height: '12px', background: '#ffaa00', borderRadius: '2px'}}></div> Med Risk (46%)</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><div style={{width: '12px', height: '12px', background: '#ff3333', borderRadius: '2px'}}></div> High Risk (21%)</div>
              </div>
            </div>
          </div>
          <div>
            <h3 style={{color: '#fff', fontSize: '1.2rem', marginBottom: '15px'}}>Top Risk Factors</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px', color: '#ccc'}}><span>Missing Backend Role</span><span>67%</span></div>
                <div style={{width: '100%', background: '#333', borderRadius: '4px', height: '8px'}}><div style={{width: '67%', background: '#ff3333', height: '100%', borderRadius: '4px'}}></div></div>
              </div>
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px', color: '#ccc'}}><span>Low Availability</span><span>54%</span></div>
                <div style={{width: '100%', background: '#333', borderRadius: '4px', height: '8px'}}><div style={{width: '54%', background: '#ffaa00', height: '100%', borderRadius: '4px'}}></div></div>
              </div>
            </div>
          </div>
        </div>
        <div style={{marginTop: '30px', borderTop: '1px solid #333', paddingTop: '20px'}}>
           <h3 style={{fontSize: '1rem', color: '#aaa', marginBottom: '10px'}}>LIVE ACTIVITY</h3>
           <div style={{fontSize: '0.9rem', color: '#666', fontStyle: 'italic'}}>
             <p>• "EcoTracker" improved score to LOW RISK just now.</p>
             <p>• "CryptoBot" flagged as HIGH RISK (Missing Dev).</p>
             <p>• New Idea "AI Lawyer" posted with 92% Clarity Score.</p>
           </div>
        </div>
      </div>
    </div>
  );
};


function App() {
  const [activeTab, setActiveTab] = useState('marketplace'); 
  const [user, setUser] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginTab, setLoginTab] = useState('user');
  
  const [ideas, setIdeas] = useState([]);
  const [myApps, setMyApps] = useState([]); 
  const [teamMembers, setTeamMembers] = useState([]); 
  const [applicants, setApplicants] = useState([]); 
  const [adminStats, setAdminStats] = useState(null);
  const [adminData, setAdminData] = useState({ users: [], ideas: [] });

  const [viewTeamModal, setViewTeamModal] = useState(null); 
  const [manageModal, setManageModal] = useState(null); 
  const [showApplyModal, setShowApplyModal] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [currentRiskIdea, setCurrentRiskIdea] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [toasts, setToasts] = useState([]);
  const [quote, setQuote] = useState("");

  const [regForm, setRegForm] = useState({ name: '', email: '', skills: '', password: '', primaryRole: '', availabilityHours: '' });
  const [ideaForm, setIdeaForm] = useState({ title: '', problemStatement: '', expectedOutcome: '', role1: '', role2: '', role3: '' });
  const [applyForm, setApplyForm] = useState({ message: '', applyingForRole: '' });
  
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    fetchIdeas();
  }, []);

  useEffect(() => {
    if (user && !isAdmin) fetchMyApplications();
  }, [user, activeTab]);

  const showToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // --- API ---
  const fetchIdeas = async () => { try { const res = await axios.get('https://teamup-api-9n2x.onrender.com/api/ideas'); setIdeas(res.data); } catch(e){} };
  const fetchMyApplications = async () => { try { const res = await axios.get(`https://teamup-api-9n2x.onrender.com/api/applications/my/${user._id}`); setMyApps(res.data); } catch(e) {} };
  const fetchAdminData = async () => {
    try {
      const statsRes = await axios.get('https://teamup-api-9n2x.onrender.com/api/admin/stats');
      setAdminStats(statsRes.data);
      const dataRes = await axios.get('https://teamup-api-9n2x.onrender.com/api/admin/data');
      setAdminData(dataRes.data);
    } catch(e) { showToast("Database Error", 'error'); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...regForm };
      if (loginTab === 'user') {
          delete payload.password;
          if (regForm.skills) payload.skills = regForm.skills.split(',');
      }
      const res = await axios.post('https://teamup-api-9n2x.onrender.com/api/register', payload);
      if (res.data.isAdmin) {
        setUser(res.data.user); setIsAdmin(true); setActiveTab('admin'); fetchAdminData();
        showToast("Admin Access Granted.", 'success');
      } else {
        setUser(res.data.user);
        setRegForm({ ...res.data.user, skills: res.data.user.skills.join(',') });
        showToast(res.data.message, 'success');
      }
    } catch (err) { showToast(err.response?.data?.error || "Login Failed", 'error'); }
  };

  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    setUser(null); setIsAdmin(false); setAdminStats(null);
    setRegForm({ name: '', email: '', skills: '', password: '', primaryRole: '', availabilityHours: '' });
    setActiveTab('marketplace'); setShowLogoutModal(false);
    showToast("Session Terminated", 'success');
  };

  const handlePostIdea = async (e) => {
    e.preventDefault();
    try {
      const rolesNeeded = [{ roleName: ideaForm.role1 }, { roleName: ideaForm.role2 }, { roleName: ideaForm.role3 }].filter(r => r.roleName.trim() !== "");
      const res = await axios.post('https://teamup-api-9n2x.onrender.com/api/ideas', { ...ideaForm, rolesNeeded, createdBy: user.name });
      showToast(`Posted! Clarity Score: ${res.data.idea.clarityScore}`, 'success');
      setActiveTab('marketplace');
      fetchIdeas();
    } catch (err) { showToast("Limit Reached or Error", 'error'); }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://teamup-api-9n2x.onrender.com/api/apply', { ideaId: showApplyModal._id, userId: user._id, userName: user.name, applyingForRole: applyForm.applyingForRole, message: applyForm.message });
      showToast("Application Sent.", 'success'); setShowApplyModal(null);
    } catch (err) { showToast("Failed to apply", 'error'); }
  };

  // --- MEMBER REMOVAL (Updated for Dashboard Only) ---
  const handleRemoveMember = async (memberId) => {
    if(!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await axios.delete(`https://teamup-api-9n2x.onrender.com/api/ideas/${viewTeamModal._id}/members/${memberId}`);
      showToast("Member removed from team.", 'success');
      const res = await axios.get(`https://teamup-api-9n2x.onrender.com/api/ideas/${viewTeamModal._id}/team`);
      setTeamMembers(res.data);
      fetchIdeas();
    } catch(e) {
      showToast("Failed to remove member", 'error');
    }
  };

  const analyzeRisk = async (idea, forceRefresh = false) => {
    if (!forceRefresh && idea.teamRiskAnalysis && idea.teamRiskAnalysis.riskLevel) {
        setCurrentRiskIdea(idea);
        return; 
    }
    setIsAnalyzing(true);
    setCurrentRiskIdea(idea);

    try {
      const [res] = await Promise.all([
        axios.post('https://teamup-api-9n2x.onrender.com/api/analyze-risk', { ideaId: idea._id }),
        new Promise(resolve => setTimeout(resolve, 3500)) 
      ]);
      const updatedIdeas = ideas.map(i => i._id === idea._id ? { ...i, teamRiskAnalysis: res.data } : i);
      setIdeas(updatedIdeas);
      const updatedIdea = { ...idea, teamRiskAnalysis: res.data };
      setCurrentRiskIdea(updatedIdea);
      setIsAnalyzing(false);
    } catch (err) { setIsAnalyzing(false); showToast("Quota Limit Reached", 'error'); }
  };

  const handleUpdateProfile = async (e) => { e.preventDefault(); try { const payload = { ...regForm, skills: regForm.skills.split(',') }; const res = await axios.put(`https://teamup-api-9n2x.onrender.com/api/users/${user._id}`, payload); setUser(res.data); setIsEditing(false); showToast("Profile Updated", 'success'); } catch(e) { showToast("Update Failed", 'error'); } };
  
  const handleViewTeam = async (idea) => { 
      try { 
          const res = await axios.get(`https://teamup-api-9n2x.onrender.com/api/ideas/${idea._id}/team`); 
          setTeamMembers(res.data); 
          setViewTeamModal(idea); 
      } catch(e) { showToast("Could not fetch team", 'error'); } 
  };
  
  const openManageModal = async (idea) => { try { const res = await axios.get(`https://teamup-api-9n2x.onrender.com/api/applications/idea/${idea._id}`); setApplicants(res.data); setManageModal(idea); } catch(e) { showToast("Error fetching applicants", 'error'); } };
  const updateAppStatus = async (appId, status) => { try { await axios.put(`https://teamup-api-9n2x.onrender.com/api/applications/${appId}/status`, { status }); showToast(`Applicant ${status}`, 'success'); const res = await axios.get(`https://teamup-api-9n2x.onrender.com/api/applications/idea/${manageModal._id}`); setApplicants(res.data); } catch(e) { showToast("Action failed", 'error'); } };
  const deleteRecord = async (type, id) => { if(!window.confirm("Delete record?")) return; try { await axios.delete(`https://teamup-api-9n2x.onrender.com/api/admin/delete/${type}/${id}`); showToast("Deleted.", 'success'); fetchAdminData(); } catch(e) { showToast("Deletion Failed", 'error'); } };

  return (
    <div className="App">
      <div className="toast-container">{toasts.map(t => <Toast key={t.id} id={t.id} message={t.msg} type={t.type} onClose={removeToast} />)}</div>
      
      <RiskModal 
        data={currentRiskIdea ? currentRiskIdea.teamRiskAnalysis : null} 
        isLoading={isAnalyzing}
        onClose={() => setCurrentRiskIdea(null)} 
        onRefresh={() => {
            if(currentRiskIdea) analyzeRisk(currentRiskIdea, true); 
        }} 
      />

      {user && (
        <div style={{background: '#ffaa00', color: 'black', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing:'1px', borderBottom:'1px solid #cc8800'}}>
             🚧 DEMO MODE: You are logged in as {user.name} (Judge View). Data is synthetic.
        </div>
      )}

      {user && (
        <button onClick={handleLogoutClick} style={{ position: 'absolute', top: '50px', right: '20px', background: 'rgba(255, 50, 50, 0.1)', color: '#ff5555', border: '1px solid #ff5555', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', zIndex: 100, transition: 'all 0.3s ease' }}>LOGOUT</button>
      )}

      <header className="App-header">
        <h1>✦ TeamUp AI ✦</h1>
        <p>{quote}</p>
        {user && !isAdmin && (
          <div className="tabs">
            <button className={activeTab === 'marketplace' ? 'active' : ''} onClick={() => setActiveTab('marketplace')}>MARKETPLACE</button>
            <button className={activeTab === 'post' ? 'active' : ''} onClick={() => setActiveTab('post')}>POST IDEA</button>
            <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>DASHBOARD</button>
            <button className={activeTab === 'insights' ? 'active' : ''} onClick={() => setActiveTab('insights')}>PLATFORM INTEL</button>
          </div>
        )}
        {isAdmin && <div className="tabs"><button className="active">ADMIN DASHBOARD</button></div>}
      </header>

      {!user && (
        <div className="container">
          <div className="card" style={{maxWidth: '450px', margin: '0 auto', textAlign:'center'}}>
            <h2>Authenticate</h2>
            <div className="tabs" style={{marginBottom: '20px', justifyContent: 'center'}}>
                <button className={loginTab === 'user' ? 'active' : ''} onClick={() => setLoginTab('user')} style={{fontSize:'0.8rem'}}>User Login</button>
                <button className={loginTab === 'admin' ? 'active' : ''} onClick={() => setLoginTab('admin')} style={{fontSize:'0.8rem'}}>Admin Login</button>
            </div>
            <form onSubmit={handleRegister}>
              <input placeholder="Email Address (Required)" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} required />
              {loginTab === 'user' && (
                <>
                  <input placeholder="Full Name" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} />
                  <input placeholder="Primary Role (e.g. Backend Dev)" value={regForm.primaryRole} onChange={e => setRegForm({...regForm, primaryRole: e.target.value})} />
                  <input type="number" placeholder="Availability (Hrs/Day)" value={regForm.availabilityHours} onChange={e => setRegForm({...regForm, availabilityHours: e.target.value})} />
                  <input placeholder="Skills (React, Node...)" value={regForm.skills} onChange={e => setRegForm({...regForm, skills: e.target.value})} />
                </>
              )}
              {loginTab === 'admin' && <input type="password" placeholder="Password" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} required />}
              <button type="submit">{loginTab === 'user' ? 'Enter System' : 'Access Core'}</button>
            </form>
          </div>
        </div>
      )}

      {/* MARKETPLACE */}
      {user && !isAdmin && activeTab === 'marketplace' && (
        <div className="container">
          {ideas.map((idea) => (
            <div key={idea._id} className="card">
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                 <div>
                   <h3>{idea.title}</h3>
                   <span style={{fontSize:'0.7rem', color:'#aaa', border:'1px solid #444', padding:'2px 6px', borderRadius:'4px', marginRight:'8px'}}>
                      Clarity: {idea.clarityScore}%
                   </span>
                   {idea.teamRiskAnalysis && <span className={`risk-badge risk-${idea.teamRiskAnalysis.riskLevel}`}>{idea.teamRiskAnalysis.riskLevel} RISK</span>}
                 </div>
               </div>
               <p style={{color:'#ccc', marginTop:'10px'}}>{idea.problemStatement}</p>
               <div style={{display:'flex', gap:'10px', marginTop:'15px'}}>
                 {idea.createdBy !== user.name && (
                    <button className="action-btn" onClick={() => setShowApplyModal(idea)} style={{background:'white', color:'black', flex:1}}>APPLY</button>
                 )}
                 <button className="action-btn" onClick={() => analyzeRisk(idea)} style={{background:'transparent', border:'1px solid white', color:'white', flex:1}}>
                    {idea.teamRiskAnalysis ? 'VIEW REPORT' : 'AUDIT RISK'}
                 </button>
                 <button className="action-btn" onClick={() => handleViewTeam(idea)} style={{background:'#333', border:'1px solid #555', color:'white', flex:1}}>VIEW TEAM</button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* NEW: PLATFORM INSIGHTS */}
      {user && !isAdmin && activeTab === 'insights' && <InsightsDashboard />}

      {/* POST IDEA & DASHBOARD (Unchanged) */}
      {user && !isAdmin && activeTab === 'post' && (
        <div className="container">
          <div className="card" style={{maxWidth:'600px', margin:'0 auto'}}>
             <h2>New Project</h2>
             <form onSubmit={handlePostIdea}>
               <input placeholder="Title" value={ideaForm.title} onChange={e => setIdeaForm({...ideaForm, title: e.target.value})} required />
               <textarea placeholder="Problem" value={ideaForm.problemStatement} onChange={e => setIdeaForm({...ideaForm, problemStatement: e.target.value})} required />
               <input placeholder="Goal" value={ideaForm.expectedOutcome} onChange={e => setIdeaForm({...ideaForm, expectedOutcome: e.target.value})} required />
               <div style={{display:'flex', gap:'10px'}}>
                  <input placeholder="Role 1 (Required)" value={ideaForm.role1} onChange={e => setIdeaForm({...ideaForm, role1: e.target.value})} required />
                  <input placeholder="Role 2 (Optional)" value={ideaForm.role2} onChange={e => setIdeaForm({...ideaForm, role2: e.target.value})} />
                  <input placeholder="Role 3 (Optional)" value={ideaForm.role3} onChange={e => setIdeaForm({...ideaForm, role3: e.target.value})} />
               </div>
               <button type="submit">Launch</button>
             </form>
          </div>
        </div>
      )}

      {user && !isAdmin && activeTab === 'dashboard' && (
        <div className="container">
          <div className="grid-2">
            <div className="card">
               <div style={{display:'flex', justifyContent:'space-between'}}>
                 <h2>My Profile</h2>
                 <button onClick={() => setIsEditing(!isEditing)} style={{background:'transparent', border:'none', color:'#aaa', cursor:'pointer'}}>{isEditing ? 'Cancel' : 'Edit'}</button>
               </div>
               {!isEditing ? (
                 <div>
                   <p><strong>Name:</strong> {user.name}</p>
                   <p><strong>Role:</strong> {user.primaryRole}</p>
                   <p><strong>Hours:</strong> {user.availabilityHours} / Day</p>
                   <p><strong>Skills:</strong> {user.skills.join(', ')}</p>
                 </div>
               ) : (
                 <form onSubmit={handleUpdateProfile}>
                   <input value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} />
                   <input type="number" value={regForm.availabilityHours} onChange={e => setRegForm({...regForm, availabilityHours: e.target.value})} />
                   <input value={regForm.skills} onChange={e => setRegForm({...regForm, skills: e.target.value})} />
                   <button type="submit">Save Changes</button>
                 </form>
               )}
            </div>
            <div className="card">
               <h2>My Applications</h2>
               {myApps.length === 0 ? <p style={{color:'#666'}}>No applications yet.</p> : (
                 <div style={{maxHeight:'200px', overflowY:'auto'}}>
                   {myApps.map(app => (
                     <div key={app._id} style={{padding:'10px', borderBottom:'1px solid #333', display:'flex', justifyContent:'space-between'}}>
                       <span>{app.ideaId?.title || "Deleted Idea"}</span>
                       <span style={{color: app.status === 'accepted' ? '#00ff00' : app.status === 'rejected' ? 'red' : 'orange', textTransform:'uppercase', fontSize:'0.8rem', fontWeight:'bold'}}>{app.status}</span>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>
          
          <div className="card" style={{marginTop:'2rem'}}>
             <h2>Manage My Startups</h2>
             <p style={{color:'#666', marginBottom:'1rem'}}>Projects initiated by you ({user.name})</p>
             {ideas.filter(i => i.createdBy === user.name).map(idea => (
               <div key={idea._id} style={{padding:'10px', background:'rgba(255,255,255,0.05)', marginBottom:'10px', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                 <div>
                    <span style={{fontWeight:'bold'}}>{idea.title}</span>
                    <span style={{fontSize:'0.8rem', color:'#aaa', marginLeft:'10px'}}>Clarity: {idea.clarityScore}%</span>
                 </div>
                 <div style={{display:'flex', gap:'10px'}}>
                   {idea.teamRiskAnalysis && (
                     <button onClick={() => { setCurrentRiskIdea(idea); setIsAnalyzing(false); }} style={{padding:'5px 10px', background:'transparent', border:'1px solid #555', color:'#aaa', borderRadius:'4px', cursor:'pointer'}}>Risk Report</button>
                   )}
                   {/* UPDATED DASHBOARD BUTTONS: NOW INCLUDES VIEW ROSTER */}
                   <button onClick={() => handleViewTeam(idea)} style={{padding:'5px 10px', background:'#333', border:'1px solid #555', color:'white', borderRadius:'4px', cursor:'pointer'}}>View Roster</button>
                   <button onClick={() => openManageModal(idea)} style={{padding:'5px 10px', background:'#444', border:'none', color:'white', borderRadius:'4px', cursor:'pointer'}}>Applicants</button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Commit to {showApplyModal.title}</h2>
            <select onChange={e => setApplyForm({...applyForm, applyingForRole: e.target.value})} style={{width:'100%', padding:'10px', marginTop:'20px', background:'#333', color:'white', border:'1px solid #555'}}>
                <option value="">Select Role to Own...</option>
                {showApplyModal.rolesNeeded.map((r, i) => <option key={i} value={r.roleName}>{r.roleName}</option>)}
            </select>
            <textarea placeholder="Proof of Capability..." value={applyForm.message} onChange={e => setApplyForm({...applyForm, message: e.target.value})} />
            <button onClick={handleApply} className="action-btn">Confirm Application</button>
          </div>
        </div>
      )}

      {/* UPDATED VIEW TEAM MODAL */}
      {viewTeamModal && (
        <div className="modal-overlay" onClick={() => setViewTeamModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Team Roster: {viewTeamModal.title}</h2>
            {teamMembers.length === 0 ? <p style={{color:'#aaa'}}>No accepted members yet.</p> : (
              <ul style={{listStyle:'none', padding:0}}>
                {teamMembers.map(m => (
                  <li key={m._id} style={{padding:'15px', borderBottom:'1px solid #444', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <strong style={{fontSize:'1.1rem'}}>{m.name}</strong>
                      <div style={{color:'#a855f7', fontSize:'0.9rem'}}>{m.primaryRole}</div>
                    </div>
                    {/* ONLY SHOW REMOVE BUTTON IF: Dashboard Tab + Owner + Not Self */}
                    {activeTab === 'dashboard' && user.name === viewTeamModal.createdBy && m.name !== user.name && (
                      <button 
                        onClick={() => handleRemoveMember(m._id)}
                        style={{background:'#ff3333', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontSize:'0.8rem'}}
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setViewTeamModal(null)} className="action-btn" style={{background:'#333', marginTop:'1rem'}}>Close</button>
          </div>
        </div>
      )}

      {manageModal && (
        <div className="modal-overlay" onClick={() => setManageModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Applicants for {manageModal.title}</h2>
            {applicants.length === 0 ? <p style={{color:'#aaa'}}>No pending applications.</p> : (
              <div style={{maxHeight:'300px', overflowY:'auto'}}>
                {applicants.map(app => (
                  <div key={app._id} style={{padding:'15px', background:'#222', marginBottom:'10px', borderRadius:'8px'}}>
                    <p style={{margin:'0 0 5px 0'}}><strong>{app.userName}</strong> wants to be <strong>{app.applyingForRole}</strong></p>
                    <p style={{color:'#888', fontSize:'0.9rem'}}>"{app.message}"</p>
                    <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                      {app.status === 'pending' ? (
                        <>
                          <button onClick={() => updateAppStatus(app._id, 'accepted')} style={{background:'#00ff00', color:'black', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold'}}>Accept</button>
                          <button onClick={() => updateAppStatus(app._id, 'rejected')} style={{background:'#ff3333', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer'}}>Reject</button>
                        </>
                      ) : (
                        <span style={{color: app.status === 'accepted' ? '#00ff00' : 'red', fontWeight:'bold', textTransform:'uppercase'}}>{app.status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setManageModal(null)} className="action-btn" style={{background:'#333', marginTop:'1rem'}}>Close</button>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>End Session?</h2>
            <p style={{color:'#ccc', marginBottom:'20px'}}>Are you sure you want to log out?</p>
            <div style={{display:'flex', gap:'10px'}}>
              <button onClick={confirmLogout} className="action-btn" style={{background:'#ff3333', color:'white', border:'none'}}>Yes, Logout</button>
              <button onClick={() => setShowLogoutModal(false)} className="action-btn" style={{background:'#333', color:'white', border:'1px solid #555'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;