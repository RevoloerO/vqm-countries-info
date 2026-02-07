import { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ value, duration = 800, suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numericValue)) {
      setDisplay(value);
      return;
    }

    // Cancel any in-flight animation
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const startValue = 0;
    startRef.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (numericValue - startValue) * eased;

      if (Number.isInteger(numericValue)) {
        setDisplay(Math.round(current));
      } else {
        setDisplay(parseFloat(current.toFixed(2)));
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  const formatted = typeof display === 'number'
    ? display.toLocaleString('en-US')
    : display;

  return <span className="animated-counter">{formatted}{suffix}</span>;
};

export default AnimatedCounter;
