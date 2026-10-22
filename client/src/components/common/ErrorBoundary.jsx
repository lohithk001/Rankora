import React from 'react';
import { AlertTriangle, RotateCcw, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { errorTracker } from '../../lib/errorTracker';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorReport: null,
      copied: false,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const report = errorTracker.captureException(error, { componentStack: errorInfo?.componentStack });
    this.setState({ errorInfo, errorReport: report });
  }

  handleCopyReport = () => {
    const data = JSON.stringify(this.state.errorReport || { message: this.state.error?.message }, null, 2);
    navigator.clipboard.writeText(data).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    });
  };

  render() {
    if (this.state.hasError) {
      const errorId = this.state.errorReport?.errorId || 'ERR-UNKNOWN';

      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6 text-center font-sans">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF5] shadow-xl space-y-5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE8E5] border border-[#FFD3CE] flex items-center justify-center text-[#D93829]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-[#D93829] bg-[#FFE8E5] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Diagnostic Alert
                </span>
                <span className="text-[11px] font-mono text-[#687793]">
                  ID: {errorId}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-[#15264B] tracking-tight">
                Something went wrong
              </h2>
              <p className="text-xs sm:text-sm text-[#687793] mt-1 leading-relaxed">
                Rankora encountered an unexpected view error. Your data and verified rankings are completely safe.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] font-mono text-xs text-[#15264B] overflow-x-auto">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>

            {/* Collapsible Details */}
            <div>
              <button
                type="button"
                onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
              >
                <span>{this.state.showDetails ? 'Hide Technical Details' : 'Show Technical Details'}</span>
                {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {this.state.showDetails && (
                <pre className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-48 leading-tight">
                  {this.state.error?.stack || this.state.errorInfo?.componentStack || 'No stack trace available'}
                </pre>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E2EAF5]">
              <button
                type="button"
                onClick={this.handleCopyReport}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#687793] hover:text-[#15264B] px-3 py-2 rounded-xl hover:bg-[#F5F8FF] transition cursor-pointer"
              >
                {this.state.copied ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{this.state.copied ? 'Diagnostics Copied!' : 'Copy Diagnostics'}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href="/"
                  className="px-4 py-2 rounded-xl border border-[#E2EAF5] text-xs font-semibold text-[#15264B] hover:bg-[#F5F8FF] transition"
                >
                  Return Home
                </a>
                <button
                  type="button"
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    window.location.reload();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reload Application</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
