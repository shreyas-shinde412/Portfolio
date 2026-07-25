import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FileText, Github, Linkedin } from 'lucide-react';
import { getLenis } from '@/hooks/useLenis';

interface HeroSectionProps {
  isReady: boolean;
}

export default function HeroSection({ isReady }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;

    const label = labelRef.current;
    const name = nameRef.current;
    const social = socialRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const photo = photoRef.current;
    const scroll = scrollRef.current;

    if (!label || !name || !social || !subtitle || !cta || !photo || !scroll) return;

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo(
      label,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      0
    )
      .fromTo(name, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0.14)
      .fromTo(
        subtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.65 },
        0.3
      )
      .fromTo(social, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 }, 0.48)
      .fromTo(
        cta,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.7
      )
      .fromTo(
        photo,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.0 },
        0.22
      )
      .fromTo(scroll, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.2);

    const scrollLineTween = gsap.to(scroll.querySelector('.scroll-line'), {
      y: 8,
      duration: 1.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    const onScroll = () => {
      if (window.scrollY > 100) {
        gsap.to(scroll, { opacity: 0, duration: 0.3 });
      } else {
        gsap.to(scroll, { opacity: 1, duration: 0.3 });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      tl.kill();
      scrollLineTween.kill();
      window.removeEventListener('scroll', onScroll);
    };
  }, [isReady]);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo('#projects', { offset: -64 });
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="min-h-[100dvh] bg-charcoal-light flex items-center pt-16"
    >
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8">
          {/* Text Content */}
          <div className="flex-1 lg:max-w-[55%] text-center lg:text-left">
            <span
              ref={labelRef}
              className="inline-block font-mono text-[11px] font-medium tracking-[0.08em] text-text-muted mb-6 opacity-0"
            >
              COMPUTER ENGINEERING STUDENT &middot; ML AND BACKEND ENTHUSIAST
            </span>

            <p
              ref={nameRef}
              className="font-sans text-[clamp(44px,7.4vw,88px)] font-normal tracking-[-0.03em] leading-[1.05] text-white mb-4 opacity-0 lg:ml-[-5px]"
            >
              Shreyas Shinde
            </p>
            <p
              ref={subtitleRef}
              className="font-sans text-lg text-text-muted leading-relaxed max-w-[480px] mx-auto lg:mx-0 mb-10 opacity-0"
            >
              Open to internships and full-time opportunities <br></br>
              <br></br>
              I build backend systems and ML pipelines that actually ship — FastAPI, Docker, Python. Open to SDE and ML roles.
            </p>
            <div ref={socialRef} className="flex items-center justify-center lg:justify-start gap-3 mb-5 opacity-0">
              <a
                href="https://github.com/shreyas-shinde412"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-rust hover:text-rust"
              >
                <Github className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/shreyas-shinde-724324265"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-rust hover:text-rust"
              >
                <Linkedin className="h-4.5 w-4.5" />
              </a>
              <a
                href="/Shreyas_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 font-mono text-[11px] font-medium tracking-[0.06em] text-white transition-colors duration-300 hover:border-rust hover:text-rust"
              >
                <FileText className="h-3.5 w-3.5" />
                View Resume
              </a>
            </div>

            

            <a
              ref={ctaRef}
              href="#projects"
              onClick={handleCtaClick}
              className="inline-block bg-rust text-white font-sans text-sm font-medium px-8 py-3.5 rounded-full hover:bg-rust-dark hover:shadow-button-hover transition-all duration-300 opacity-0"
            >
              View My Work
            </a>
          </div>

          {/* Photo */}
          <div className="flex-1 lg:max-w-[45%] flex justify-center lg:justify-end">
            <div
              ref={photoRef}
              className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-full lg:max-w-[420px] lg:h-auto lg:aspect-square opacity-0"
            >
              <img
                src="./shreyas-photo.png"
                alt="Shreyas Shinde"
                className="w-full h-full object-cover rounded-full"
                style={{ transform: 'scaleX(-1)' }}
              />
              {/* Inner shadow overlay */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <div className="scroll-line w-px h-10 bg-white/20" />
      </div>
    </section>
  );
}
