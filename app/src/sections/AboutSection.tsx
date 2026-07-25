import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';
import SectionHeading from '@/components/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { number: '8.88', label: 'CGPA', description: 'Computer Engineering' },
  { number: '1', label: 'Internship', description: 'ML @ codeXslinger' },
  { number: '2', label: 'Projects Shipped', description: 'Major Projects' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bio = bioRef.current;
    const stats = statsRef.current;
    const photo = photoRef.current;
    if (!section || !bio || !stats || !photo) return;

    const triggers: ScrollTrigger[] = [];

    // Bio entrance
    triggers.push(
      ScrollTrigger.create({
        trigger: bio,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            bio,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
          );
        },
      })
    );

    // Stats stagger
    const statCards = stats.querySelectorAll('.stat-card');
    triggers.push(
      ScrollTrigger.create({
        trigger: stats,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            statCards,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out' }
          );
        },
      })
    );

    // Photo entrance
    triggers.push(
      ScrollTrigger.create({
        trigger: photo,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            photo,
            { opacity: 0, scale: 0.97 },
            { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
          );
        },
      })
    );

    // Photo parallax
    gsap.to(photo, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-cream py-16 md:py-[120px] overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Photo */}
          <div className="lg:w-[40%]">
            <div
              ref={photoRef}
              className="relative w-full aspect-square lg:aspect-square lg:max-w-[500px] opacity-0"
            >
              <img
                src="./shreyas-photo.png"
                alt="Shreyas Shinde"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:w-[60%]">
            <SectionLabel text="ABOUT" />
            <SectionHeading text="Engineer. Builder. Problem-solver." className="mb-8" />

            <p
              ref={bioRef}
              className="font-sans text-lg text-charcoal leading-[1.7] max-w-[560px] mb-12 opacity-0"
            >
              I&apos;m Shreyas Shinde, a Computer Engineering student at Indira College of
              Engineering, Pune with a passion for building intelligent systems. My work sits at
              the intersection of machine learning and backend engineering — I design models that
              learn, and the infrastructure that scales them. When I&apos;m not training neural
              networks or optimizing APIs, you&apos;ll find me experimenting  with robotics ideas or exploring
              cybersecurity challenges.
            </p>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4 sm:gap-6">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="stat-card bg-white border border-border-light rounded-xl p-4 sm:p-6 opacity-0"
                >
                  <div className="font-sans text-[clamp(28px,4vw,48px)] font-normal text-rust leading-none mb-2">
                    {stat.number}
                  </div>
                  <div className="font-mono text-[11px] font-medium tracking-[0.08em] text-text-muted uppercase mb-1">
                    {stat.label}
                  </div>
                  <div className="font-sans text-sm text-text-muted hidden sm:block">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
