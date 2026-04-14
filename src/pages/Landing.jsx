import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const FEATURES = [
  { icon: '🤖', title: 'AI-Generated Questions', desc: 'Groq AI creates 10 unique questions every time — no repeats, ever.', color: '#6366f1' },
  { icon: '⏱️', title: 'Timed Challenges',       desc: '30 seconds per question. Think fast, score high.',               color: '#f59e0b' },
  { icon: '🏆', title: 'Live Leaderboard',        desc: 'Compete with others and see your rank in real time.',            color: '#10b981' },
  { icon: '📋', title: 'Quiz History & Review',   desc: 'Revisit every quiz, see what you got wrong and why.',           color: '#ef4444' },
  { icon: '📚', title: '10+ Topics',              desc: 'Python, Java, DSA, Web Dev, Databases, Networks and more.',     color: '#8b5cf6' },
  { icon: '💡', title: 'AI Explanations',         desc: 'Wrong answer? AI explains why the correct answer is right.',    color: '#06b6d4' },
];

const PREVIEW_OPTS = ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>"];

export default function Landing() {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (i) => {
    if (revealed) return;
    setSelected(i);
    setTimeout(() => setRevealed(true), 400);
  };

  return (
    <div className="landing">

      {/* ── Hero ── */}
      <section className="l-hero">
        <div className="l-hero-inner">
          <div className="l-hero-left">
            <div className="l-badge">✨ Powered by Groq AI</div>
            <h1 className="l-title">
              The smarter way<br />to <span className="l-grad">test yourself</span>
            </h1>
            <p className="l-sub">
              AI-generated quizzes across 10+ tech topics.<br />
              Compete, learn, and climb the leaderboard.
            </p>
            <div className="l-actions">
              <Link to="/signup" className="btn btn-primary l-btn">Get started free →</Link>
              <Link to="/login"  className="btn btn-ghost  l-btn">Sign in</Link>
            </div>
          </div>

          {/* Interactive preview card */}
          <div className="l-hero-right">
            <div className="l-preview">
              <div className="l-preview-header">
                <span className="l-preview-tag">🐍 Python · Medium</span>
                <span className="l-preview-timer">⏱ 28s</span>
              </div>
              <p className="l-preview-q">
                What is the output of <code>print(type([]))</code>?
              </p>
              <div className="l-preview-opts">
                {PREVIEW_OPTS.map((o, i) => (
                  <button
                    key={i}
                    className={`l-opt
                      ${selected === i ? 'l-opt-selected' : ''}
                      ${revealed && i === 0 ? 'l-opt-correct' : ''}
                      ${revealed && selected === i && i !== 0 ? 'l-opt-wrong' : ''}
                    `}
                    onClick={() => handleSelect(i)}
                  >
                    <span className="l-opt-letter">{String.fromCharCode(65+i)}</span>
                    {o}
                    {revealed && i === 0 && <span className="l-opt-check">✓</span>}
                  </button>
                ))}
              </div>
              {revealed && (
                <div className="l-preview-result">
                  {selected === 0 ? '🎉 Correct! +5 points' : '❌ Wrong. The answer is <class \'list\'>'}
                </div>
              )}
              {!revealed && selected === null && (
                <p className="l-preview-hint">👆 Try answering the question</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="l-features">
        <div className="l-section-label">What you get</div>
        <h2 className="l-section-title">Everything to level up your skills</h2>
        <div className="l-feat-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="l-feat-card" style={{'--fc': f.color}}>
              <div className="l-feat-icon" style={{background: f.color+'18', color: f.color}}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="l-stats">
        {[['10+','Topics covered'],['3','Difficulty levels'],['∞','Unique questions'],['30s','Per question']].map(([n,l],i)=>(
          <div key={i} className="l-stat">
            <div className="l-stat-num">{n}</div>
            <div className="l-stat-label">{l}</div>
          </div>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="l-cta">
        <h2>Ready to challenge yourself?</h2>
        <p>Join now and take your first AI-powered quiz in seconds.</p>
        <Link to="/signup" className="btn btn-primary l-btn">Create free account →</Link>
      </section>

    </div>
  );
}
