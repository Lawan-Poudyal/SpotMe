import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const RouterErrorElement = ({ error = new Error('Something went wrong'), showDetails = true }) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const getErrorMessage = (error) => {
    if (error?.message) return error.message;
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred';
  };

  const getErrorDetails = (error) => {
    if (error?.stack) return error.stack;
    if (error?.toString && typeof error.toString === 'function') {
      return error.toString();
    }
    return JSON.stringify(error, null, 2);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center shadow-xl">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full border border-red-800/30 bg-red-900/20 p-4">
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="mb-3 text-2xl font-bold text-gray-100">Oops! Something went wrong</h1>

          {/* Error Message */}
          <p className="mb-6 leading-relaxed text-gray-300">{getErrorMessage(error)}</p>

          {/* Error Details Toggle */}
          {showDetails && (
            <div className="border-t border-gray-700 pt-6">
              <button
                onClick={() => setShowErrorDetails(!showErrorDetails)}
                className="inline-flex items-center rounded text-sm text-gray-400 transition-colors duration-200 hover:text-gray-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
              >
                {showErrorDetails ? (
                  <>
                    <ChevronUp className="mr-1 h-4 w-4" />
                    Hide Error Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 h-4 w-4" />
                    Show Error Details
                  </>
                )}
              </button>

              {showErrorDetails && (
                <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900/50 p-4 text-left">
                  <pre className="overflow-x-auto text-xs break-words whitespace-pre-wrap text-gray-300">
                    {getErrorDetails(error)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            If this problem persists, please contact support or try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
};
export default RouterErrorElement;
