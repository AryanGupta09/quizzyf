import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { submissionsAPI, aiAPI } from '../utils/api';
import './QuizPage.css';

const norm = s => (s || '').toString().trim().toLowerCase();

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function QuizPage() {
  const [questions, setQuestions]               = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer]     = useState(null);
  const [timeLeft, setTimeLeft]                 = useState(30);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState('');
  const [quizCompleted, setQuizCompleted]       = useState(false);
  const [score, setScore]                       = useState(0);
  const navigate  = useNavigate();
  const { topic, difficulty } = useParams();
  const answersRef = useRef({});

  useEffect(() => {
    if (!topic || !difficulty) { navigate('/quizzes'); return; }
    aiAPI.generateQuestions(topic, difficulty, 10)
      .then(data => {
        if (!data.questions || !Array.isArray(data.questions)) {
          setError('Invalid response from AI. Please try again.');
          setLoading(false);
          return;
        }
        const qs = data.questions.map((q, idx) => ({
          _id: `ai-${idx}`,
          question: q.question,
          options: shuffleArray(q.options).map(o => ({ display: o, value: norm(o) })),
          correct_answer: norm(q.correct_answer),
          explanation: q.explanation || '',
        }));
        setQuestions(qs);
        setTimeLeft(30);
        setLoading(false);
      })
      .catch(() => {
        setError('AI question generation failed. Please try again.');
        setLoading(false);
      });
  }, [topic, difficulty]);

  useEffect(() => {
    if (loading || questions.length === 0 || quizCompleted) return;
    if (timeLeft <= 0) { handleNextQuestion(); return; }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, quizCompleted, loading, questions.length]);

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const q = questions[currentQuestionIndex];
      answersRef.current = { ...answersRef.current, [q._id]: selectedAnswer };
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      finishQuiz(selectedAnswer);
    }
  };

  const finishQuiz = async (lastAnswer = null) => {
    const finalAnswer = lastAnswer ?? selectedAnswer;
    if (finalAnswer !== null) {
      const q = questions[currentQuestionIndex];
      answersRef.current = { ...answersRef.current, [q._id]: finalAnswer };
    }
    const allAnswers = { ...answersRef.current };
    setQuizCompleted(true);

    let localScore = 0;
    const reviewDataPromises = questions.map(async q => {
      const userAnswer = allAnswers[q._id];
      const isCorrect = !!userAnswer && norm(userAnswer) === norm(q.correct_answer);
      if (isCorrect) localScore++;
      let explanation = q.explanation || '';
      if (!isCorrect && userAnswer) {
        try {
          const exp = await aiAPI.getExplanation(q.question, q.correct_answer, userAnswer);
          explanation = exp.explanation || explanation;
        } catch { /* use default */ }
      }
      return {
        question: q.question,
        options: q.options.map(o => (typeof o === 'object' ? o.display : o)),
        correct_answer: q.correct_answer,
        user_answer: userAnswer || '',
        is_correct: isCorrect,
        explanation,
      };
    });

    const reviewData = await Promise.all(reviewDataPromises);
    setScore(localScore);

    try {
      if (localStorage.getItem('token')) {
        await submissionsAPI.submitAiScore(localScore, topic, difficulty, questions.length, reviewData);
      }
    } catch { /* silently fail */ }
  };

  if (loading) return (
    <div className="quiz-container">
      <div className="loading"><div className="loading-spinner" /><span>Generating questions...</span></div>
    </div>
  );

  if (error) return (
    <div className="quiz-container">
      <div className="error-message">{error}</div>
      <button className="btn btn-primary" style={{marginTop:'1rem'}} onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  if (quizCompleted) {
    const pct   = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <h2>Quiz Completed!</h2>
          <div className="score-display">
            <div className="score-circle" style={{ borderColor: color, color }}>
              {score}/{questions.length}
            </div>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{pct}% correct</p>
          </div>
          <div className="result-buttons">
            <button className="btn btn-primary"   onClick={() => navigate('/leaderboard')}>View Leaderboard</button>
            <button className="btn btn-secondary" onClick={() => navigate('/quizzes')}>More Quizzes</button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-page">
      <div className="quiz-flex-layout">
        <div className="quiz-main">
          <div className="question-card">
            <h2 className="question-text">{currentQuestion.question}</h2>
            <div className="options">
              {currentQuestion.options.map((option, index) => {
                const display = option.display;
                const value   = option.value;
                return (
                  <button
                    key={index}
                    className={`option-btn ${selectedAnswer === value ? 'selected' : ''}`}
                    onClick={() => setSelectedAnswer(value)}
                    data-letter={String.fromCharCode(65 + index)}
                  >
                    {display}
                  </button>
                );
              })}
            </div>
            <div className="quiz-controls">
              <button className="btn btn-primary" onClick={handleNextQuestion} disabled={selectedAnswer === null}>
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
        <aside className="quiz-sidebar">
          <button className="btn btn-danger finish-btn" onClick={() => finishQuiz()} disabled={quizCompleted}
            style={{ marginBottom: '1rem', width: '100%' }}>
            Finish Quiz
          </button>
          <div className="sidebar-timer">
            <span className="timer-label">Time Left</span>
            <div className="sidebar-timer-value" style={{ color: timeLeft <= 10 ? '#ef4444' : undefined }}>
              {timeLeft}s
            </div>
          </div>
          <div className="sidebar-progress">
            <span className="progress-label">Question</span>
            <div className="sidebar-progress-value">{currentQuestionIndex + 1} / {questions.length}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default QuizPage;
