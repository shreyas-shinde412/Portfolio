import { ArrowUp, Github, Linkedin } from 'lucide-react';
import { getLenis } from '@/hooks/useLenis';
import SectionHeading from './SectionHeading';

export default function Footer() {
  const handleBackToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo('#hero', { offset: 0 });
      return;
    }

    const hero = document.querySelector('#hero');
    hero?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer id="contact" className="bg-charcoal pt-20 pb-10">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Contact CTA */}
        <div className="mb-16">
          <span className="inline-block font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-text-muted mb-4">
            LET&apos;S CONNECT
          </span>
          <SectionHeading text="Open to opportunities." light className="mb-4" />
          <p className="font-sans text-base text-text-muted leading-relaxed max-w-lg mb-8">
            Currently seeking Machine Learning and Backend Engineering roles.
          </p>

          <div className="flex-wrap items-center gap-4">
            <p className="font-sans text-base text-text-muted leading-relaxed max-w-lg py-3.5">
            Email: shreyassshinde11@gmail.com <br />
            Mobile: +91 9561855318
            </p>
            <a
              href="mailto:shreyassshinde11@gmail.com"
              className="inline-block bg-rust text-white font-sans text-sm font-medium px-8 py-3.5 rounded-full hover:bg-rust-dark hover:shadow-button-hover transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>

          <div className="mt-4">
            <a
              href="./Shreyas_Resume.pdf"
              download
              className="inline-block border border-text-muted text-text-muted font-sans text-sm font-medium px-8 py-3.5 rounded-full hover:border-rust hover:text-rust transition-all duration-300"
            >
              Download Resume
            </a>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <a
              href="https://github.com/shreyas-shinde412"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:border-rust hover:text-rust"
            >
              <Github className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/shreyas-shinde-724324265"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:border-rust hover:text-rust"
            >
              <Linkedin className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-white/30">
            &copy; 2026 Shreyas Shinde
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#hero"
              onClick={handleBackToTop}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-rust/40 bg-rust px-5 py-2.5 font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-white shadow-button transition-all duration-300 hover:-translate-y-1 hover:bg-rust-dark hover:shadow-button-hover"
            >
              <ArrowUp className="h-3.5 w-3.5 back-to-top-float" />
              To the Top
            </a>
            <a
              href="https://github.com/shreyas-shinde412"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-white/30 hover:text-rust transition-colors duration-300"
            >
              GitHub
            </a>
            <span className="text-white/20">&middot;</span>
            <a
              href="https://www.linkedin.com/in/shreyas-shinde-724324265"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-white/30 hover:text-rust transition-colors duration-300"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
