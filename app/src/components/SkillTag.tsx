interface SkillTagProps {
  name: string;
}

export default function SkillTag({ name }: SkillTagProps) {
  return (
    <span className="inline-block font-mono text-[13px] font-normal tracking-[0.04em] text-rust bg-rust-light px-5 py-2.5 rounded-full hover:bg-[rgba(184,85,54,0.15)] transition-colors duration-200">
      {name}
    </span>
  );
}
