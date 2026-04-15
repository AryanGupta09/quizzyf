import { useState, useEffect } from 'react';
import { submissionsAPI } from '../utils/api';
import './HistoryPage.css';

const TOPIC_ICONS = {
  python: '🐍', java: '☕', 'c++': '⚙️', 'data-structures': '🌲',
  algorithms: '🔢', 'web-development': '🌐', databases: '🗄️',
  'computer-networks': '🔗', 'operating-systems': '💻', programming: '📝',
};

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // submission being reviewed
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    submissionsAPI.getMySubmissions()
      .then(data => setSubmissions(Array.isArray(data) ? data : []))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, []);

  const openReview = async (sub) => {
    if (!sub.reviewData || sub.reviewData.length === 0) {
      // No review data (old submission or DB quiz)
      setSelected({ ...sub, noReview: true });
      return;
    }
    setSelected(sub);
  };

  const closeReview = () => setSelected(null);

  if (loading) return (
    <div className="history-page">
      <div className="hist-loading"><div className="loading-spinner"></div></div>
    </div>
  );

  return (
    <div className="history-page">
      <div className="hist-header">
        <h1>📋 Quiz History</h1>
        <p>Review your past quizzes and see what you got wrong</p>
      </div>

      {submissions.length === 0 ? (
        <div className="hist-empty">
          <div style={{ fontSize: '3rem' }}>🎯</div>
          <h2>No quizzes yet</h2>
          <p>Complete a quiz to see your history here.</p>
        </div>
      ) : (
        <div className="hist-list">
          {submissions.map((sub, i) => {
            const icon = TOPIC_ICONS[sub.topic] || '📝';
            const total = sub.totalQuestions || 10;
            const pct = sub.topic ? Math.round((sub.score / total) * 100) : null;
            const scoreColor = pct !== null
              ? (pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444')
              : (sub.score >= 30 ? '#10b981' : sub.score >= 10 ? '#f59e0b' : '#ef4444');
            const hasReview = sub.reviewData && sub.reviewData.length > 0;

            return (
              <div key={sub._id} className="hist-card">
                <div className="hist-card-left">
                  <div className="hist-icon">{icon}</div>
                  <div>
                    <div className="hist-topic">
                      {sub.topic ? sub.topic.replace(/-/g, ' ') : 'General Quiz'}
                      {sub.difficulty && <span className="hist-diff">{sub.difficulty}</span>}
                    </div>
                    <div className="hist-date">
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      }) : ''}
                    </div>
                  </div>
                </div>
                <div className="hist-card-right">
                  <div className="hist-score" style={{ color: scoreColor }}>
                    {pct !== null ? `${sub.score}/${total}` : `${sub.score} pts`}
                  </div>
                  {hasReview ? (
                    <button className="btn btn-ghost hist-review-btn" onClick={() => openReview(sub)}>
                      Review →
                    </button>
                  ) : (
                    <span className="hist-no-review">No review</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {selected && (
        <div className="hist-modal-overlay" onClick={closeReview}>
          <div className="hist-modal" onClick={e => e.stopPropagation()}>
            <div className="hist-modal-header">
              <div>
                <h2>{TOPIC_ICONS[selected.topic] || '📝'} {selected.topic ? selected.topic.replace(/-/g, ' ') : 'Quiz'} Review</h2>
                <p className="hist-modal-sub">
                  Score: {selected.score}/{selected.totalQuestions || selected.reviewData?.length || 0} &nbsp;·&nbsp;
                  {selected.submittedAt ? new Date(selected.submittedAt).toLocaleDateString() : ''}
                </p>
              </div>
              <button className="hist-close-btn" onClick={closeReview}>✕</button>
            </div>

            {selected.noReview ? (
              <div className="hist-no-review-msg">Review data not available for this quiz.</div>
            ) : (
              <div className="hist-questions">
                {selected.reviewData.map((item, idx) => (
                  <div key={idx} className={`hist-q-card ${item.is_correct ? 'correct' : 'wrong'}`}>
                    <div className="hist-q-num">
                      <span className={`hist-q-badge ${item.is_correct ? 'badge-correct' : 'badge-wrong'}`}>
                        {item.is_correct ? '✓' : '✗'}
                      </span>
                      Q{idx + 1}
                    </div>
                    <div className="hist-q-text">{item.question}</div>
                    <div className="hist-options-review">
                      {item.options.map((opt, oi) => {
                        const optNorm = opt.toLowerCase().trim();
                        const correctNorm = (item.correct_answer || '').toLowerCase().trim();
                        const userNorm = (item.user_answer || '').toLowerCase().trim();
                        const isCorrect = optNorm === correctNorm;
                        const isUser = userNorm && optNorm === userNorm;
                        let cls = 'hist-opt';
                        if (isCorrect) cls += ' hist-opt-correct';
                        else if (isUser && !isCorrect) cls += ' hist-opt-wrong';
                        return (
                          <div key={oi} className={cls}>
                            {opt}
                            {isCorrect && <span className="hist-opt-tag">✓ Correct</span>}
                            {isUser && !isCorrect && <span className="hist-opt-tag">Your answer</span>}
                            {isUser && isCorrect && <span className="hist-opt-tag">✓ Your answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    {!item.user_answer && (
                      <div className="hist-skipped">⏭ Skipped / Timed out</div>
                    )}
                    {item.explanation && (
                      <div className="hist-explanation">
                        <strong>💡 Why:</strong> {item.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
