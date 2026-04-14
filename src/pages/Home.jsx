import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submissionsAPI } from '../utils/api';
import './Home.css';

const TOPIC_ICONS = {
  python: '🐍', java: '☕', 'c++': '⚙️', 'data-structures': '🌲',
  algorithms: '🔢', 'web-development': '🌐', databases: '🗄️',
  'computer-networks': '🔗', 'operating-systems': '💻', programming: '📝',
};

const QUICK_START = [
  { topic: 'python',           icon: '🐍', label: 'Python',       color: '#3b82f6' },
  { topic: 'web-development',  icon: '🌐', label: 'Web Dev',      color: '#06b6d4' },
  { topic: 'data-structures',  icon: '🌲', label: 'DSA',          color: '#10b981' },
  { topic: 'algorithms',       icon: '🔢', label: 'Algorithms',   color: '#ef4444' },
];

// Animated counter hook
function useCounter(target, duration = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return val;
}

function StatCard({ icon, label, value, color, suffix = '' }) {
  const animated = useCounter(value);
  return (
    <div className="hsc-card">
      <div className="hsc-icon-wrap" style={{ background: color + '20', color }}>{icon}</div>
      <div className="hsc-body">
        <div className="hsc-value">{animated}{suffix}</div>
        <div className="hsc-label">{label}</div>
      </div>
      <div className="hsc-glow" style={{ background: color + '10' }} />
    </div>
  );
}

function ScoreBar({ score, total }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : Math.min(score * 2, 100);
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: pct + '%', background: color }} />
      </div>
      <span className="score-bar-pct" style={{ color }}>{pct}%</span>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setStats({ total: 0, best: 0, avg: 0, recent: [], streak: 0 }); setLoading(false); return; }
    submissionsAPI.getMySubmissions()
      .then(subs => {
        const total = subs.length;
        const best = total > 0 ? Math.max(...subs.map(s => s.score)) : 0;
        const avg = total > 0 ? Math.round(subs.reduce((a, s) => a + s.score, 0) / total) : 0;
        // Calculate streak (consecutive days)
        let streak = 0;
        if (total > 0) {
          const days = [...new Set(subs.map(s => new Date(s.submittedAt).toDateString()))];
          const today = new Date().toDateString();
          if (days[0] === today || days[0] === new Date(Date.now() - 86400000).toDateString()) {
            streak = 1;
            for (let i = 1; i < days.length; i++) {
              const diff = (new Date(days[i - 1]) - new Date(days[i])) / 86400000;
              if (diff === 1) streak++;
              else break;
            }
          }
        }
        setStats({ total, best, avg, recent: subs.slice(0, 5), streak });
      })
      .catch(() => setStats({ total: 0, best: 0, avg: 0, recent: [], streak: 0 }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">

      {/* Hero banner */}
      <div className="home-hero">
        <div className="home-hero-left">
          <div className="home-greeting">{greeting},</div>
          <h1 className="home-title"><span className="home-name">{user?.username}</span> 👋</h1>
          <p className="home-sub">Ready to level up today? Pick a quiz and start earning points.</p>
          <div className="home-hero-btns">
            <Link to="/quizzes" className="btn btn-primary">Start a Quiz →</Link>
            <Link to="/leaderboard" className="btn btn-ghost">Leaderboard</Link>
          </div>
        </div>
        <div className="home-hero-right">
          <div className="hero-card">
            <div className="hero-card-label">Your streak</div>
            <div className="hero-streak">{loading ? '—' : stats?.streak ?? 0} 🔥</div>
            <div className="hero-card-sub">days in a row</div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="home-stats">
        <StatCard icon="📋" label="Quizzes Taken" value={loading ? 0 : stats?.total ?? 0} color="#6366f1" />
        <StatCard icon="🏆" label="Best Score"    value={loading ? 0 : stats?.best ?? 0}  color="#f59e0b" />
        <StatCard icon="📈" label="Avg Score"     value={loading ? 0 : stats?.avg ?? 0}   color="#10b981" />
        <StatCard icon="🔥" label="Day Streak"    value={loading ? 0 : stats?.streak ?? 0} color="#ef4444" />
      </div>

      {/* Two column layout */}
      <div className="home-grid">

        {/* Recent activity */}
        <div className="home-panel">
          <div className="home-panel-header">
            <h2>Recent Activity</h2>
            <Link to="/history" className="panel-link">View all →</Link>
          </div>
          {loading ? (
            <div className="home-spinner"><div className="loading-spinner" /></div>
          ) : stats?.recent?.length > 0 ? (
            <div className="activity-list">
              {stats.recent.map((sub, i) => {
                const icon = TOPIC_ICONS[sub.topic] || '📝';
                const total = sub.totalQuestions || 10;
                const color = sub.totalQuestions
                  ? (sub.score / total >= 0.7 ? '#10b981' : sub.score / total >= 0.4 ? '#f59e0b' : '#ef4444')
                  : (sub.score >= 30 ? '#10b981' : sub.score >= 10 ? '#f59e0b' : '#ef4444');
                return (
                  <div key={sub._id} className="activity-row">
                    <div className="activity-icon">{icon}</div>
                    <div className="activity-info">
                      <div className="activity-topic">
                        {sub.topic ? sub.topic.replace(/-/g, ' ') : 'General Quiz'}
                        {sub.difficulty && <span className="activity-diff">{sub.difficulty}</span>}
                      </div>
                      <ScoreBar score={sub.score} total={sub.totalQuestions} />
                    </div>
                    <div className="activity-score" style={{ color }}>
                      {sub.totalQuestions ? `${sub.score}/${sub.totalQuestions}` : `${sub.score}pts`}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="home-empty-state">
              <div className="empty-icon">🎯</div>
              <p>No quizzes yet. Take your first one!</p>
              <Link to="/quizzes" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Now</Link>
            </div>
          )}
        </div>

        {/* Quick start */}
        <div className="home-panel">
          <div className="home-panel-header">
            <h2>Quick Start</h2>
            <Link to="/quizzes" className="panel-link">All courses →</Link>
          </div>
          <div className="quick-grid">
            {QUICK_START.map(q => (
              <div key={q.topic} className="quick-card" style={{ '--qc': q.color }}>
                <div className="quick-icon" style={{ background: q.color + '20', color: q.color }}>{q.icon}</div>
                <div className="quick-label">{q.label}</div>
                <div className="quick-btns">
                  {['easy', 'medium', 'hard'].map(d => (
                    <button key={d} className="quick-diff-btn"
                      onClick={() => navigate(`/quiz/${q.topic}/${d}`)}>
                      {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Progress section */}
          {!loading && stats?.total > 0 && (
            <div className="home-progress-section">
              <div className="home-panel-header" style={{ marginTop: '1.5rem' }}>
                <h2>Overall Progress</h2>
              </div>
              <div className="progress-rows">
                <div className="progress-row">
                  <span>Accuracy</span>
                  <div className="prog-bar-track">
                    <div className="prog-bar-fill" style={{
                      width: Math.min(stats.avg * 2, 100) + '%',
                      background: 'var(--primary)'
                    }} />
                  </div>
                  <span className="prog-val">{Math.min(stats.avg * 2, 100)}%</span>
                </div>
                <div className="progress-row">
                  <span>Quizzes</span>
                  <div className="prog-bar-track">
                    <div className="prog-bar-fill" style={{
                      width: Math.min(stats.total * 5, 100) + '%',
                      background: '#10b981'
                    }} />
                  </div>
                  <span className="prog-val">{stats.total}/20</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
