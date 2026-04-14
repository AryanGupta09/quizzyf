import { useNavigate } from 'react-router-dom';
import './QuizzesPage.css';

const COURSES = [
  {
    topic: 'python',
    icon: '🐍',
    title: 'Python',
    desc: 'Variables, OOP, decorators, async and everything in between.',
    color: '#3b82f6',
  },
  {
    topic: 'java',
    icon: '☕',
    title: 'Java',
    desc: 'Core Java, OOP, collections, multithreading and JVM internals.',
    color: '#f59e0b',
  },
  {
    topic: 'c++',
    icon: '⚙️',
    title: 'C++',
    desc: 'Pointers, STL, memory management and advanced templates.',
    color: '#8b5cf6',
  },
  {
    topic: 'data-structures',
    icon: '🌲',
    title: 'Data Structures',
    desc: 'Arrays, linked lists, trees, graphs, heaps and tries.',
    color: '#10b981',
  },
  {
    topic: 'algorithms',
    icon: '🔢',
    title: 'Algorithms',
    desc: 'Sorting, searching, dynamic programming and graph algorithms.',
    color: '#ef4444',
  },
  {
    topic: 'web-development',
    icon: '🌐',
    title: 'Web Development',
    desc: 'HTML, CSS, JavaScript, REST APIs and modern frameworks.',
    color: '#06b6d4',
  },
  {
    topic: 'databases',
    icon: '🗄️',
    title: 'Databases',
    desc: 'SQL, normalization, indexing, NoSQL and transactions.',
    color: '#f97316',
  },
  {
    topic: 'computer-networks',
    icon: '🔗',
    title: 'Computer Networks',
    desc: 'OSI model, TCP/IP, DNS, routing and network security.',
    color: '#ec4899',
  },
  {
    topic: 'operating-systems',
    icon: '💻',
    title: 'Operating Systems',
    desc: 'Processes, scheduling, memory management and deadlocks.',
    color: '#14b8a6',
  },
  {
    topic: 'programming',
    icon: '📝',
    title: 'Programming Concepts',
    desc: 'OOP, recursion, design patterns and SOLID principles.',
    color: '#a855f7',
  },
];

const DIFFICULTIES = [
  { label: 'Beginner',     value: 'easy',   icon: '🟢', desc: 'Basic concepts' },
  { label: 'Intermediate', value: 'medium', icon: '🟡', desc: 'Core knowledge' },
  { label: 'Advanced',     value: 'hard',   icon: '🔴', desc: 'Deep dive' },
];

export default function QuizzesPage() {
  const navigate = useNavigate();

  return (
    <div className="qp-page">
      <div className="qp-header">
        <h1>Choose a Course</h1>
        <p>Pick a topic and difficulty — AI generates 10 fresh questions every time.</p>
      </div>

      <div className="qp-grid">
        {COURSES.map(course => (
          <div key={course.topic} className="qp-card" style={{ '--qc': course.color }}>
            <div className="qp-card-top">
              <div className="qp-icon-wrap" style={{ background: course.color + '22', color: course.color }}>
                {course.icon}
              </div>
              <div className="qp-card-info">
                <h3 className="qp-title">{course.title}</h3>
                <p className="qp-desc">{course.desc}</p>
              </div>
            </div>

            <div className="qp-divider" />

            <div className="qp-difficulties">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff.value}
                  className="qp-diff-btn"
                  onClick={() => navigate(`/quiz/${course.topic}/${diff.value}`)}
                >
                  <span className="qp-diff-icon">{diff.icon}</span>
                  <span className="qp-diff-label">{diff.label}</span>
                  <span className="qp-diff-desc">{diff.desc}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
