import { ReactNode } from 'react';

interface ContentSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ContentSection({ title, children, className = '' }: ContentSectionProps) {
  return (
    <section className={`mb-8 ${className}`}>
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">{title}</h2>
      {children}
    </section>
  );
}

interface ContentListProps {
  items: string[];
}

export function ContentList({ items }: ContentListProps) {
  return (
    <ul className="list-disc pl-6 text-slate-700 space-y-2">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
}

interface ContentTextProps {
  children: ReactNode;
  className?: string;
}

export function ContentText({ children, className = '' }: ContentTextProps) {
  return <p className={`text-slate-700 ${className}`}>{children}</p>;
}
