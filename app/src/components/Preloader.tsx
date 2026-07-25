import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for images to load (or timeout after 2s)
    const images = document.querySelectorAll('img');
    let loaded = 0;
    const total = images.length;

    const checkReady = () => {
      loaded++;
      if (loaded >= total || total === 0) {
        setIsReady(true);
      }
    };

    if (total === 0) {
      setTimeout(() => setIsReady(true), 500);
    } else {
      images.forEach((img) => {
        if (img.complete) {
          checkReady();
        } else {
          img.addEventListener('load', checkReady);
          img.addEventListener('error', checkReady);
        }
      });
      // Safety timeout
      setTimeout(() => setIsReady(true), 2000);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    tl.to(text, {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: 'power2.in',
    }).to(container, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power3.inOut',
    });
  }, [isReady, onComplete]);

  return (
    <div
      ref={containerRef}
      className="preloader"
      style={{ zIndex: 60 }}
    >
      <div
        ref={textRef}
        className="font-mono text-2xl font-semibold tracking-[0.08em] text-charcoal"
      >
        SS
      </div>
    </div>
  );
}
