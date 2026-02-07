import { useState } from 'react';

const CollapsibleSection = ({ icon, title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="collapsible-section">
      <div
        className="collapsible-header"
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(o => !o);
          }
        }}
      >
        <span className="details-icon">{icon}</span>
        <span className="details-title"><u>{title}</u>:</span>
        <span className="collapsible-arrow">{open ? '▼' : '▶'}</span>
      </div>
      {open && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
