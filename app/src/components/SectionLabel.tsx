interface SectionLabelProps {
  text: string;
  className?: string;
}

export default function SectionLabel({ text, className = '' }: SectionLabelProps) {
  return (
    <span
      className={`inline-block font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-text-muted mb-4 ${className}`}
    >
      {text}
    </span>
  );
}
