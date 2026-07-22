import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';
import SectionHeading from '@/components/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

const ACHIEVEMENTS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B85536" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C5.81 4 6.5 5.12 6.5 5.12S7.19 4 8.5 4a2.5 2.5 0 0 1 0 5H7" />
        <path d="M6 9v7" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C18.19 4 17.5 5.12 17.5 5.12S16.81 4 15.5 4a2.5 2.5 0 0 0 0 5H17" />
        <path d="M18 9v7" />
        <path d="M6 16h12v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4z" />
      </svg>
    ),
    title: 'Hackathon Finalist',
    detail: 'Avinya 24-Hour Hackathon',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B85536" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    title: 'Silver Medalist',
    detail: 'Deep Learning — NPTEL',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B85536" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'ML Specialization',
    detail: 'Coursera Certified',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B85536" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Cybersecurity Certified',
    detail: 'CSI — Cyber Security & Digital Forensics',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B85536" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M15 2v2" />
        <path d="M15 20v2" />
        <path d="M2 15h2" />
        <path d="M2 9h2" />
        <path d="M20 15h2" />
        <path d="M20 9h2" />
        <path d="M9 2v2" />
        <path d="M9 20v2" />
      </svg>
    ),
    title: 'Robotics & Simulation',
    detail: 'ROS2 and ISAAC SIM exploration',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B85536" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
    title: 'CTF Competitor',
    detail: 'Cybersecurity exploration and CTF challenges',
  },
];

export default function AchievementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll('.achievement-card');

    const trigger = ScrollTrigger.create({
      trigger: grid,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
        );
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="bg-cream py-16 md:py-[120px]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionLabel text="CERTIFICATIONS & EXTRACURRICULAR ACTIVITIES" />
        <SectionHeading text="Beyond the Code" className="mb-12" />

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={achievement.title}
              className="achievement-card bg-white border border-border-light rounded-xl p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-rust/20 transition-all duration-300 opacity-0"
            >
              <div className="mb-4">{achievement.icon}</div>
              <h4 className="font-sans text-xl font-medium tracking-[-0.01em] text-charcoal mb-2">
                {achievement.title}
              </h4>
              <p className="font-sans text-sm text-text-muted leading-relaxed">
                {achievement.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
