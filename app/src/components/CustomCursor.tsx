import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const isHoveringRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Only on desktop
    if (window.innerWidth < 992) return;

    document.body.classList.add('custom-cursor-active');

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      // Check if hovering interactive element
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [data-cursor-hover], input, textarea');
      isHoveringRef.current = !!isInteractive;
    };

    const animate = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Dot follows precisely
      dot.style.transform = `translate3d(${posRef.current.x - 3}px, ${posRef.current.y - 3}px, 0)`;

      // Ring follows with lerp
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.12;

      const ringSize = isHoveringRef.current ? 64 : 40;
      const ringOffset = ringSize / 2;
      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;
      ring.style.transform = `translate3d(${ringPosRef.current.x - ringOffset}px, ${ringPosRef.current.y - ringOffset}px, 0)`;
      ring.style.borderColor = isHoveringRef.current
        ? 'rgba(184, 85, 54, 0.45)'
        : 'white';

      // Toggle blend mode: use difference (inverse-like) only when not hovering
      const blend = isHoveringRef.current ? 'normal' : 'difference';
      ring.style.mixBlendMode = blend;

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 992) return null;

  return (
    <div className="hidden lg:block" aria-hidden="true">
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full pointer-events-none z-[100]"
        style={{
          willChange: 'transform',
          backgroundColor: 'white',
          mixBlendMode: 'difference',
        }}
      />
      {/* Outer Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border pointer-events-none z-[100] transition-[width,height,border-color] duration-300"
        style={{
          width: 40,
          height: 40,
          borderColor: 'white',
          backgroundColor: 'transparent',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
