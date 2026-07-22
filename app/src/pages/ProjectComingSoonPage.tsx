import { Link, useParams } from 'react-router';

const PROJECT_TITLES: Record<string, string> = {
  modelhub: 'ModelHub',
  replypilot: 'ReplyPilot',
};

export default function ProjectComingSoonPage() {
  const { projectSlug } = useParams();
  const projectTitle = projectSlug ? PROJECT_TITLES[projectSlug] ?? 'Project' : 'Project';

  return (
    <main className="min-h-screen bg-charcoal-light text-white flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full text-center border border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-card">
        <span className="inline-block font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-text-muted mb-4">
          PROJECT DETAILS
        </span>
        <h1 className="font-sans text-[clamp(40px,6vw,72px)] font-normal tracking-[-0.03em] leading-tight mb-4">
          {projectTitle}
        </h1>
        <p className="font-sans text-lg text-text-muted leading-relaxed mb-8">
          Will add soon. This project page is a placeholder for the full case study, screenshots,
          and implementation notes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            state={{ scrollTo: 'projects' }}
            className="inline-flex items-center justify-center rounded-full bg-rust px-6 py-3 font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-white transition-colors duration-300 hover:bg-rust-dark"
          >
            Back to Portfolio
          </Link>
          <a
            href="mailto:shreyassshinde11@gmail.com"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-white transition-colors duration-300 hover:border-white/40"
          >
            Contact Me
          </a>
        </div>
      </div>
    </main>
  );
}