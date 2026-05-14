import '../../styles/components/SectionTitle.css';

export default function SectionTitle({ children, color, as: Tag = 'h2' }) {
  const style = color ? { '--section-title-color': color } : undefined;

  return (
    <Tag className="section-title" style={style}>
      <span className="section-title__line" aria-hidden="true" />
      {children}
      <span className="section-title__line" aria-hidden="true" />
    </Tag>
  );
}
