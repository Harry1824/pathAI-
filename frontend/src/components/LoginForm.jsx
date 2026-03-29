import React, { useState } from 'react';

export default function LoginForm({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/signup';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-panel border border-cyan/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {isLogin ? 'CampusPath AI' : 'Join the Network'}
        </h2>
        <p className="text-sm text-textMain">
          {isLogin ? 'Sign in to access your neural map' : 'Create an account to begin'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-cyan">Username</label>
          <input 
            type="text" 
            className="bg-black/40 border border-cyan/30 text-white p-3 rounded-lg focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            placeholder={isLogin ? 'admin' : 'Choose a username'}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-teal">Password</label>
          <input 
            type="password" 
            className="bg-black/40 border border-teal/30 text-white p-3 rounded-lg focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            placeholder="••••••••"
          />
        </div>

        {error && <div className="text-red-400 text-sm font-medium text-center bg-red-900/20 p-2 rounded">{error}</div>}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal to-cyan text-black font-bold py-3 mt-2 rounded-lg hover:shadow-[0_0_15px_rgba(102,252,241,0.5)] transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
        </button>
      </form>

      <div className="text-center border-t border-cyan/10 pt-4">
        <span 
          className="text-sm text-cyan/80 hover:text-cyan cursor-pointer transition-colors"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </span>
      </div>
    </div>
  );
}
