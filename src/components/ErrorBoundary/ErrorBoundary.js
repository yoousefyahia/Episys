'use client';

import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">عذراً، حدث خطأ ما</h2>
            <p className="error-message">
              حدث خطأ غير متوقع. يرجى تحديث الصفحة أو المحاولة مرة أخرى.
            </p>
            <div className="error-actions">
              <button 
                className="error-button primary"
                onClick={() => window.location.reload()}
              >
                تحديث الصفحة
              </button>
              <button 
                className="error-button secondary"
                onClick={() => this.setState({ hasError: false })}
              >
                المحاولة مرة أخرى
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>تفاصيل الخطأ (للمطورين)</summary>
                <pre className="error-stack">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 