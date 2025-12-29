import { ReadmeGenerator } from "./components/ReadmeGenerator";

export function App() {
  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: "0 0 6px 0" }}>ReadyRepo — README Generator</h1>
        <div className="muted">
          Paste repo + job context, generate an enhanced README, compare side-by-side, and copy it.
        </div>
      </div>

      <ReadmeGenerator />
    </div>
  );
}

