import { memo } from 'react';
import { Link } from 'react-router-dom';

function SkipNavigation() {
  return (
    <div className="skipper-ui">
      <a href="#main-content" className="skipper-link">
        Skip to main content
      </a>
      <Link to="/dashboard" replace className="skipper-link">
        Go to dashboard
      </Link>
    </div>
  );
}

export default memo(SkipNavigation);
