import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router";

const FETCH_TIMEOUT_MS = 6000;
const DEFAULT_BACKEND_URL = "https://reply-pilot-backend-379609448905.asia-south1.run.app";

/* ---------------- types ---------------- */

type HealthState = "connecting" | "online" | "offline";

interface ActivityItem {
  id: string;
  author: string;
  message: string;
  time: string;
}

interface LatestReplyRecord {
  _id?: {
    $oid?: string;
  };
  sender?: string;
  subject?: string;
  createdAt?: {
    $date?: string;
  } | string;
}

export interface ReplyPilotLandingProps {
  /** Base URL of the backend. Defaults to DEFAULT_BACKEND_URL above. */
  backendUrl?: string;
}

/* ---------------- fetch helper with timeout ---------------- */

async function fetchJSON<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

function buildBackendUrl(path: string, backendUrl?: string): string {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const trimmedBackendUrl = backendUrl?.trim();

  if (!trimmedBackendUrl) {
    return `/${normalizedPath}`;
  }

  const cleanBackendUrl = trimmedBackendUrl.endsWith("/") ? trimmedBackendUrl.slice(0, -1) : trimmedBackendUrl;
  return `${cleanBackendUrl}/${normalizedPath}`;
}

async function pingBackend(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json,text/plain" },
    });

    if (!res.ok) {
      return false;
    }

    const rawText = await res.text();
    if (!rawText) {
      return true;
    }

    try {
      const parsed = JSON.parse(rawText);
      if (typeof parsed === "string") {
        return parsed.trim().toLowerCase() === "ok";
      }
      if (typeof parsed === "object" && parsed !== null) {
        const status = (parsed as { status?: unknown }).status;
        if (typeof status === "string") {
          return status.trim().toLowerCase() === "ok";
        }
        if (typeof status === "boolean") {
          return status;
        }
      }
    } catch {
      // fall back to plain text if JSON parsing fails
    }

    return rawText.trim().toLowerCase() === "ok";
  } finally {
    clearTimeout(timer);
  }
}

