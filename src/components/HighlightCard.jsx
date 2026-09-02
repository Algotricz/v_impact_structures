import './HighlightCard.css';

/**
 * @param {{ highlight: { title: string, description: string } | null }} props
 * Displays the content associated with a selected residence hotspot.
 */
function HighlightCard({ highlight }) {
  if (!highlight) return null;

  return (
    <aside className="highlight-card" aria-live="polite">
      <p className="highlight-card__label">V Impact Structures</p>
      <h2>{highlight.title}</h2>
      <p>{highlight.description}</p>
    </aside>
  );
}

export default HighlightCard;
