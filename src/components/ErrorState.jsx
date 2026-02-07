const ErrorState = ({ error, onRetry }) => (
  <div className="error-container">
    <div className="error-icon">⚠️</div>
    <h2 className="error-title">Something went wrong</h2>
    <p className="error-message">
      {error || "We couldn't load the country data. Please check your connection and try again."}
    </p>
    <button className="error-retry-btn" onClick={onRetry}>
      🔄 Try Again
    </button>
  </div>
);

export default ErrorState;
