import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type GitHubRepo = {
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  languages: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  defaultBranch: string;
  readme: string | null;
  topics: string[];
};

type JobPosting = {
  url: string;
  title: string;
  company: string | null;
  description: string;
  requirements: string[];
  skills: string[];
  experienceLevel: string | null;
  rawText: string;
};

function getApiBase() {
  return (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";
}

export function ReadmeGenerator() {
  const defaultRepo = useMemo<GitHubRepo>(
    () => ({
      name: "your-repo",
      fullName: "org/your-repo",
      htmlUrl: "https://github.com/org/your-repo",
      description: "Short, factual description here.",
      languages: ["TypeScript"],
      stars: 0,
      forks: 0,
      updatedAt: new Date().toISOString(),
      defaultBranch: "main",
      readme: null,
      topics: ["developer-tools"]
    }),
    []
  );

  const defaultJob = useMemo<JobPosting>(
    () => ({
      url: "https://example.com/job-posting",
      title: "Software Engineer",
      company: null,
      description: "Paste the job description here.",
      requirements: ["Example requirement 1", "Example requirement 2"],
      skills: ["TypeScript", "Node.js"],
      experienceLevel: null,
      rawText: "Paste the raw job posting text here (optional)."
    }),
    []
  );

  const [repoJson, setRepoJson] = useState(() => JSON.stringify(defaultRepo, null, 2));
  const [jobJson, setJobJson] = useState(() => JSON.stringify(defaultJob, null, 2));
  const [currentReadme, setCurrentReadme] = useState("");

  const [generatedReadme, setGeneratedReadme] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onGenerate() {
    setError(null);
    setWarnings([]);
    setLoading(true);
    setGeneratedReadme("");

    try {
      const repo = JSON.parse(repoJson) as GitHubRepo;
      const job = JSON.parse(jobJson) as JobPosting;

      const resp = await fetch(`${getApiBase()}/generate-readme`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          repo,
          currentReadme: currentReadme.trim() ? currentReadme : null,
          job
        })
      });

      const payload = (await resp.json()) as
        | { success: true; data: { generatedReadme: string; warnings: string[] } }
        | { success: false; error: string };

      if (!payload.success) throw new Error(payload.error);
      setGeneratedReadme(payload.data.generatedReadme);
      setWarnings(payload.data.warnings ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate README.");
    } finally {
      setLoading(false);
    }
  }

  async function onCopy() {
    await navigator.clipboard.writeText(generatedReadme);
  }

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Inputs</h2>

        <div className="muted" style={{ marginBottom: 10 }}>
          This UI is a thin wrapper around <code>POST /api/generate-readme</code>.
        </div>

        <div style={{ marginBottom: 12 }}>
          <div className="muted" style={{ marginBottom: 6 }}>
            Repo data (JSON)
          </div>
          <textarea value={repoJson} onChange={(e) => setRepoJson(e.target.value)} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div className="muted" style={{ marginBottom: 6 }}>
            Target job (JSON)
          </div>
          <textarea value={jobJson} onChange={(e) => setJobJson(e.target.value)} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div className="muted" style={{ marginBottom: 6 }}>
            Current README (optional)
          </div>
          <textarea
            value={currentReadme}
            onChange={(e) => setCurrentReadme(e.target.value)}
            placeholder="Paste existing README.md here (or leave empty)."
          />
        </div>

        <div className="row">
          <button onClick={onGenerate} disabled={loading}>
            {loading ? "Generating…" : "Generate README"}
          </button>
          {generatedReadme ? (
            <button onClick={onCopy} disabled={!generatedReadme}>
              Copy generated README
            </button>
          ) : null}
        </div>

        {error ? <div className="error" style={{ marginTop: 12 }}>{error}</div> : null}

        {warnings.length ? (
          <div style={{ marginTop: 12 }}>
            <div className="warn" style={{ fontWeight: 700, marginBottom: 6 }}>
              Warnings
            </div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {warnings.map((w) => (
                <li key={w} className="warn">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Preview (old vs new)</h2>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <div className="muted" style={{ marginBottom: 6 }}>
              Current README
            </div>
            <div className="preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {currentReadme.trim() ? currentReadme : "_(none provided)_"}
              </ReactMarkdown>
            </div>
          </div>

          <div>
            <div className="muted" style={{ marginBottom: 6 }}>
              Generated README
            </div>
            <div className="preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {generatedReadme.trim() ? generatedReadme : "_(generate to preview)_"}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {generatedReadme ? (
          <div style={{ marginTop: 14 }}>
            <div className="muted" style={{ marginBottom: 6 }}>
              Generated Markdown (copy/paste)
            </div>
            <textarea value={generatedReadme} readOnly />
          </div>
        ) : null}
      </div>
    </div>
  );
}

