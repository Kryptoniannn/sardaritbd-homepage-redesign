import { Component, StrictMode, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

class RootBoundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state: { err: Error | null } = { err: null };

  static getDerivedStateFromError(err: Error) {
    return { err };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error("Recovered UI error:", err, info);
  }

  render() {
    if (this.state.err) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#04050c] p-8 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#ffd000]">Sardar IT</p>
          <h1 className="font-display mt-3 text-3xl font-extrabold">Reloading Experience</h1>
          <button
            type="button"
            onClick={() => this.setState({ err: null })}
            className="mt-6 rounded-full bg-[#1946e0] px-6 py-3 text-sm font-bold text-white"
          >
            Continue
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootBoundary>
      <App />
    </RootBoundary>
  </StrictMode>
);
