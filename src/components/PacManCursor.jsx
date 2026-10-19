import { useEffect, useRef } from 'react';

/**
 * PacMan custom cursor.
 * - Idle / moving  → mouth OPEN  (classic PacMan)
 * - Mouse held     → mouth CLOSED (full circle — he chomped!)
 * Uses direct DOM refs so there are zero React re-renders on every mousemove.
 */
export default function PacManCursor() {
  const wrapperRef = useRef(null);
  const mouthRef   = useRef(null);
  const eyeRef     = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const mouth   = mouthRef.current;
    if (!wrapper || !mouth) return;

    /* ── position tracking ─────────────────────────────────── */
    const onMove = (e) => {
      wrapper.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      wrapper.style.opacity   = '1';
    };

    /* ── click state ───────────────────────────────────────── */
    const onDown = () => {
      // Close mouth — hide the mouth-slice polygon
      mouth.setAttribute('opacity', '0');
    };

    const onUp = () => {
      // Open mouth again
      mouth.setAttribute('opacity', '1');
    };

    /* ── leave / enter window ──────────────────────────────── */
    const onLeave  = () => { wrapper.style.opacity = '0'; };
    const onEnter  = () => { wrapper.style.opacity = '1'; };

    document.addEventListener('mousemove',  onMove);
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        /* shift so the mouth-tip is the hot-spot */
        marginLeft:    '-4px',
        marginTop:     '-16px',
        pointerEvents: 'none',
        zIndex:        999999,
        opacity:       0,
        willChange:    'transform',
        transition:    'opacity 0.15s',
      }}
      aria-hidden
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <circle cx="50" cy="50" r="48" fill="#FFE000" />

        {/* Mouth slice — hidden on click */}
        <polygon
          ref={mouthRef}
          points="50,50 100,18 100,82"
          fill="black"
        />

        {/* Eye */}
        <circle ref={eyeRef} cx="62" cy="22" r="9" fill="black" />
      </svg>
    </div>
  );
}
