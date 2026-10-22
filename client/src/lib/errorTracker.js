/**
 * Rankora Client Error Tracking & Diagnostic Monitoring
 */

class ErrorTracker {
  constructor() {
    this.breadcrumbs = [];
    this.maxBreadcrumbs = 25;
    this.initializeGlobalHandlers();
  }

  addBreadcrumb(category, message, metadata = {}) {
    this.breadcrumbs.push({
      category,
      message,
      metadata,
      timestamp: new Date().toISOString()
    });

    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }
  }

  initializeGlobalHandlers() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.captureException(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        { context: 'unhandled_promise_rejection' }
      );
    });
  }

  captureException(error, context = {}) {
    const errorId = `ERR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const report = {
      errorId,
      timestamp: new Date().toISOString(),
      name: error?.name || 'Error',
      message: error?.message || 'Unknown error occurred',
      stack: error?.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      breadcrumbs: [...this.breadcrumbs],
      context
    };

    console.error(`[ErrorTracker ${errorId}]`, report);

    return report;
  }
}

export const errorTracker = new ErrorTracker();
