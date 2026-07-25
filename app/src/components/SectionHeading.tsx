import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  text: string;
  className?: string;
  light?: boolean;
}

export default function SectionHeading({ text, className = '', light = false }: SectionHeadingProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Split text into characters
    const textContent = el.textContent || '';
    el.replaceChildren();
    el.style.overflow = 'hidden';

    const chars: HTMLSpanElement[] = [];
    for (const char of textContent) {
      const wrapper = document.createElement('span');
      wrapper.style.display = 'inline-block';
      wrapper.style.overflow = 'hidden';
      wrapper.style.verticalAlign = 'top';

      const inner = document.createElement('span');
      inner.textContent = char === ' ' ? '\u00A0' : char;
      inner.style.display = 'inline-block';
      inner.style.willChange = 'transform, opacity';

      wrapper.appendChild(inner);
      el.appendChild(wrapper);
      chars.push(inner);
    }

    // Set initial state
    gsap.set(chars, { y: '100%', opacity: 0 });

    // Scroll-triggered animation
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        gsap.to(chars, {
          y: '0%',
          opacity: 1,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power2.out',
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [text]);

  return (
    <h2
      ref={containerRef}
      className={`font-sans text-[clamp(32px,5vw,64px)] font-normal tracking-[-0.02em] leading-[1.1] mb-8 ${
        light ? 'text-white' : 'text-charcoal'
      } ${className}`}
    >
      {text}
    </h2>
  );
}
