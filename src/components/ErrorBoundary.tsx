import React from 'react';

interface State {
  hasError: boolean;
  message?: string;
}

interface Props {
  children?: React.ReactNode;
}
export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Readonly<Props>;
  state: State = { hasError: false };

  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, message: err instanceof Error ? err.message : String(err) };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error('[BidSure] Unhandled render error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
          <div className="max-w-lg w-full bg-surface-container-lowest rounded-xl border border-error/20 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-error mb-2">
              <span className="material-symbols-outlined">error</span>
              <h1 className="font-title-lg font-bold">Something went wrong</h1>
            </div>
            <p className="text-sm text-on-surface-variant mb-3">
              The verification hub encountered an unexpected error. Your session data is still in memory – try reloading.
            </p>
            {this.state.message && (
              <pre className="text-xs bg-surface-container p-3 rounded overflow-auto max-h-40 font-code-num">{this.state.message}</pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container"
              type="button"
            >
              Reload application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