function initials(name: string): string {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatReplyTime(timestamp?: string | { $date?: string }): string {
  const raw = typeof timestamp === "string" ? timestamp : timestamp?.$date;
  if (!raw) return "just now";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "just now";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/* ================================================================
   Component
   ================================================================ */

export default function ReplyPilotLanding({ backendUrl }: ReplyPilotLandingProps = {}) {
  const [healthState, setHealthState] = useState<HealthState>("connecting");
  const [statusReason, setStatusReason] = useState<string>("Checking backend availability…");

  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [activityLive, setActivityLive] = useState(false);

  const [showTopBtn, setShowTopBtn] = useState(false);

  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const pingUrl = buildBackendUrl("/ping", backendUrl || DEFAULT_BACKEND_URL);
  const activityUrl = buildBackendUrl("/latest-replies", backendUrl || DEFAULT_BACKEND_URL);

  /* ---------------- health check ---------------- */
  const checkHealth = useCallback(async () => {
    setHealthState("connecting");
    setStatusReason("Checking backend availability…");

    try {
      const isReachable = await pingBackend(pingUrl);
      if (isReachable) {
        setHealthState("online");
        setStatusReason("Backend is responding with 200 OK");
      } else {
        setHealthState("offline");
        setStatusReason("Backend is unreachable right now");
      }
    } catch (error) {
      setHealthState("offline");
      setStatusReason(error instanceof Error ? error.message : "Backend is unreachable right now");
    }
  }, [pingUrl]);

  /* ---------------- activity loading ---------------- */
  const loadActivity = useCallback(async () => {
    try {
      const data = await fetchJSON<LatestReplyRecord[]>(activityUrl);
      const items = (Array.isArray(data) ? data : [])
        .map((item, index) => ({
          id: item._id?.$oid || `reply-${index}-${item.sender || "unknown"}`,
          author: item.sender || "Reply Pilot",
          message: item.subject || "Reply sent",
          time: formatReplyTime(item.createdAt),
        }))
        .filter((item) => item.author || item.message);

      setActivityItems(items);
      setActivityLive(items.length > 0);
    } catch {
      setActivityItems([]);
      setActivityLive(false);
    }
  }, [activityUrl]);

  useEffect(() => {
    void checkHealth();
    void loadActivity();
  }, [checkHealth, loadActivity]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  /* ---------------- back-to-top visibility ---------------- */
  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- custom cursor (desktop only) ---------------- */
  useEffect(() => {
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      ring.classList.toggle("rp-active", !!target.closest("a, button, .rp-card"));
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  const doubledItems = activityItems.length > 0 ? [...activityItems, ...activityItems] : [];
  const scrollDuration = Math.max(activityItems.length * 3.2, 10);

  return (
    <div className="rp-root">
      <style>{CSS}</style>

      <div ref={cursorRingRef} id="rp-cursor-ring" />
      <div ref={cursorDotRef} id="rp-cursor-dot" />

      <header className="rp-header">
        <div className="rp-nav">
          <button type="button" className="rp-logo" onClick={scrollToTop}>
            <span className="rp-logo-mark" />
            Reply Pilot
          </button>
          <nav className="rp-nav-links">
            <Link to="/replypilot-docs" className="rp-nav-docs">Docs</Link>
          </nav>
        </div>
      </header>

      <main>
        <div ref={topRef} id="rp-top" />

        {/* ============== SLIDE 1 — HERO ============== */}
        <section className="rp-slide" id="rp-hero">
          <div className="rp-blob-layer" aria-hidden="true">
            <span className="rp-blob rp-blob-rust rp-blob-a" />
            <span className="rp-blob rp-blob-olive rp-blob-b" />
            <span className="rp-blob rp-blob-clay rp-blob-c" />
          </div>
          <div className="rp-wrap">
            <div className="rp-hero-grid">
              <div>
                <div className="rp-eyebrow">Customer care mail automation, run for you</div>
                <h1>
                  We run your customer
                  <br />
                  care inbox <em>for you.</em>
                </h1>
                <p className="rp-lede">
                  Reply Pilot is a fully managed customer care mail system — we operate it as
                  your support backend. Every incoming query is read, matched against your
                  policies through our RAG pipeline, and answered in your voice, so your team
                  only steps in when a conversation truly needs a person.
                </p>

                <div className="rp-try-it-box">
                  <div className="rp-try-it-label">See the magic yourself</div>
                  <p>
                    Send us a real customer-care style email — a refund request, a login
                    problem, a registration query, anything — and watch Reply Pilot draft the
                    reply.
                  </p>
                  <a
                    className="rp-try-it-email"
                    href="mailto:customer.replypilot@gmail.com?subject=Sample%20customer%20care%20query"
                  >
                    customer.replypilot@gmail.com
                  </a>
                  <div className="rp-try-it-note">No setup needed to try it — just send the mail.</div>
                </div>
              </div>

              {/* LIVE BACKEND STATUS CARD */}
              <div className="rp-status-card">
                <div className="rp-status-head">
                  <span className="rp-status-title">Backend status</span>
                  <span className="rp-mono rp-status-url">/ping</span>
                </div>

                <div className="rp-status-liquid">
                  <div className="rp-status-row">
                    <span className={`rp-dot rp-pulsing rp-state-${healthState}`} />
                    <div>
                      <div className="rp-status-label">
                        {healthState === "online"
                          ? "Operational"
                          : healthState === "offline"
                          ? "Unreachable"
                          : "Connecting…"}
                      </div>
                      <div className="rp-status-sub">{statusReason}</div>
                    </div>
                  </div>
                </div>

                {/* LIVE BACKEND-DRIVEN ACTIVITY WIDGET */}
                <div className="rp-card rp-activity-card rp-activity-card-inline">
                  <div className="rp-activity-head">
                    <span className="rp-status-title">Recent activity</span>
                    <span className={`rp-live-chip ${activityLive ? "" : "rp-off"}`}>
                      <span className="rp-live-dot" />
                      {activityLive ? "live" : "offline"}
                    </span>
                  </div>
                  <div className="rp-activity-viewport">
                    {doubledItems.length === 0 ? (
                      <div className="rp-activity-empty">
                        <p>
                          No backend connected yet. Pass a <code>backendUrl</code> prop to see
                          live reply activity scroll through here.
                        </p>
                        <button onClick={loadActivity}>Retry connection</button>
                      </div>
                    ) : (
                      <div
                        className="rp-activity-track rp-scrolling"
                        style={{ animationDuration: `${scrollDuration}s` }}
                      >
                        {doubledItems.map((item, i) => (
                          <div className="rp-activity-item" key={`${item.id}-${i}`}>
                            <div className="rp-avatar">{initials(item.author)}</div>
                            <div className="rp-body">
                              <div className="rp-who">{item.author || "Reply Pilot"}</div>
                              <div className="rp-msg">{item.message}</div>
                              <div className="rp-time">{item.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============== SLIDE 2 — PRODUCT + LIVE ACTIVITY ============== */}
        <section className="rp-slide rp-slide-last" id="rp-product">
          <div className="rp-blob-layer" aria-hidden="true">
            <span className="rp-blob rp-blob-olive rp-blob-a" />
            <span className="rp-blob rp-blob-rust rp-blob-b" />
          </div>
          <div className="rp-wrap">
            <div className="rp-slide-head">
              <div>
                <div className="rp-eyebrow">How we run it for you</div>
                <h2 id="rp-activity">Your inbox. Our operations team and RAG system.</h2>
              </div>
              <p>
                We plug into your support mailbox and operate the whole reply pipeline — your
                team keeps oversight, we handle the volume.
              </p>
            </div>

            <div className="rp-product-grid">
              <div className="rp-steps">
                <div className="rp-step">
                  <span className="rp-step-num">1</span>
                  <div>
                    <h3>We onboard your mailbox and policies</h3>
                    <p>
                      Hand us your support inbox and existing policy docs — we index them into
                      a RAG knowledge base built for your business.
                    </p>
                  </div>
                </div>
                <div className="rp-step">
                  <span className="rp-step-num">2</span>
                  <div>
                    <h3>Our system answers, category by category</h3>
                    <p>
                      Every incoming mail is classified and matched to the right policy —
                      login, refund, registration, and more — before a reply is drafted.
                    </p>
                  </div>
                </div>
                <div className="rp-step">
                  <span className="rp-step-num">3</span>
                  <div>
                    <h3>Routine replies go out, edge cases come to us</h3>
                    <p>
                      Anything outside the guardrails you set is escalated to our operations
                      team, not left to guess — nothing risky ships unattended.
                    </p>
                  </div>
                </div>
                <div className="rp-step">
                  <span className="rp-step-num">4</span>
                  <div>
                    <h3>We verify tone, policy fit, and reply safety</h3>
                    <p>
                      Before an answer leaves the system, we check it against your policy set,
                      known categories, and escalation rules to prevent unsafe or off-brand
                      responses.
                    </p>
                  </div>
                </div>
                <div className="rp-step">
                  <span className="rp-step-num">5</span>
                  <div>
                    <h3>Missing context is handled explicitly</h3>
                    <p>
                      If the mailbox data is incomplete or ambiguous, the workflow does not
                      invent details. It flags the gap, brings in human review, or keeps the
                      reply conservative.
                    </p>
                  </div>
                </div>

                <div className="rp-category-block">
                  <div className="rp-cat-label">Our RAG knowledge base is already tuned for</div>
                  <div className="rp-chip-row">
                    <span className="rp-chip rp-chip-accent">Login &amp; Access</span>
                    <span className="rp-chip rp-chip-accent">Registration</span>
                    <span className="rp-chip rp-chip-accent">Refunds</span>
                    <span className="rp-chip">Billing &amp; Payments</span>
                    <span className="rp-chip">Order Tracking</span>
                    <span className="rp-chip">Cancellations</span>
                    <span className="rp-chip">Account Management</span>
                    <span className="rp-chip">Shipping &amp; Delivery</span>
                    <span className="rp-chip">Subscription Changes</span>
                    <span className="rp-chip">Technical Support</span>
                    <span className="rp-chip">Complaints &amp; Escalations</span>
                    <span className="rp-chip">+ your custom categories</span>
                  </div>
                </div>
              </div>

              <div className="rp-side-stack">
                <div className="rp-warning-card">
                  <div className="rp-warning-eyebrow">Warning</div>
                  <h3>
                    Without proper RAG optimization, responses can drift into incomplete,
                    inaccurate, or unsupported information.
                  </h3>
                  <p>
                    When policy grounding is weak, the system may generate confident-sounding
                    answers that are not backed by your customer support knowledge base.
                  </p>
                  <p className="rp-warning-highlight">
                    With our approach, we tailor the solution to your business needs and data,
                    ensuring responses stay accurate, relevant, and aligned with your
                    organization’s policies.
                  </p>
                </div>

                <div className="rp-note-card">
                  <div className="rp-note-title">What we protect</div>
                  <ul className="rp-note-list">
                    <li>Customer trust through grounded policy answers</li>
                    <li>Reply quality by preventing unsupported claims</li>
                    <li>Operational safety with controlled escalation paths</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="rp-footer" id="rp-footer">
        <div className="rp-wrap">
          <div className="rp-footer-row">
            <span className="rp-fine">© 2026 Reply Pilot · Your customer care mail system, operated by us</span>
            <span className="rp-fine">
              Backend URL is a prop; endpoints &amp; polling live at the top of this file
            </span>
          </div>
        </div>
      </footer>

      <button
        id="rp-top-btn"
        className={showTopBtn ? "rp-show" : ""}
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B85536"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
}

/* ================================================================
   Scoped styles — theme DNA: warm cream / charcoal / rust, editorial
   ================================================================ */
const CSS = `
.rp-root{
  --bg:#F6F5F0; --ink:#23221E; --rust:#B85536; --rust-hover:#9A4630;
  --olive:#8A8978; --border:#D5D4CF; --rust-tint:rgba(184,85,54,0.08);
  --rust-tint-2:rgba(184,85,54,0.14); --sage:#5F7A52; --card:rgba(255,255,255,0.92);
  --radius-lg:10px; --radius-sm:5px;
  --shadow-card:0 4px 24px rgba(35,34,30,0.04);
  --shadow-btn:0 6px 20px rgba(184,85,54,0.28);
  --font-sans:'Geist Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  --font-mono:'Geist Mono','SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;
  position:relative; min-height:100vh; color:var(--ink); font-family:var(--font-sans);
  background:
    radial-gradient(circle at top left, rgba(184,85,54,0.10), transparent 28%),
    radial-gradient(circle at bottom right, rgba(138,137,120,0.10), transparent 24%),
    linear-gradient(180deg, #F6F5F0 0%, #F1EEE7 100%);
  -webkit-font-smoothing:antialiased; overflow-x:hidden;
}
.rp-root::before{
  content:""; position:fixed; inset:0; pointer-events:none; z-index:9998; opacity:.03;
  mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.rp-root a{ color:inherit; }
.rp-root ::selection{ background:var(--rust-tint-2); color:var(--ink); }

@media (hover:hover) and (pointer:fine){
  .rp-root{ cursor:none; }
  #rp-cursor-dot, #rp-cursor-ring{
    position:fixed; top:0; left:0; pointer-events:none; z-index:9999; border-radius:50%;
    transform:translate(-50%,-50%); transition:opacity .2s ease;
  }
  #rp-cursor-dot{ width:6px; height:6px; background:var(--rust); }
  #rp-cursor-ring{ width:30px; height:30px; border:1px solid var(--olive);
    transition:transform .12s ease-out, opacity .2s ease, border-color .2s ease; }
  #rp-cursor-ring.rp-active{ border-color:var(--rust); transform:translate(-50%,-50%) scale(1.35); }
}

.rp-wrap{ max-width:1120px; margin:0 auto; padding:0 28px; }

.rp-header{ position:sticky; top:0; z-index:50; background:rgba(246,245,240,0.86);
  backdrop-filter:blur(8px); border-bottom:1px solid var(--border); }
.rp-nav{ display:flex; align-items:center; justify-content:space-between; padding:18px 28px;
  max-width:1120px; margin:0 auto; }
.rp-logo{ display:flex; align-items:center; gap:10px; font-weight:600; letter-spacing:-0.01em;
  font-size:17px; text-decoration:none; border:none; background:none; padding:0; color:inherit; cursor:pointer; }
.rp-logo-mark{ width:26px; height:26px; border-radius:7px;
  background:linear-gradient(155deg, var(--rust), #D07B57); position:relative; flex-shrink:0; }
.rp-logo-mark::after{ content:""; position:absolute; inset:7px; border-radius:2px;
  background:var(--bg); opacity:.9; }
.rp-nav-links{ display:flex; align-items:center; gap:30px; }
.rp-nav-links a{ font-size:14px; color:var(--ink); text-decoration:none; position:relative;
  padding-bottom:3px; opacity:.8; }
.rp-nav-links a::after{ content:""; position:absolute; left:0; right:0; bottom:0; height:1px;
  background:var(--rust); transform:scaleX(0); transform-origin:left; transition:transform .25s ease; }
.rp-nav-links a:hover{ opacity:1; }
.rp-nav-links a:hover::after{ transform:scaleX(1); }
.rp-nav-docs{ font-weight:700 !important; color:var(--rust) !important; opacity:1 !important; }
.rp-nav-docs::after{ transform:scaleX(1) !important; }
.rp-nav-cta{ display:none; }
@media (min-width:720px){ .rp-nav-cta{ display:inline-flex; } }

.rp-btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px;
  font-family:var(--font-sans); font-size:14px; font-weight:600; padding:11px 20px;
  border-radius:8px; border:1px solid transparent; cursor:pointer; text-decoration:none;
  transition:transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
  white-space:nowrap; }
.rp-btn-primary{ background:var(--rust); color:#FBF8F4; box-shadow:var(--shadow-btn); }
.rp-btn-primary:hover{ background:var(--rust-hover); transform:translateY(-1px); }
.rp-btn-ghost{ background:transparent; color:var(--ink); border-color:var(--border); }
.rp-btn-ghost:hover{ border-color:var(--olive); background:var(--rust-tint); }

.rp-slide{ min-height:100svh; display:flex; flex-direction:column; justify-content:center;
  padding:64px 0 56px; position:relative; border-bottom:1px solid var(--border); }
.rp-slide-last{ border-bottom:none; }
.rp-eyebrow{ font-family:var(--font-mono); font-size:12px; letter-spacing:.08em;
  text-transform:uppercase; color:var(--rust); display:flex; align-items:center; gap:9px; margin-bottom:18px; }
.rp-eyebrow::before{ content:""; width:16px; height:1px; background:var(--rust); }

.rp-root h1{ font-size:clamp(34px,5.4vw,60px); line-height:1.04; letter-spacing:-0.025em;
  margin:0 0 20px; font-weight:600; max-width:780px; }
.rp-root h1 em{ font-style:italic; color:var(--rust); font-weight:500; }
.rp-lede{ font-size:clamp(16px,1.9vw,19px); line-height:1.55; color:#4B4A44; max-width:560px; margin:0 0 34px; }
.rp-hero-ctas{ display:flex; flex-wrap:wrap; gap:12px; margin-bottom:56px; }

.rp-hero-grid{ display:grid; grid-template-columns:1fr; gap:36px; align-items:start; }
@media (min-width:900px){ .rp-hero-grid{ grid-template-columns:1.15fr 0.85fr; gap:48px; } }

.rp-card{ background:var(--card); border:1px solid var(--border); border-radius:var(--radius-lg);
  box-shadow:var(--shadow-card); padding:22px; }

.rp-status-card{ background:none; border:none; box-shadow:none; padding:0; display:flex; flex-direction:column; gap:16px; }
.rp-status-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:0; }
.rp-status-title{ font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--olive); }
.rp-status-url{ font-size:11px; color:var(--olive); }
.rp-status-liquid{
  position:relative; overflow:hidden; border:1px solid rgba(184,85,54,0.18);
  border-radius:18px; background:linear-gradient(135deg, rgba(255,255,255,0.9), rgba(247,240,231,0.92));
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.8), 0 14px 40px rgba(35,34,30,0.08);
  padding:18px; display:flex; align-items:center; gap:16px;
}
.rp-status-liquid::before{
  content:""; position:absolute; inset:-40% auto auto -20%; width:180px; height:180px;
  background:radial-gradient(circle, rgba(184,85,54,0.18), rgba(184,85,54,0) 70%);
  pointer-events:none;
}
.rp-status-liquid::after{
  content:""; position:absolute; right:-30px; bottom:-40px; width:150px; height:150px;
  background:radial-gradient(circle, rgba(138,137,120,0.16), rgba(138,137,120,0) 72%);
  pointer-events:none;
}
.rp-status-row{ display:flex; align-items:center; gap:10px; position:relative; z-index:1; }
.rp-dot{ width:9px; height:9px; border-radius:50%; background:var(--olive); flex-shrink:0; position:relative; }
.rp-dot.rp-pulsing::after{ content:""; position:absolute; inset:-5px; border-radius:50%;
  border:1px solid currentColor; animation:rp-pulse 1.6s ease-out infinite; }
.rp-state-connecting{ background:var(--olive); color:var(--olive); }
.rp-state-online{ background:var(--sage); color:var(--sage); }
.rp-state-offline{ background:var(--rust); color:var(--rust); }
@keyframes rp-pulse{ 0%{ opacity:.55; transform:scale(1);} 100%{ opacity:0; transform:scale(2.1);} }
@media (prefers-reduced-motion:reduce){ .rp-dot.rp-pulsing::after{ animation:none; display:none; } }

.rp-status-label{ font-size:15px; font-weight:600; }
.rp-status-sub{ font-size:12.5px; color:var(--olive); font-family:var(--font-mono); }

.rp-slide-head{ display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between;
  gap:20px; margin-bottom:36px; }
.rp-root h2{ font-size:clamp(26px,3.6vw,38px); line-height:1.08; letter-spacing:-0.02em;
  margin:0 0 12px; font-weight:600; max-width:520px; }
.rp-slide-head p{ font-size:15.5px; color:#4B4A44; max-width:420px; margin:0; }

.rp-product-grid{ display:grid; grid-template-columns:1fr; gap:24px; }
@media (min-width:860px){ .rp-product-grid{ grid-template-columns:1.15fr 0.85fr; gap:26px; align-items:start; } }

.rp-side-stack{ display:flex; flex-direction:column; gap:16px; }
.rp-warning-card, .rp-note-card{ border:1px solid rgba(184,85,54,0.24); border-radius:18px; padding:18px; background:linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,239,232,0.95)); box-shadow:0 12px 34px rgba(35,34,30,0.06); }
.rp-warning-eyebrow{ font-family:var(--font-mono); font-size:11px; text-transform:uppercase; letter-spacing:.08em; color:var(--rust); font-weight:700; margin-bottom:10px; }
.rp-warning-card h3{ margin:0 0 10px; font-size:18px; line-height:1.35; }
.rp-warning-card p, .rp-note-card{ color:#5c5b54; }
.rp-warning-card p{ margin:0; font-size:14px; line-height:1.55; }
.rp-warning-highlight{ margin-top:12px !important; padding:10px 12px; border-left:3px solid var(--rust);
  background:rgba(184,85,54,0.06); border-radius:8px; color:var(--ink); font-weight:600; }
.rp-note-title{ font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--olive); margin-bottom:10px; }
.rp-note-list{ margin:0; padding-left:18px; display:grid; gap:8px; color:#55524b; font-size:14px; line-height:1.5; }

.rp-steps{ display:grid; grid-template-columns:1fr; gap:16px; }
@media (min-width:980px){ .rp-steps{ grid-template-columns:repeat(2, minmax(0, 1fr)); } }
.rp-step{ display:flex; gap:14px; padding:18px; border:1px solid var(--border); border-radius:var(--radius-lg);
  background:linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,244,238,0.94));
  box-shadow:var(--shadow-card); min-height:164px; }
.rp-step-num{ font-family:var(--font-mono); font-size:12px; color:var(--rust); background:var(--rust-tint);
  width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.rp-step h3{ font-size:14.5px; margin:0 0 6px; font-weight:600; }
.rp-step p{ font-size:13.5px; color:#5c5b54; margin:0; line-height:1.5; }
.rp-step:hover{ transform:translateY(-2px); box-shadow:0 10px 28px rgba(35,34,30,0.08); }

.rp-category-block{ margin-top:4px; padding:18px; border:1px solid rgba(184,85,54,0.18);
  border-radius:18px; background:linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,239,232,0.95));
  box-shadow:0 12px 34px rgba(35,34,30,0.06); grid-column:1 / -1; }
.rp-cat-label{ font-family:var(--font-mono); font-size:11.5px; text-transform:uppercase; letter-spacing:.07em;
  color:var(--olive); margin-bottom:12px; }
.rp-chip-row{ display:flex; flex-wrap:wrap; gap:8px; }
.rp-chip{ font-size:12.5px; font-family:var(--font-mono); padding:7px 12px; border-radius:20px;
  border:1px solid var(--border); background:var(--card); color:#4B4A44; }
.rp-chip.rp-chip-accent{ border-color:var(--rust); color:var(--rust); background:var(--rust-tint); }

.rp-activity-card{ padding:0; overflow:hidden; display:flex; flex-direction:column; }
.rp-activity-card-inline{ margin-top:0; }
.rp-activity-head{ display:flex; align-items:center; justify-content:space-between; padding:16px 18px;
  border-bottom:1px solid var(--border); }
.rp-live-chip{ display:flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:11px;
  color:var(--sage); background:rgba(95,122,82,0.08); padding:4px 9px; border-radius:20px; }
.rp-live-chip.rp-off{ color:var(--olive); background:var(--bg); }
.rp-live-dot{ width:6px; height:6px; background:currentColor; border-radius:50%; }

.rp-activity-viewport{ height:300px; overflow:hidden; position:relative; }
.rp-activity-viewport::before, .rp-activity-viewport::after{
  content:""; position:absolute; left:0; right:0; height:36px; z-index:2; pointer-events:none; }
.rp-activity-viewport::before{ top:0; background:linear-gradient(var(--card), transparent); }
.rp-activity-viewport::after{ bottom:0; background:linear-gradient(transparent, var(--card)); }

.rp-activity-track{ display:flex; flex-direction:column; will-change:transform; }
.rp-activity-track.rp-scrolling{ animation-name:rp-scroll-loop; animation-timing-function:linear; animation-iteration-count:infinite; }
@keyframes rp-scroll-loop{ from{ transform:translateY(0);} to{ transform:translateY(-50%);} }
.rp-activity-viewport:hover .rp-activity-track.rp-scrolling{ animation-play-state:paused; }
@media (prefers-reduced-motion:reduce){ .rp-activity-track.rp-scrolling{ animation:none; } }

.rp-activity-item{ display:flex; gap:12px; padding:13px 18px; border-bottom:1px solid var(--border); }
.rp-avatar{ width:30px; height:30px; border-radius:50%; flex-shrink:0; display:flex; align-items:center;
  justify-content:center; background:var(--rust-tint); color:var(--rust); font-family:var(--font-mono);
  font-size:12px; font-weight:600; }
.rp-who{ font-size:13.5px; font-weight:600; margin-bottom:2px; }
.rp-msg{ font-size:13px; color:#5c5b54; line-height:1.4; overflow:hidden; text-overflow:ellipsis;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
.rp-time{ font-family:var(--font-mono); font-size:11px; color:var(--olive); margin-top:4px; }

.rp-activity-empty{ display:flex; flex-direction:column; align-items:center; justify-content:center;
  height:100%; text-align:center; padding:28px; gap:10px; }
.rp-activity-empty p{ font-size:13px; color:var(--olive); margin:0; max-width:260px; line-height:1.5; }
.rp-activity-empty button{ font-family:var(--font-mono); font-size:12px; color:var(--rust);
  background:var(--rust-tint); border:1px solid var(--border); padding:7px 14px; border-radius:var(--radius-sm); cursor:pointer; }

.rp-footer{ padding:34px 0 44px; }
.rp-footer-row{ display:flex; flex-wrap:wrap; justify-content:space-between; gap:16px; align-items:center;
  border-top:1px solid var(--border); padding-top:22px; }
.rp-fine{ font-size:12.5px; color:var(--olive); font-family:var(--font-mono); }

#rp-top-btn{ position:fixed; right:22px; bottom:22px; z-index:60; width:42px; height:42px; border-radius:50%;
  border:1px solid var(--border); background:var(--card); box-shadow:var(--shadow-card); display:flex;
  align-items:center; justify-content:center; cursor:pointer; opacity:0; transform:translateY(10px);
  pointer-events:none; transition:opacity .25s ease, transform .25s ease, border-color .2s ease; }
#rp-top-btn.rp-show{ opacity:1; transform:translateY(0); pointer-events:auto; }
#rp-top-btn:hover{ border-color:var(--rust); animation:rp-float 1.6s ease-in-out infinite; }
@keyframes rp-float{ 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-4px);} }

.rp-try-it-box{ background:var(--rust-tint); border:1px solid var(--border); border-radius:var(--radius-lg);
  padding:20px 22px; margin-bottom:44px; max-width:560px; }
.rp-try-it-label{ font-family:var(--font-mono); font-size:11.5px; text-transform:uppercase; letter-spacing:.08em;
  color:var(--rust); margin-bottom:8px; display:flex; align-items:center; gap:8px; }
.rp-try-it-label::before{ content:"✉"; font-size:13px; }
.rp-try-it-box p{ font-size:14.5px; line-height:1.55; color:#4B4A44; margin:0 0 14px; }
.rp-try-it-email{ display:inline-flex; align-items:center; gap:9px; font-family:var(--font-mono); font-size:14px;
  font-weight:600; color:#FBF8F4; background:var(--rust); padding:11px 18px; border-radius:8px; text-decoration:none;
  box-shadow:var(--shadow-btn); transition:background .2s ease, transform .2s ease; }
.rp-try-it-email:hover{ background:var(--rust-hover); transform:translateY(-1px); }
.rp-try-it-note{ font-size:12px; color:var(--olive); margin-top:10px; }

.rp-category-block{ margin-top:26px; }
.rp-cat-label{ font-family:var(--font-mono); font-size:11.5px; text-transform:uppercase; letter-spacing:.07em;
  color:var(--olive); margin-bottom:10px; }
.rp-chip-row{ display:flex; flex-wrap:wrap; gap:8px; }
.rp-chip{ font-size:12.5px; font-family:var(--font-mono); padding:7px 12px; border-radius:20px;
  border:1px solid var(--border); background:var(--card); color:#4B4A44; }
.rp-chip.rp-chip-accent{ border-color:var(--rust); color:var(--rust); background:var(--rust-tint); }

.rp-blob-layer{ position:absolute; inset:0; overflow:hidden; z-index:0; pointer-events:none; }
.rp-blob{ position:absolute; filter:blur(64px); mix-blend-mode:multiply;
  border-radius:42% 58% 65% 35% / 45% 45% 55% 55%;
  animation: rp-blob-morph 11s ease-in-out infinite, rp-blob-drift 17s ease-in-out infinite alternate; }
.rp-blob-rust{ background:radial-gradient(circle at 32% 32%, rgba(184,85,54,0.5), rgba(184,85,54,0) 70%); opacity:.55; }
.rp-blob-olive{ background:radial-gradient(circle at 60% 40%, rgba(138,137,120,0.45), rgba(138,137,120,0) 70%); opacity:.5; }
.rp-blob-clay{ background:radial-gradient(circle at 45% 55%, rgba(208,123,87,0.4), rgba(208,123,87,0) 70%); opacity:.45; }

#rp-hero .rp-blob-a{ width:440px; height:440px; top:-140px; left:-90px; animation-duration:12s, 19s; }
#rp-hero .rp-blob-b{ width:380px; height:380px; bottom:-120px; right:-70px; animation-duration:14s, 22s; animation-delay:-4s, -6s; }
#rp-hero .rp-blob-c{ width:260px; height:260px; top:30%; right:18%; animation-duration:9s, 15s; animation-delay:-2s, -3s; }

#rp-product .rp-blob-a{ width:360px; height:360px; top:-100px; right:-80px; animation-duration:13s, 20s; }
#rp-product .rp-blob-b{ width:300px; height:300px; bottom:-110px; left:-60px; animation-duration:10s, 18s; animation-delay:-5s, -2s; }

@keyframes rp-blob-morph{
  0%   { border-radius:42% 58% 65% 35% / 45% 45% 55% 55%; }
  50%  { border-radius:60% 40% 30% 70% / 55% 65% 35% 45%; }
  100% { border-radius:42% 58% 65% 35% / 45% 45% 55% 55%; }
}
@keyframes rp-blob-drift{
  from{ transform:translate(0,0) scale(1) rotate(0deg); }
  to{ transform:translate(36px,-26px) scale(1.12) rotate(8deg); }
}
@media (max-width: 900px){
  .rp-root::before{ opacity:0; }
  .rp-root .rp-blob{
    animation:none !important;
    mix-blend-mode:normal;
    filter:blur(44px);
    opacity:.38;
  }
  .rp-activity-track.rp-scrolling{ animation:none !important; }
}

@media (prefers-reduced-motion:reduce){ .rp-blob{ animation:none; } }

.rp-hero-grid, .rp-slide-head, .rp-product-grid{ position:relative; z-index:1; }
#rp-hero, #rp-product{ position:relative; overflow:hidden; }

.rp-btn-primary{ position:relative; overflow:hidden; z-index:0; }
.rp-btn-primary::before{
  content:""; position:absolute; inset:-40%; z-index:-1;
  background:radial-gradient(circle, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%);
  transform:scale(0); opacity:0; transition:transform .5s ease, opacity .4s ease;
}
.rp-btn-primary:hover::before{ transform:scale(1); opacity:1; }
.rp-try-it-email{ position:relative; overflow:hidden; z-index:0; }
.rp-try-it-email::before{
  content:""; position:absolute; inset:-40%; z-index:-1;
  background:radial-gradient(circle, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%);
  transform:scale(0); opacity:0; transition:transform .5s ease, opacity .4s ease;
}
.rp-try-it-email:hover::before{ transform:scale(1); opacity:1; }
`;
