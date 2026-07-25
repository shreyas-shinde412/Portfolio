import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';
import SectionHeading from '@/components/SectionHeading';
import SkillTag from '@/components/SkillTag';

gsap.registerPlugin(ScrollTrigger);

const SKILL_CATEGORIES = [
  {
    category: 'Proficient:',
    skills: ['Python', 'FastAPI', 'MySQL', 'MongoDB', 'Docker', 'Redis'],
  },
  {
    category: 'Familiar:',
    skills: ['Kubernetes', 'CI/CD', 'PyTorch', 'TensorFlow', 'GCP', 'DigitalOcean', 'C++'],
  },
  {
    category: 'Want to Learn:',
    skills: ['Robotics', 'Game Development'],
  },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const categories = categoriesRef.current;
    if (!categories) return;

    const categoryRows = categories.querySelectorAll('.skill-category');

    const trigger = ScrollTrigger.create({
      trigger: categories,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        categoryRows.forEach((row, rowIndex) => {
          gsap.fromTo(
            row,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: rowIndex * 0.1,
              ease: 'power2.out',
            }
          );

          const tags = row.querySelectorAll('.skill-tag-wrapper');
          gsap.fromTo(
            tags,
            { y: 15, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              delay: rowIndex * 0.1 + 0.2,
              stagger: 0.04,
              ease: 'power2.out',
            }
          );
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="bg-cream-dark py-16 md:py-[120px]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionLabel text="TECHNICAL SKILLS" />
        <SectionHeading text="My Toolkit" className="mb-16" />

        <div ref={categoriesRef} className="space-y-8">
          {SKILL_CATEGORIES.map(({ category, skills }) => (
            <div
              key={category}
              className="skill-category flex flex-col gap-3 sm:gap-4 opacity-0"
            >
              <span className="font-mono text-[13px] font-medium text-text-muted sm:min-w-[200px] sm:text-left pt-2.5">
                {category}
              </span>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div key={skill} className="skill-tag-wrapper">
                    <SkillTag name={skill} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
