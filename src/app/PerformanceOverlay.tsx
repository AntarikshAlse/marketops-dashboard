import { useEffect } from 'react';
import Stats from 'stats.js';

export function PerformanceOverlay() {
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const stats = new Stats();

    // 0 = FPS
    stats.showPanel(0);

    Object.assign(stats.dom.style, {
      position: 'fixed',
      top: '8px',
      right: '8px',
      left: 'auto',
      zIndex: '99999',
      opacity: '0.9',
    });

    document.body.appendChild(stats.dom);

    let frameId = 0;

    const loop = () => {
      stats.begin();
      stats.end();

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
      stats.dom.remove();
    };
  }, []);

  return null;
}
