import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Rankora UI caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Rendering Notice
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              A temporary issue occurred while rendering this section:
            </p>
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-rose-300 text-left overflow-x-auto">
              {this.state.error?.message || 'Unknown error'}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="btn-primary !text-xs !py-2 !px-4 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Rankora</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
