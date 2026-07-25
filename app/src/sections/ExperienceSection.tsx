import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';
import SectionHeading from '@/components/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

const BULLETS = [
  'Collaborated with engineering, data, and product teams to develop and deploy ML solutions for multiple client projects, ensuring seamless integration with existing systems.',
  'Designed and optimized classification/regression pipelines, consistently achieving +15% accuracy over baseline models through advanced feature engineering and model tuning.',
  'Automated model deployment using CI/CD pipelines, enabling rapid iteration, version control, and reliable roll-out of model updates.',
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );

        const bullets = card.querySelectorAll('.bullet-item');
        gsap.fromTo(
          bullets,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
        );
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="bg-cream py-16 md:py-[120px]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionLabel text="EXPERIENCE" />
        <SectionHeading text="Where I've Worked" className="mb-12" />

        <div className="max-w-[800px] mx-auto">
          <div
            ref={cardRef}
            className="bg-white border border-border-light border-l-4 border-l-rust rounded-xl p-8 md:p-10 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 opacity-0"
          >
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <div>
                <h3 className="font-sans text-2xl font-medium tracking-[-0.01em] text-charcoal">
                  Machine Learning Intern
                </h3>
                <p className="font-sans text-lg font-medium text-rust">codeXslinger</p>
              </div>
              <div className="text-right sm:text-right">
                <span className="font-mono text-xs text-text-muted block">Jan 2025 – Mar 2025</span>
                <span className="font-mono text-xs text-text-muted block">Pune, Maharashtra</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border-light my-6" />

            {/* Bullets */}
            <div className="space-y-4">
              {BULLETS.map((bullet, i) => (
                <div key={i} className="bullet-item flex items-start gap-3 opacity-0">
                  <span className="w-1 h-1 rounded-full bg-rust mt-2.5 flex-shrink-0" />
                  <p className="font-sans text-base text-charcoal leading-[1.7]">{bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
