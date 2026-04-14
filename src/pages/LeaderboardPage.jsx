import { useState, useEffect } from 'react';
import { leaderboardAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './LeaderboardPage.css';

const MEDALS  = ['🥇','🥈','🥉'];
const COLORS  = ['#f59e0b','#94a3b8','#cd7c2f'];
const BGCOLS  = ['rgba(245,158,11,0.1)','rgba(148,163,184,0.08)','rgba(205,124,47,0.08)'];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    leaderboardAPI.getLeaderboard()
      .then(d => Array.isArray(d) ? setData(d) : setError('Failed to load'))
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, []);

  const myRank = data.findIndex(d => d.username === user?.username) + 1;

  return (
    <div className="lb-page">

      <div className="lb-hero">
        <div className="lb-hero-icon">🏆</div>
        <h1>Leaderboard</h1>
        <p>Top scores across all quizzes</p>
        {myRank > 0 && (
          <div className="lb-my-rank">Your rank: <strong>#{myRank}</strong></div>
        )}
      </div>

      {loading && (
        <div className="lb-center"><div className="loading-spinner" /></div>
      )}
      {error && <div className="lb-error">{error}</div>}

      {!loading && !error && data.length === 0 && (
        <div className="lb-empty">
          <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🎯</div>
          <h2>No scores yet</h2>
          <p>Be the first to complete a quiz!</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          {/* Top 3 podium */}
          {data.length >= 3 && (
            <div className="lb-podium">
              {[1,0,2].map(pos => {
                const entry = data[pos];
                const isMe = entry?.username === user?.username;
                return (
                  <div key={pos} className={`lb-pod lb-pod-${pos}`}>
                    <div className="lb-pod-avatar" style={{background: BGCOLS[pos], border: `2px solid ${COLORS[pos]}`}}>
                      {entry?.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="lb-pod-name" style={{color: isMe ? 'var(--primary-light)' : 'var(--text)'}}>
                      {entry?.username}{isMe ? ' (you)' : ''}
                    </div>
                    <div className="lb-pod-score" style={{color: COLORS[pos]}}>{entry?.score}</div>
                    <div className="lb-pod-medal">{MEDALS[pos]}</div>
                    <div className="lb-pod-bar" style={{background: COLORS[pos], height: pos === 0 ? '80px' : pos === 1 ? '60px' : '45px'}} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Full table */}
          <div className="lb-table">
            <div className="lb-thead">
              <span>Rank</span>
              <span>Player</span>
              <span>Score</span>
            </div>
            {data.map((entry, i) => {
              const isMe = entry.username === user?.username;
              const isTop = i < 3;
              return (
                <div key={entry.userId} className={`lb-row ${isTop ? 'lb-row-top' : ''} ${isMe ? 'lb-row-me' : ''}`}>
                  <span className="lb-rank">
                    {i < 3
                      ? <span className="lb-medal">{MEDALS[i]}</span>
                      : <span className="lb-rank-num">#{i+1}</span>
                    }
                  </span>
                  <span className="lb-player">
                    <div className="lb-avatar" style={{background: isTop ? BGCOLS[i] : 'var(--surface2)', color: isTop ? COLORS[i] : 'var(--text3)'}}>
                      {entry.username?.[0]?.toUpperCase()}
                    </div>
                    <span className="lb-uname">{entry.username}{isMe ? <span className="lb-you"> you</span> : ''}</span>
                  </span>
                  <span className="lb-score-val" style={{color: isTop ? COLORS[i] : 'var(--text2)'}}>
                    {entry.score} <span className="lb-pts">pts</span>
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
