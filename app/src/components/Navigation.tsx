import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '@/hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications & Extracurricular', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Entrance animation
    gsap.to(nav, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      delay: 0.3,
      ease: 'power2.out',
    });

    // Scroll detection for background change
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom top',
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(href, { offset: -64 });
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cream/92 backdrop-blur-xl border-b border-border-light'
            : 'bg-transparent border-b border-transparent'
        }`}
        style={{ opacity: 0, transform: 'translateY(-20px)' }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, '#top')}
            className={`font-mono text-base font-semibold tracking-[0.08em] transition-colors duration-300 ${
              scrolled ? 'text-charcoal hover:text-rust' : 'text-white hover:text-white/80'
            }`}
          >
            SS
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`font-mono text-[13px] tracking-[0.06em] transition-colors duration-300 ${
                  scrolled ? 'text-charcoal hover:text-rust' : 'text-white hover:text-white/80'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="w-5 h-[1.5px] bg-charcoal block" />
            <span className="w-5 h-[1.5px] bg-charcoal block" />
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div
        className={`fixed inset-0 z-[90] bg-cream flex flex-col items-center justify-center transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-6 p-2"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#23221E" strokeWidth="1.5">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </button>

        {/* Mobile Links */}
        <div className="flex flex-col items-center gap-8">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-sans text-3xl font-normal text-charcoal hover:text-rust transition-colors duration-300"
              style={{
                transitionDelay: mobileOpen ? `${i * 60}ms` : '0ms',
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
