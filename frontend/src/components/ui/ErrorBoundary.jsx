import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
          <div className="text-center max-w-md animate-fade-in-up">
            <div className="w-20 h-20 bg-danger-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertTriangle className="w-10 h-10 text-danger-500" />
            </div>

            <h1 className="text-2xl font-bold text-surface-900 mb-2 font-[var(--font-display)]">
              Something went wrong
            </h1>

            <p className="text-surface-700/70 mb-8">
              An unexpected error occurred. Don't worry, your data is safe.
              Try refreshing the page or go back to the home page.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-[var(--radius-button)] font-medium hover:bg-primary-700 transition-colors cursor-pointer"
              >
                <FiRefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-200 text-surface-700 rounded-[var(--radius-button)] font-medium hover:bg-surface-300 transition-colors cursor-pointer"
              >
                <FiHome className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
