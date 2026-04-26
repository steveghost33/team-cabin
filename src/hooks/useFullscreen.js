import { useState, useEffect, useCallback } from 'react';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(
      !!document.fullscreenElement || !!document.webkitFullscreenElement
    );

    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    handler();

    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  const enterFullscreen = useCallback(async () => {
    const el = document.documentElement;
    if (document.fullscreenElement || document.webkitFullscreenElement) return true;

    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      return true;
    } catch {
      return false;
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen && document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
        await document.webkitExitFullscreen();
      }
    } catch {
      // browser may reject if not in fullscreen
    }
  }, []);

  return { isFullscreen, enterFullscreen, exitFullscreen };
}
