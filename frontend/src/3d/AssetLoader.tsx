import { useProgress } from '@react-three/drei';

export function useAssetProgress() {
  return useProgress();
}

export function AssetPreloader({ onLoaded }: { onLoaded?: () => void }) {
  const { progress, active } = useProgress();

  if (progress >= 100 && !active) {
    onLoaded?.();
  }

  return null;
}