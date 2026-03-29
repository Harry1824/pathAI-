import React from 'react';
import { motion } from 'framer-motion';

export default function JobNodes({ user }) {
  const mockJobs = [
    { title: `Junior ${user.targetCareer || 'Engineer'}`, loc: 'San Francisco, CA • Remote Hybrid', match: 94 },
    { title: `${user.targetCareer || 'Engineer'} Resident`, loc: 'New York, NY • On-Site', match: 88 },
    { title: `Associate ${user.targetCareer || 'Engineer'}`, loc: 'Austin, TX • Remote', match: 81 },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Active Job Nodes</h1>
      <p className="text-textMain mb-8 border-b border-cyan/10 pb-4">Industry connections vectoring towards your target career: <span className="text-cyan font-bold">{user.targetCareer}</span>.</p>
      
      <div className="flex flex-col gap-5">
        {mockJobs.map((job, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="group bg-panel border border-cyan/10 hover:border-cyan/50 p-6 rounded-xl flex justify-between items-center cursor-pointer transition-all backdrop-blur-md hover:shadow-[0_0_25px_rgba(102,252,241,0.2)]"
          >
            <div>
              <h3 className="text-xl text-white font-bold mb-1 group-hover:text-cyan transition-colors">{job.title}</h3>
              <p className="text-sm text-textMain">{job.loc}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs text-textMain uppercase tracking-widest">Match</span>
                <span className="text-cyan font-bold font-mono">{job.match}%</span>
              </div>
              <button className="px-5 py-2.5 bg-cyan/10 text-cyan border border-cyan/30 rounded-lg hover:bg-cyan hover:text-black font-semibold transition-all hover:scale-105 active:scale-95">
                Establish Link
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
