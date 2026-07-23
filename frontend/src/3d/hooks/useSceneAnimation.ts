export interface SceneAnimationHandle {
  playEntry: () => Promise<void>;
  playExit: () => Promise<void>;
}

export function useSceneAnimation(): SceneAnimationHandle {
  const playEntry = async () => {};
  const playExit = async () => {};

  return { playEntry, playExit };
}