import React, { useState } from 'react';

export default function RoadmapView({ roadmap }) {
  const [completed, setCompleted] = useState(new Set());

  const toggleComplete = (index) => {
    setCompleted(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="text-center p-12 text-gray-400">
        No roadmap data found. Please complete onboarding.
      </div>
    );
  }

  const getIconColor = (type, isCompleted) => {
    if (isCompleted) return 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.5)]';
    switch(type?.toLowerCase()) {
      case 'course': return 'bg-cyan text-black';
      case 'project': return 'bg-teal text-black';
      case 'internship': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="relative border-l-2 border-cyan/30 ml-4 md:ml-12 pl-8 py-4 flex flex-col gap-8">
      {roadmap.map((step, index) => {
        const isCompleted = completed.has(index);

        return (
          <div key={index} className="relative group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[41px] top-4 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-background ${getIconColor(step.type, isCompleted)} z-10 transition-transform group-hover:scale-125`}>
              {isCompleted ? '✓' : index + 1}
            </div>

            {/* Content Card */}
            <div className={`bg-panel border ${isCompleted ? 'border-green-500/30' : 'border-cyan/10 hover:border-cyan/40 hover:shadow-[0_0_20px_rgba(102,252,241,0.15)]'} transition-all rounded-xl p-6 backdrop-blur-sm`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-xl font-bold ${isCompleted ? 'text-green-400 line-through opacity-70' : 'text-white'}`}>{step.title}</h3>
                <span className={`text-xs px-2 py-1 rounded uppercase tracking-wider font-semibold ${getIconColor(step.type, isCompleted)}`}>
                  {step.type || 'Milestone'}
                </span>
              </div>
              <p className={`leading-relaxed mb-4 ${isCompleted ? 'text-gray-500 opacity-70' : 'text-textMain'}`}>
                {step.description}
              </p>
              
              <div 
                onClick={() => toggleComplete(index)}
                className={`flex items-center text-sm font-medium cursor-pointer w-fit transition-colors px-3 py-1.5 rounded-md border
                  ${isCompleted ? 'text-green-400 border-green-400/30 bg-green-500/10 hover:bg-green-500/20' : 'text-cyan border-cyan/30 bg-cyan/10 hover:bg-cyan/20'}`}
              >
                {isCompleted ? '✓ Completed (Undo)' : '+ Mark as Completed'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
