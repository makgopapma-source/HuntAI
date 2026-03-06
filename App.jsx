import { useState, useRef } from "react";

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result.split(",")[1]);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const Tag = ({ text, color }) => (
  <span style={{ display: "inline-block", padding: "3px 11px", borderRadius: "4px", fontSize: "0.72rem", fontWeight: "700", background: color + "20", color, border: `1px solid ${color}40`, marginBottom: "5px", marginRight: "5px", letterSpacing: "0.3px" }}>{text}</span>
);

const ScoreBar = ({ score }) => {
  const color = score >= 75 ? "#22d3a5" : score >= 55 ? "#f0b429" : "#f87171";
  const label = score >= 75 ? "Strong Match" : score >= 55 ? "Good Match" : score >= 35 ? "Partial Match" : "Weak Match";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ flex: 1, height: "6px", background: "#1a2a3a", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: "3px", transition: "width 1s ease" }} />
      </div>
      <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.9rem", fontWeight: "700", color, minWidth: "32px" }}>{score}</div>
      <div style={{ fontSize: "0.7rem", color, fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", minWidth: "100px" }}>{label}</div>
    </div>
  );
};

const JobCard = ({ job, result, loading, index }) => {
  const [expanded, setExpanded] = useState(false);
  const color = result ? (result.score >= 75 ? "#22d3a5" : result.score >= 55 ? "#f0b429" : "#f87171") : "#2a3f55";

  return (
    <div style={{ background: "#0d1b2a", border: `1px solid ${expanded ? color + "60" : "#1a2e42"}`, borderRadius: "12px", overflow: "hidden", transition: "all 0.2s", animationDelay: `${index * 0.05}s`, animation: "slideUp 0.4s ease both" }}>
      <div style={{ padding: "20px 24px" }}>
        {/* Score bar */}
        {result && <div style={{ marginBottom: "14px" }}><ScoreBar score={result.score} /></div>}
        {loading && (
          <div style={{ marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: 1, height: "6px", background: "#1a2a3a", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, #1a2a3a, #2a4a6a, #1a2a3a)", backgroundSize: "200%", animation: "shimmer 1.5s infinite" }} />
            </div>
            <div style={{ fontSize: "0.75rem", color: "#3a5a7a", letterSpacing: "1px" }}>SCORING...</div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: "800", color: "#e2eeff", fontSize: "1rem", marginBottom: "4px", fontFamily: "'Syne', sans-serif" }}>{job.title}</div>
            <div style={{ fontSize: "0.82rem", color: "#4a6a8a", marginBottom: "6px" }}>
              <span style={{ color: "#6a9ab0" }}>{job.company?.display_name || "Company N/A"}</span>
              <span style={{ margin: "0 8px", color: "#2a4a5a" }}>·</span>
              {job.location?.display_name || "South Africa"}
              {job.salary_min && <>
                <span style={{ margin: "0 8px", color: "#2a4a5a" }}>·</span>
                <span style={{ color: "#22d3a5" }}>R{Math.round(job.salary_min / 1000)}k–R{Math.round(job.salary_max / 1000)}k/yr</span>
              </>}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#2a4a5a", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Syne Mono', monospace" }}>
              via {job._query}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <a href={job.redirect_url} target="_blank" rel="noreferrer"
              style={{ padding: "8px 16px", borderRadius: "8px", background: "#22d3a5", color: "#061220", fontSize: "0.78rem", fontWeight: "800", textDecoration: "none", letterSpacing: "0.5px", fontFamily: "'Syne', sans-serif" }}>
              Apply ↗
            </a>
            {result && (
              <button onClick={() => setExpanded(!expanded)}
                style={{ padding: "8px 16px", borderRadius: "8px", background: "transparent", color: "#4a6a8a", fontSize: "0.78rem", fontWeight: "700", border: "1px solid #1a2e42", cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
                {expanded ? "▲" : "▼"}
              </button>
            )}
          </div>
        </div>
      </div>

      {expanded && result && (
        <div style={{ borderTop: "1px solid #1a2e42", padding: "20px 24px", background: "#081422", animation: "fadeIn 0.2s ease" }}>
          <p style={{ fontSize: "0.85rem", color: "#8aaccc", lineHeight: "1.7", marginBottom: "18px", borderLeft: "3px solid #22d3a5", paddingLeft: "14px" }}>{result.summary}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "0.62rem", fontWeight: "800", letterSpacing: "2px", color: "#22d3a5", marginBottom: "8px", textTransform: "uppercase" }}>✓ Strengths</div>
              {result.strengths?.map((s, i) => <Tag key={i} text={s} color="#22d3a5" />)}
            </div>
            <div>
              <div style={{ fontSize: "0.62rem", fontWeight: "800", letterSpacing: "2px", color: "#f0b429", marginBottom: "8px", textTransform: "uppercase" }}>△ Gaps</div>
              {result.gaps?.map((g, i) => <Tag key={i} text={g} color="#f0b429" />)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.62rem", fontWeight: "800", letterSpacing: "2px", color: "#60a5fa", marginBottom: "8px", textTransform: "uppercase" }}>→ Interview Talking Points</div>
            {result.talkingPoints?.map((tp, i) => (
              <div key={i} style={{ fontSize: "0.82rem", color: "#8aaccc", padding: "9px 14px", borderRadius: "6px", background: "#0d1b2a", marginBottom: "6px", borderLeft: "2px solid #60a5fa" }}>
                {tp}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [cvFile, setCvFile] = useState(null);
  const [cvBase64, setCvBase64] = useState(null);
  const [cvText, setCvText] = useState("");
  const [cvMode, setCvMode] = useState("upload");
  const [dragging, setDragging] = useState(false);
  const [location, setLocation] = useState("Johannesburg");
  const [phase, setPhase] = useState("idle"); // idle | analyzing | results
  const [summary, setSummary] = useState("");
  const [queries, setQueries] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [scores, setScores] = useState({});
  const [scoringIds, setScoringIds] = useState(new Set());
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") { setError("Please upload a PDF file."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("File too large. Max 10MB."); return; }
    setError(null);
    setCvFile(file);
    setCvBase64(await fileToBase64(file));
  };

  const handleFindJobs = async () => {
    const hasCv = cvMode === "upload" ? cvBase64 : cvText.trim();
    if (!hasCv) { setError("Please upload your CV first."); return; }
    setError(null);
    setPhase("analyzing");
    setJobs([]); setScores({}); setSummary(""); setQueries([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, cvBase64: cvMode === "upload" ? cvBase64 : null, location }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setJobs(data.jobs);
      setSummary(data.summary);
      setQueries(data.queries);
      setPhase("results");

      // Score all jobs in parallel
      const ids = new Set(data.jobs.map((_, i) => i));
      setScoringIds(ids);
      await Promise.all(data.jobs.map(async (job, i) => {
        try {
          const r = await fetch("/api/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cvText, cvBase64: cvMode === "upload" ? cvBase64 : null, job }),
          });
          const result = await r.json();
          setScores(prev => ({ ...prev, [i]: result }));
        } catch {
          setScores(prev => ({ ...prev, [i]: { error: true } }));
        } finally {
          setScoringIds(prev => { const next = new Set(prev); next.delete(i); return next; });
        }
      }));
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      setPhase("idle");
    }
  };

  const sortedJobs = [...jobs].map((job, i) => ({ job, i, score: scores[i]?.score ?? -1 })).sort((a, b) => b.score - a.score);
  const hasCv = cvMode === "upload" ? cvBase64 : cvText.trim();

  return (
    <div style={{ minHeight: "100vh", background: "#061220", fontFamily: "'Syne', sans-serif", color: "#c8dff0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Syne+Mono&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input, textarea { font-family: 'DM Sans', sans-serif !important; }
        input::placeholder, textarea::placeholder { color: #2a4a5a; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #061220; } ::-webkit-scrollbar-thumb { background: #1a2e42; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <header style={{ padding: "32px 40px 28px", borderBottom: "1px solid #0d1e2e", background: "linear-gradient(180deg, #081a2c 0%, #061220 100%)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "1.7rem", fontWeight: "800", color: "#e2eeff", letterSpacing: "-1px" }}>
              HUNT<span style={{ color: "#22d3a5" }}>.</span>AI
            </div>
            <div style={{ fontSize: "0.78rem", color: "#2a5a7a", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Syne Mono', monospace" }}>SA Job Discovery · Powered by Claude AI</div>
          </div>
          {phase === "results" && (
            <button onClick={() => { setPhase("idle"); setJobs([]); setScores({}); }}
              style={{ padding: "8px 18px", borderRadius: "8px", background: "transparent", color: "#4a6a8a", fontSize: "0.78rem", fontWeight: "700", border: "1px solid #1a2e42", cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Syne Mono', monospace" }}>
              ← New Search
            </button>
          )}
        </div>
      </header>

      <main style={{ maxWidth: "880px", margin: "0 auto", padding: "40px 40px" }}>

        {/* IDLE / UPLOAD PHASE */}
        {phase === "idle" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            {/* Hero */}
            <div style={{ marginBottom: "40px", textAlign: "center" }}>
              <div style={{ fontSize: "2.8rem", fontWeight: "800", color: "#e2eeff", lineHeight: "1.15", marginBottom: "14px", letterSpacing: "-1.5px" }}>
                Upload your CV.<br />
                <span style={{ color: "#22d3a5" }}>We'll find your jobs.</span>
              </div>
              <div style={{ fontSize: "0.95rem", color: "#3a6a8a", maxWidth: "500px", margin: "0 auto", lineHeight: "1.6", fontFamily: "'DM Sans', sans-serif" }}>
                AI reads your CV, figures out what roles suit you, searches South African job boards, and ranks every match — automatically.
              </div>
            </div>

            {/* CV Upload Card */}
            <div style={{ background: "#0d1b2a", border: "1px solid #1a2e42", borderRadius: "16px", padding: "28px", marginBottom: "16px" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "3px", textTransform: "uppercase", color: "#22d3a5", marginBottom: "16px", fontFamily: "'Syne Mono', monospace" }}>Your CV</div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: "4px", marginBottom: "18px", background: "#061220", borderRadius: "8px", padding: "4px", width: "fit-content" }}>
                {[["upload", "📄 Upload PDF"], ["text", "✏️ Paste Text"]].map(([mode, label]) => (
                  <button key={mode} onClick={() => setCvMode(mode)} style={{ padding: "7px 18px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: "700", background: cvMode === mode ? "#1a2e42" : "transparent", color: cvMode === mode ? "#e2eeff" : "#3a5a7a", fontFamily: "'Syne', sans-serif", transition: "all 0.15s" }}>
                    {label}
                  </button>
                ))}
              </div>

              {cvMode === "upload" ? (
                <div>
                  <div
                    style={{ width: "100%", minHeight: "140px", border: `2px dashed ${dragging ? "#22d3a5" : "#1a2e42"}`, borderRadius: "12px", background: dragging ? "#22d3a508" : "#081422", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: "10px", transition: "all 0.2s" }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handleFileSelect(e.dataTransfer.files[0]); }}>
                    <div style={{ fontSize: "2rem" }}>📄</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: "700", color: dragging ? "#22d3a5" : "#3a5a7a" }}>{dragging ? "Drop it!" : "Click or drag your CV here"}</div>
                    <div style={{ fontSize: "0.72rem", color: "#1a3a5a" }}>PDF · max 10MB</div>
                  </div>
                  <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => handleFileSelect(e.target.files[0])} />
                  {cvFile && (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#22d3a510", border: "1px solid #22d3a530", borderRadius: "10px", padding: "12px 16px", marginTop: "12px" }}>
                      <span style={{ fontSize: "1.3rem" }}>✅</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#22d3a5", fontFamily: "'Syne', sans-serif" }}>{cvFile.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "#3a6a5a" }}>{(cvFile.size / 1024).toFixed(0)} KB · Ready to analyze</div>
                      </div>
                      <button onClick={() => { setCvFile(null); setCvBase64(null); }} style={{ background: "none", border: "none", color: "#2a5a4a", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  style={{ width: "100%", minHeight: "160px", background: "#081422", border: "1px solid #1a2e42", borderRadius: "10px", padding: "14px 16px", color: "#c8dff0", fontSize: "0.88rem", lineHeight: "1.65", resize: "vertical", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
                  placeholder="Paste your skills, experience, education..."
                  value={cvText} onChange={e => setCvText(e.target.value)}
                />
              )}
            </div>

            {/* Location + Button */}
            <div style={{ display: "flex", gap: "12px", alignItems: "stretch" }}>
              <div style={{ flex: 1, background: "#0d1b2a", border: "1px solid #1a2e42", borderRadius: "12px", padding: "16px 20px" }}>
                <div style={{ fontSize: "0.62rem", fontWeight: "800", letterSpacing: "2px", color: "#3a6a8a", marginBottom: "8px", textTransform: "uppercase", fontFamily: "'Syne Mono', monospace" }}>Location</div>
                <input
                  style={{ width: "100%", background: "transparent", border: "none", color: "#c8dff0", fontSize: "0.95rem", fontWeight: "600", outline: "none" }}
                  placeholder="e.g. Johannesburg, Cape Town..."
                  value={location} onChange={e => setLocation(e.target.value)}
                />
              </div>
              <button
                onClick={handleFindJobs}
                disabled={!hasCv}
                style={{ padding: "0 36px", borderRadius: "12px", border: "none", cursor: hasCv ? "pointer" : "not-allowed", fontSize: "0.95rem", fontWeight: "800", background: hasCv ? "linear-gradient(135deg, #22d3a5, #0ea5e9)" : "#0d1b2a", color: hasCv ? "#061220" : "#2a4a5a", fontFamily: "'Syne', sans-serif", letterSpacing: "0.5px", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                Find My Jobs →
              </button>
            </div>

            {error && <div style={{ background: "#f8717120", border: "1px solid #f8717140", borderRadius: "10px", padding: "12px 16px", color: "#f87171", fontSize: "0.85rem", marginTop: "14px", fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}
          </div>
        )}

        {/* ANALYZING PHASE */}
        {phase === "analyzing" && (
          <div style={{ textAlign: "center", padding: "80px 20px", animation: "fadeIn 0.4s ease" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: "3px solid #1a2e42", borderTop: "3px solid #22d3a5", animation: "spin 0.8s linear infinite", margin: "0 auto 28px" }} />
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#e2eeff", marginBottom: "10px" }}>Reading your CV...</div>
            <div style={{ fontSize: "0.88rem", color: "#3a6a8a", fontFamily: "'DM Sans', sans-serif" }}>AI is figuring out what roles suit you best, then searching South African job boards</div>
          </div>
        )}

        {/* RESULTS PHASE */}
        {phase === "results" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            {/* Profile summary */}
            <div style={{ background: "#0d1b2a", border: "1px solid #22d3a530", borderRadius: "12px", padding: "20px 24px", marginBottom: "28px", borderLeft: "4px solid #22d3a5" }}>
              <div style={{ fontSize: "0.62rem", fontWeight: "800", letterSpacing: "2px", color: "#22d3a5", marginBottom: "8px", textTransform: "uppercase", fontFamily: "'Syne Mono', monospace" }}>Your Profile</div>
              <div style={{ fontSize: "0.92rem", color: "#8aaccc", lineHeight: "1.6", marginBottom: "12px", fontFamily: "'DM Sans', sans-serif" }}>{summary}</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {queries.map((q, i) => <Tag key={i} text={`🔍 ${q}`} color="#0ea5e9" />)}
              </div>
            </div>

            {/* Results header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "3px", textTransform: "uppercase", color: "#3a6a8a", fontFamily: "'Syne Mono', monospace" }}>
                {jobs.length} Jobs Found
              </div>
              {scoringIds.size > 0
                ? <div style={{ fontSize: "0.72rem", color: "#3a6a8a", fontFamily: "'Syne Mono', monospace", animation: "pulse 1.5s infinite" }}>⏳ Scoring {scoringIds.size} jobs...</div>
                : <div style={{ fontSize: "0.72rem", color: "#22d3a5", fontFamily: "'Syne Mono', monospace" }}>✓ Sorted by best match</div>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {sortedJobs.map(({ job, i }, idx) => (
                <JobCard key={i} job={job} result={scores[i]} loading={scoringIds.has(i)} index={idx} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
