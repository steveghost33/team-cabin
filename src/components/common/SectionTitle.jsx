import '../../styles/components/SectionTitle.css';

export default function SectionTitle({ children, color }) {
  const style = color ? { '--section-title-color': color } : undefined;

  return (
    <div className="section-title" style={style}>
      <div className="section-title__line" aria-hidden="true" />
      {children}
      <div className="section-title__line" aria-hidden="true" />
    </div>
  );
}
