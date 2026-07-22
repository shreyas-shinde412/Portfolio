import { Link } from 'react-router';

const docsSections = [
  {
    title: 'Project overview',
    body:
      'ReplyPilot is a portfolio project centered on building a customer-support reply assistant that grounds its responses in retrieved support context rather than guessing from limited input.',
  },
  {
    title: 'How it works',
    body:
      'The workflow classifies incoming messages, retrieves relevant policy and knowledge-base context, and then drafts a response only when the information is supported by the available sources.',
  },
  {
    title: 'Why this matters',
    body:
      'The project focuses on reliability and safety by making unsupported answers visible and by routing ambiguous cases toward human review instead of overconfident automation.',
  },
];

const documentationChecklist = [
  'Mailbox onboarding and policy intake',
  'Knowledge-base grounding for support answers',
  'Category-based reply routing and escalation',
  'Human review for ambiguous or sensitive scenarios',
  'Operational visibility for inbox activity and monitoring',
];

export default function ReplyPilotDocsPage() {
  return (
    <main className="min-h-screen bg-[#F6F5F0] text-[#23221E]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[#B85536]">
              ReplyPilot project page
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
              Project gallery and notes
            </h1>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#B85536] px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-300 hover:bg-[#9A4630]"
          >
            Back to portfolio
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-[#D5D4CF] bg-white/90 p-4 shadow-[0_12px_30px_rgba(35,34,30,0.06)]">
            <div className="overflow-hidden rounded-[20px] border border-[#D5D4CF] bg-black">
              <video
                src="/Video.mp4"
                controls
                playsInline
                className="aspect-video w-full h-auto object-contain bg-black"
                preload="metadata"
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-[#D5D4CF] bg-gradient-to-br from-white/95 to-[#F7EFE8] p-6 shadow-[0_12px_30px_rgba(35,34,30,0.06)]">
            <div className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A8978]">
              Project notes
            </div>
            <ul className="space-y-3">
              {documentationChecklist.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#5c5b54]">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#B85536]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {docsSections.map((section) => (
            <article
              key={section.title}
              className="rounded-[22px] border border-[#D5D4CF] bg-white/85 p-5 shadow-[0_10px_26px_rgba(35,34,30,0.05)]"
            >
              <h2 className="mb-2 text-lg font-semibold text-[#23221E]">{section.title}</h2>
              <p className="text-sm leading-6 text-[#5c5b54]">{section.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-[24px] border border-[#D5D4CF] bg-white/85 p-6 shadow-[0_12px_30px_rgba(35,34,30,0.06)]">
          <div className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A8978]">
            Project summary
          </div>
          <p className="max-w-3xl text-sm leading-6 text-[#5c5b54]">
            This page presents the ReplyPilot project in a portfolio-friendly format: the video gives
            a quick visual walkthrough, while the notes summarize the retrieval-grounded reply flow
            and the project’s emphasis on safe, verifiable automation. The GitHub repository below
            links to an incomplete development version of the product, since the final production
            implementation is not open-sourced.
          </p>

          <div className="mt-5">
            <a
              href="https://github.com/shreyas-shinde412/ReplyPilot.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[#B85536] bg-[#B85536]/8 px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[#B85536] transition-colors duration-300 hover:bg-[#B85536] hover:text-white"
            >
              Incomplete version on GitHub
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
