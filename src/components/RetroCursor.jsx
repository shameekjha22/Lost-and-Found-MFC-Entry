import { useEffect, useRef } from 'react';

/**
 * Retro Pixel Hand Cursor with animated trail of orange arcade dots.
 * Hand design matches the uploaded classic 8-bit pixel pointer hand cursor.
 * When clicking / mousedown: slight press-down scale effect.
 * Orange dots trail behind the tip of the pointing finger.
 */
export default function RetroCursor() {
  const cursorRef = useRef(null);
  const trailContainerRef = useRef(null);
  const dotsRef = useRef([]);
  const lastPosRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const container = trailContainerRef.current;
    if (!cursor || !container) return;

    // Create a pool of reusable DOM dots for max performance (60fps, no GC pauses)
    const MAX_DOTS = 18;
    const dotsPool = [];

    for (let i = 0; i < MAX_DOTS; i++) {
      const dot = document.createElement('div');
      dot.className = 'retro-trail-dot';
      dot.style.position = 'fixed';
      dot.style.pointerEvents = 'none';
      dot.style.width = '7px';
      dot.style.height = '7px';
      dot.style.backgroundColor = '#f97316'; // vibrant arcade orange
      dot.style.boxShadow = '0 0 6px #ea580c, 0 0 10px #fb923c';
      dot.style.borderRadius = '1px'; // pixel-styled square dot
      dot.style.opacity = '0';
      dot.style.zIndex = '999998';
      dot.style.transform = 'translate(-50%, -50%)';
      dot.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
      container.appendChild(dot);
      dotsPool.push({ el: dot, active: false, x: 0, y: 0, life: 0 });
    }
    dotsRef.current = dotsPool;

    let dotIndex = 0;
    const spawnDot = (x, y) => {
      const item = dotsPool[dotIndex % MAX_DOTS];
      dotIndex++;
      
      item.x = x;
      item.y = y;
      item.active = true;
      item.life = 1.0;

      const el = item.el;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.opacity = '0.9';
      el.style.transform = 'translate(-50%, -50%) scale(1)';

      // Trigger decay
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translate(-50%, -50%) scale(0.3)';
      }, 40);
    };

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // The tip of the pointing finger is at top-left (hotspot x: 7, y: 1)
      cursor.style.transform = `translate(${x - 8}px, ${y - 2}px)`;
      cursor.style.opacity = '1';

      // Spawn orange dot if cursor moved enough distance
      const dist = Math.hypot(x - lastPosRef.current.x, y - lastPosRef.current.y);
      if (dist > 14) {
        // Spawn dot trailing slightly behind finger tip
        spawnDot(x, y + 8);
        lastPosRef.current = { x, y };
      }
    };

    const onDown = () => {
      cursor.style.transform += ' scale(0.92) translateY(2px)';
      // Burst a couple extra orange dots on click
      spawnDot(lastPosRef.current.x - 3, lastPosRef.current.y + 4);
      spawnDot(lastPosRef.current.x + 3, lastPosRef.current.y + 4);
    };

    const onUp = () => {
      cursor.style.transform = cursor.style.transform.replace(' scale(0.92) translateY(2px)', '');
    };

    const onLeave = () => {
      cursor.style.opacity = '0';
    };
    const onEnter = () => {
      cursor.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <>
      {/* Container for trailing orange dots */}
      <div ref={trailContainerRef} aria-hidden style={{ pointerEvents: 'none' }} />

      {/* Retro Pixel Pointer Hand Cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 999999,
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.15s ease',
        }}
        aria-hidden
      >
        <svg
          width="32"
          height="38"
          viewBox="0 0 24 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            imageRendering: 'pixelated',
            filter: 'drop-shadow(2px 3px 0px rgba(0,0,0,0.85))',
          }}
        >
          {/* Pixelated Hand Base (SVG pixel art matching the exact uploaded image) */}
          {/* White interior fill */}
          <path
            d="M 8 2 L 11 2 L 11 9 L 14 9 L 14 11 L 18 11 L 18 12 L 21 12 L 21 21 L 20 21 L 20 23 L 19 23 L 19 25 L 8 25 L 8 23 L 7 23 L 7 21 L 5 21 L 5 19 L 4 19 L 4 17 L 3 17 L 3 13 L 2 13 L 2 11 L 5 11 L 5 13 L 7 13 L 7 9 L 8 9 Z"
            fill="#FFFFFF"
          />

          {/* Black pixel outlines */}
          {/* Index finger tip and shaft */}
          <rect x="8" y="1" width="3" height="1" fill="#000000" />
          <rect x="7" y="2" width="1" height="14" fill="#000000" />
          <rect x="11" y="2" width="1" height="7" fill="#000000" />

          {/* Middle finger tip and dividers */}
          <rect x="11" y="8" width="4" height="1" fill="#000000" />
          <rect x="14" y="9" width="1" height="6" fill="#000000" />

          {/* Ring finger tip and dividers */}
          <rect x="15" y="10" width="3" height="1" fill="#000000" />
          <rect x="18" y="11" width="1" height="6" fill="#000000" />

          {/* Pinky tip and right border */}
          <rect x="19" y="11" width="2" height="1" fill="#000000" />
          <rect x="21" y="12" width="1" height="9" fill="#000000" />
          <rect x="20" y="21" width="1" height="2" fill="#000000" />
          <rect x="19" y="23" width="1" height="2" fill="#000000" />

          {/* Bottom wrist edge */}
          <rect x="8" y="25" width="11" height="1" fill="#000000" />

          {/* Left thumb border */}
          <rect x="7" y="23" width="1" height="2" fill="#000000" />
          <rect x="6" y="21" width="1" height="2" fill="#000000" />
          <rect x="5" y="19" width="1" height="2" fill="#000000" />
          <rect x="4" y="17" width="1" height="2" fill="#000000" />
          <rect x="3" y="15" width="1" height="2" fill="#000000" />
          <rect x="2" y="13" width="1" height="2" fill="#000000" />
          <rect x="1" y="11" width="1" height="2" fill="#000000" />
          <rect x="2" y="10" width="3" height="1" fill="#000000" />
          <rect x="5" y="11" width="1" height="2" fill="#000000" />
          <rect x="6" y="13" width="1" height="3" fill="#000000" />
        </svg>
      </div>
    </>
  );
}
