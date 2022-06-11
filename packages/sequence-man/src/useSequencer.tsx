import * as React from "react";
import create from "zustand";
import { raf } from "@react-spring/rafz";

interface Store {
  scenes: Scene[];
  sceneIndex: number;
  paused: boolean;
  view: JSX.Element;
  currentScene: Generator<JSX.Element, void> | null;
  shouldLoop: boolean;
  setConfig: (config: Config) => void;
  next: () => void;
  pause: () => void;
  play: () => void;
}

type Scene = () => Generator<JSX.Element, void>;

interface Config {
  scenes: Scene[];
  shouldLoop?: boolean;
}

const useStore = create<Store>((set) => ({
  scenes: [],
  sceneIndex: 0,
  view: <></>,
  currentScene: null,
  paused: false,
  shouldLoop: false,
  setConfig: (config: Config) => {
    const { scenes, shouldLoop } = config;
    set((s) => {
      const currentScene = scenes[0]?.();
      if (s.currentScene || !currentScene) {
        return {
          scenes,
          shouldLoop: shouldLoop || false,
          currentScene: s.currentScene,
          view: s.view,
        };
      } else {
        return {
          scenes,
          shouldLoop: shouldLoop || false,
          currentScene,
          view: currentScene.next().value ?? s.view,
        };
      }
    });
  },
  next: () => {
    set((s) => {
      if (s.paused) return s;

      const result = s.currentScene?.next();
      if (!result) return s;

      if (result.done) {
        let nextSceneIndex = s.sceneIndex + 1;
        let nextScene = s.scenes[nextSceneIndex]?.();

        if (!nextScene && s.shouldLoop) {
          nextSceneIndex = 0;
          nextScene = s.scenes[0]?.();
        }
        if (!nextScene) return s;

        const nextResult = nextScene.next();
        return {
          sceneIndex: nextSceneIndex,
          currentScene: nextScene,
          view: nextResult.value ?? s.view,
        };
      } else {
        return {
          sceneIndex: s.sceneIndex,
          currentScene: s.currentScene,
          view: result.value,
        };
      }
    });
  },
  pause: () => set({ paused: true }),
  play: () => set({ paused: false }),
}));

export function useController() {
  return useStore((s) => ({
    pause: s.pause,
    play: s.play,
    paused: s.paused,
    next: s.next,
  }));
}

export function usePause() {
  const { pause, play, paused } = useController();

  React.useEffect(() => {
    pause();
    return () => play();
  }, [pause, play]);

  return { play, paused };
}

export function useSequencer(config: Config) {
  const setConfig = useStore((s) => s.setConfig);
  const next = useStore((s) => s.next);
  const view = useStore((s) => s.view);

  React.useEffect(() => {
    setConfig(config);
  }, [config, setConfig]);

  return { view, next };
}

export function useFrameSequencer(config: Config) {
  const { view, next } = useSequencer(config);

  React.useEffect(() => {
    function frame() {
      next();
      return true;
    }
    raf(frame);
    return () => raf.cancel(frame);
  }, [next]);

  return { view };
}
