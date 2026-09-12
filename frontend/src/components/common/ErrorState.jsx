import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const ErrorState = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-16 h-16 bg-danger-500/10 rounded-full flex items-center justify-center mb-4">
        <FiAlertCircle className="w-8 h-8 text-danger-500" />
      </div>

      <h3 className="text-lg font-semibold text-surface-900 mb-2">
        Oops! Something went wrong
      </h3>

      <p className="text-surface-700/60 text-center max-w-sm mb-6">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-[var(--radius-button)] font-medium hover:bg-primary-700 transition-colors cursor-pointer"
        >
          <FiRefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
