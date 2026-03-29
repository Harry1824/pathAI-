import React from 'react';
import { motion } from 'framer-motion';

export default function SkillMatrix({ user }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } }
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Skill Matrix Analyzer</h1>
      <p className="text-textMain mb-8 border-b border-cyan/10 pb-4">Real-time quantification of your neural capabilities.</p>
      
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {user.skills && user.skills.map((skill, i) => {
          const level = (Math.random() * 5 + 1).toFixed(1);
          const percent = Math.min((level / 10) * 100 + 40, 100);
          return (
            <motion.div key={i} variants={itemVariants} className="bg-panel border border-teal/20 hover:border-teal transition-colors p-6 rounded-xl shadow-[0_0_15px_rgba(69,162,158,0.1)] backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-bold tracking-wide">{skill}</h3>
                <span className="text-xs text-teal bg-teal/10 px-2 py-1 rounded-sm border border-teal/20 font-mono">Lv. {level}</span>
              </div>
              <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${percent}%` }} 
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="bg-gradient-to-r from-teal to-cyan h-full rounded-full"
                ></motion.div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
