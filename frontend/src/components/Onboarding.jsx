import React, { useState } from 'react';

export default function Onboarding({ user, onComplete }) {
  const [skills, setSkills] = useState(user.skills?.join(', ') || '');
  const [interests, setInterests] = useState(user.interests?.join(', ') || '');
  const [targetCareer, setTargetCareer] = useState(user.targetCareer || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    const parsedInterests = interests.split(',').map(i => i.trim()).filter(Boolean);

    try {
      const response = await fetch('http://localhost:5000/api/ai/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          skills: parsedSkills,
          interests: parsedInterests,
          targetCareer
        })
      });

      const data = await response.json();
      if (data.success) {
        onComplete({ ...user, skills: parsedSkills, interests: parsedInterests, targetCareer, roadmap: data.roadmap });
      } else {
        setError(data.message || 'Failed to generate roadmap.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error generating roadmap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-panel border border-cyan/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Configure Your Path</h2>
        <p className="text-textMain text-sm">Tell the AI engine about yourself to plot the optimal route to your future career.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-cyan font-semibold tracking-wide uppercase">Target Career</label>
          <input 
            className="bg-black/40 border border-cyan/30 text-white p-3 rounded-lg focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
            placeholder="e.g. Machine Learning Engineer"
            value={targetCareer}
            onChange={(e) => setTargetCareer(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-teal font-semibold tracking-wide uppercase">Current Skills (Comma Separated)</label>
          <input 
            className="bg-black/40 border border-teal/30 text-white p-3 rounded-lg focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            placeholder="e.g. Python, SQL, Communication"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-teal font-semibold tracking-wide uppercase">Interests (Comma Separated)</label>
          <input 
            className="bg-black/40 border border-teal/30 text-white p-3 rounded-lg focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            placeholder="e.g. Artificial Intelligence, Data Vis, Robotics"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        {error && <div className="text-red-400 text-sm text-center font-medium bg-red-900/20 p-2 rounded">{error}</div>}

        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 w-full bg-gradient-to-r from-teal to-cyan text-black font-bold py-3 rounded-lg hover:shadow-[0_0_15px_rgba(102,252,241,0.5)] transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? 'Initializing AI Engine...' : 'Generate Neural Path'}
        </button>
      </form>
    </div>
  );
}
