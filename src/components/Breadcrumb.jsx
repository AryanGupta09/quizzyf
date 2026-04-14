import { useLocation, Link } from 'react-router-dom';

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbName = (path) => {
    switch (path) {
      case 'quiz':
        return 'Quiz';
      case 'leaderboard':
        return 'Leaderboard';
      case 'login':
        return 'Login';
      case 'signup':
        return 'Sign Up';
      default:
        return path.charAt(0).toUpperCase() + path.slice(1);
    }
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumb">
      <div className="breadcrumb-container">
        <Link to="/" className="breadcrumb-item">Home</Link>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          return (
            <span key={name}>
              <span className="breadcrumb-separator">/</span>
              {isLast ? (
                <span className="breadcrumb-item active">{getBreadcrumbName(name)}</span>
              ) : (
                <Link to={routeTo} className="breadcrumb-item">
                  {getBreadcrumbName(name)}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}

export default Breadcrumb; 