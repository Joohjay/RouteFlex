import { useState, useEffect } from 'react';

type Quality = 'low' | 'medium' | 'high';

function detectQuality(): Quality {
  if (typeof window === 'undefined') return 'high';
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return 'low';
  const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo
    ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string
    : '';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isLowEnd = /Intel HD Graphics|Intel UHD Graphics|Mali|Adreno 5|PowerVR/i.test(renderer);
  if (isMobile || isLowEnd) return 'low';
  if (renderer.includes('Intel') || renderer.includes('AMD Radeon R')) return 'medium';
  return 'high';
}

export function useDeviceQuality(): Quality {
  const [quality, setQuality] = useState<Quality>('high');

  useEffect(() => {
    setQuality(detectQuality());
  }, []);

  return quality;
}