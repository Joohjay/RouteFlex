import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDeviceQuality } from './hooks/useDeviceQuality';

interface SceneContextValue {
  quality: 'low' | 'medium' | 'high';
  dpr: [number, number] | number;
  shadows: boolean;
  postProcessing: boolean;
  reduceQuality: () => void;
}

const SceneContext = createContext<SceneContextValue>({
  quality: 'high',
  dpr: [1, 1.5],
  shadows: true,
  postProcessing: true,
  reduceQuality: () => {},
});

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const deviceQuality = useDeviceQuality();
  const [quality, setQuality] = useState(deviceQuality);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setQuality(deviceQuality);
  }, [deviceQuality]);

  const reduceQuality = useCallback(() => {
    if (!reduced) {
      setReduced(true);
      setQuality('low');
    }
  }, [reduced]);

  const config = {
    quality,
    dpr: quality === 'high' ? [1, 1.5] as [number, number] : quality === 'medium' ? [1, 1] as [number, number] : 1 as const,
    shadows: quality !== 'low',
    postProcessing: quality === 'high',
    reduceQuality,
  };

  return (
    <SceneContext.Provider value={config}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  return useContext(SceneContext);
}