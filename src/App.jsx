import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home.jsx';
import Landing from './pages/Landing.jsx';
import QuizPage from './pages/QuizPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import QuizzesPage from './pages/QuizzesPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';

function AuthenticatedApp() {
  const { user, logout } = useAuth();
  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand"><Link to="/">⚡ Quizzy</Link></div>
        <div className="nav-links">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/quizzes">Quizzes</NavLink>
          <NavLink to="/history">History</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <div className="user-menu">
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <span>{user?.username}</span>
            <button onClick={logout} className="btn btn-ghost" style={{fontSize:'0.8rem',padding:'0.35rem 0.75rem'}}>Sign out</button>
          </div>
        </div>
      </nav>
      <main className="main-content" style={{ paddingTop: '72px' }}>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/quizzes"    element={<QuizzesPage />} />
          <Route path="/history"    element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/quiz/:topic/:difficulty" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="*"           element={<Home />} />
        </Routes>
      </main>
      <footer className="landing-footer">
        © {new Date().getFullYear()} Quizzy
      </footer>
    </div>
  );
}

function UnauthenticatedApp() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand"><Link to="/">⚡ Quizzy</Link></div>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup" className="btn btn-primary" style={{ marginLeft: '0.5rem' }}>Sign Up</Link>
        </div>
      </nav>
      <main className="main-content" style={{ paddingTop: '60px' }}>
        <Routes>
          <Route path="/"       element={<Landing />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*"       element={<Landing />} />
        </Routes>
      </main>
      <footer className="landing-footer">
        © {new Date().getFullYear()} Quizzy
      </footer>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading">
      <div className="loading-spinner" />
    </div>
  );
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
