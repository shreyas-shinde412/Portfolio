import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router';
import SectionLabel from '@/components/SectionLabel';
import SectionHeading from '@/components/SectionHeading';
import SkillTag from '@/components/SkillTag';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    slug: 'replypilot',
    name: 'ReplyPilot',
    description:
      'An automated system that responds to customer service emails by understanding query intent and referencing a dynamic knowledge base. Retrieves contextual information to craft accurate, context-aware replies — reducing manual response time and improving consistency.',
    tech: ['Python', 'Flask', 'MongoDB', 'SentenceTransformers', 'FAISS', 'JavaScript'],
    githubUrl: 'https://github.com/shreyas-shinde412/ReplyPilot',
    liveUrl: '/projects/replypilot',
  },
  {
    slug: 'modelhub',
    name: 'ModelHub (In Progress)',
    description:
      'A centralized service for managing and serving multiple ML models through a single FastAPI-based API. Supports synchronous and asynchronous inference, intelligent model routing, and background processing via RabbitMQ for scalable execution.',
    tech: ['Python', 'FastAPI', 'RabbitMQ', 'Redis', 'Docker', 'Kubernetes'],
    githubUrl: '/projects/modelhub',
    liveUrl: '/projects/modelhub',
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;

    const cardEls = cards.querySelectorAll('.project-card');

    const trigger = ScrollTrigger.create({
      trigger: cards,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          cardEls,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.15,
            ease: 'power2.out',
          }
        );

        cardEls.forEach((card) => {
          const tags = card.querySelectorAll('.tech-tag-wrapper');
          gsap.fromTo(
            tags,
            { y: 10, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.05,
              delay: 0.4,
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
      id="projects"
      ref={sectionRef}
      className="bg-cream-dark py-16 md:py-[120px]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionLabel text="PROJECTS" />
        <SectionHeading text="Things I've Built" className="mb-4" />
        <p className="font-sans text-lg text-text-muted leading-relaxed mb-12 max-w-lg">
          Production-ready systems that solve real problems.
        </p>

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.name}
              className="project-card bg-white border border-border-light rounded-xl p-8 md:p-10 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-rust/30 transition-all duration-300 opacity-0"
            >
              <h3 className="font-sans text-2xl font-medium tracking-[-0.01em] text-charcoal mb-2">
                {project.name}
              </h3>
              <p className="font-sans text-base text-charcoal leading-[1.7] mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-border-light px-5 py-2.5 font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-charcoal transition-colors duration-300 hover:border-rust hover:text-rust"
                >
                  GitHub
                </a>
                <Link
                  to={project.liveUrl}
                  className="inline-flex items-center justify-center rounded-full bg-rust px-5 py-2.5 font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-white transition-colors duration-300 hover:bg-rust-dark"
                >
                  View Project
                </Link>
              </div>

              <div>
                <span className="inline-block font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-text-muted mb-3">
                  TECH STACK
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <div key={t} className="tech-tag-wrapper">
                      <SkillTag name={t} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
