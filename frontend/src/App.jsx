import React, { useState } from 'react';
import Scene3D from './components/Scene3D';
import LoginForm from './components/LoginForm';
import Onboarding from './components/Onboarding';
import RoadmapView from './components/RoadmapView';
import SkillMatrix from './components/SkillMatrix';
import JobNodes from './components/JobNodes';
import Chatbot from './components/Chatbot';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // Tabs: chat, roadmap, skills, jobs, settings

  const handleLogout = () => {
    setUser(null);
    setActiveTab('chat');
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'chat':
        return <Chatbot user={user} />;
      case 'skills':
        return <SkillMatrix user={user} />;
      case 'jobs':
        return <JobNodes user={user} />;
      case 'settings':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto bg-panel border gap-4 border-cyan/20 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
            <h1 className="text-2xl font-bold text-white mb-6 border-b border-cyan/10 pb-4">System Settings</h1>
            <div className="flex flex-col gap-6">
              <div>
                <label className="text-xs text-cyan uppercase tracking-wider font-semibold">Operative Handle</label>
                <input disabled className="mt-1 w-full bg-black/50 border border-cyan/10 p-3 rounded-xl text-white font-mono" value={user.username} />
              </div>
              <div>
                <label className="text-xs text-cyan uppercase tracking-wider font-semibold">Target Vector</label>
                <input disabled className="mt-1 w-full bg-black/50 border border-cyan/10 p-3 rounded-xl text-white font-mono" value={user.targetCareer} />
              </div>
              <button
                onClick={() => setUser({ ...user, roadmap: [] })}
                className="w-full bg-red-900/30 border border-red-500/50 text-red-400 py-4 rounded-xl font-bold hover:bg-red-500/30 transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] mt-4 uppercase tracking-widest"
              >
                Recalibrate Career (Reset Roadmap)
              </button>
            </div>
          </motion.div>
        );
      case 'roadmap':
      default:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Optimal Career Route</h1>
              <p className="text-textMain text-lg">
                Calculated neural sequence designed to achieve your target title: <span className="text-cyan font-bold">{user.targetCareer}</span>.
              </p>
            </div>
            <RoadmapView roadmap={user.roadmap} />
          </motion.div>
        );
    }
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="flex h-screen w-full items-center justify-center p-4">
          <LoginForm onLoginSuccess={setUser} />
        </div>
      );
    }

    if (!user.roadmap || user.roadmap.length === 0) {
      return (
        <div className="flex h-screen w-full items-center justify-center p-4">
          <Onboarding user={user} onComplete={setUser} />
        </div>
      );
    }

    return (
      <div className="flex flex-col h-screen w-full bg-background/85 backdrop-blur-md z-10 relative">
        <header className="px-8 py-5 border-b border-cyan/20 bg-panel flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-cyan flex items-center justify-center bg-cyan/10">
              <div className="w-2 h-2 rounded-full bg-cyan animate-pulse"></div>
            </div>
            <div className="text-2xl font-black tracking-[0.2em] text-white uppercase drop-shadow-[0_0_8px_#66fcf1]">
              CampusPath AI
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-textMain uppercase tracking-wider font-semibold">
              <span className="text-teal">Operative:</span> <strong className="text-white ml-2">{user.name || user.username}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-6 py-2 border border-red-500/50 text-red-500 font-bold tracking-widest uppercase rounded hover:bg-red-500/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all"
            >
              Disconnect
            </button>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          <aside className="w-72 border-r border-cyan/10 bg-panel/50 p-8 flex flex-col gap-10 hidden md:flex">
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] font-black text-teal mb-6">Nav System</h3>
              <ul className="flex flex-col gap-4 text-sm text-textMain font-semibold">
                <li
                  onClick={() => setActiveTab('chat')}
                  className={`cursor-pointer flex items-center gap-3 transition-all ${activeTab === 'chat' ? 'text-white scale-105 origin-left' : 'hover:text-white'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeTab === 'chat' ? 'bg-white shadow-[0_0_8px_#fff]' : 'bg-transparent border border-white/30'}`}></span>
                  Agent Hub
                </li>
                <li
                  onClick={() => setActiveTab('roadmap')}
                  className={`cursor-pointer flex items-center gap-3 transition-all ${activeTab === 'roadmap' ? 'text-cyan scale-105 origin-left' : 'hover:text-cyan'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeTab === 'roadmap' ? 'bg-cyan shadow-[0_0_8px_#66fcf1]' : 'bg-transparent border border-cyan/30'}`}></span>
                  Neural Roadmap
                </li>
                <li
                  onClick={() => setActiveTab('skills')}
                  className={`cursor-pointer flex items-center gap-3 transition-all ${activeTab === 'skills' ? 'text-teal scale-105 origin-left' : 'hover:text-teal'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeTab === 'skills' ? 'bg-teal shadow-[0_0_8px_#45a29e]' : 'bg-transparent border border-teal/30'}`}></span>
                  Skill Matrix
                </li>
                <li
                  onClick={() => setActiveTab('jobs')}
                  className={`cursor-pointer flex items-center gap-3 transition-all ${activeTab === 'jobs' ? 'text-blue-400 scale-105 origin-left' : 'hover:text-blue-400'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeTab === 'jobs' ? 'bg-blue-400 shadow-[0_0_8px_#60a5fa]' : 'bg-transparent border border-blue-400/30'}`}></span>
                  Job Nodes
                </li>
                <li
                  onClick={() => setActiveTab('settings')}
                  className={`cursor-pointer flex items-center gap-3 transition-all ${activeTab === 'settings' ? 'text-purple-400 scale-105 origin-left' : 'hover:text-purple-400'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeTab === 'settings' ? 'bg-purple-400 shadow-[0_0_8px_#c084fc]' : 'bg-transparent border border-purple-400/30'}`}></span>
                  Settings
                </li>
              </ul>
            </div>

            <div className="mt-auto bg-black/60 p-5 rounded-2xl border border-cyan/20 backdrop-blur-md shadow-[0_0_15px_rgba(102,252,241,0.05)]">
              <h4 className="text-[10px] text-textMain uppercase tracking-[0.2em] mb-3">Live Target</h4>
              <p className="font-black text-white text-lg leading-tight uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{user.targetCareer}</p>
            </div>
          </aside>

          <section className="flex-1 p-10 overflow-y-auto w-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                {renderDashboardContent()}
              </motion.div>
            </AnimatePresence>
          </section>
        </main>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 w-full h-full -z-10 bg-background overflow-hidden">
        <Scene3D />
      </div>

      <div className="relative w-full min-h-screen">
        {renderContent()}
      </div>
    </>
  );
}

export default App;
