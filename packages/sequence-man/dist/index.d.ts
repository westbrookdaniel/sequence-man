import * as React from 'react';
import { UseSpringProps } from '@react-spring/web';

declare type Scene = () => Generator<JSX.Element, void>;
interface Config {
    scenes: Scene[];
    shouldLoop?: boolean;
}
declare function useController(): {
    pause: () => void;
    play: () => void;
    paused: boolean;
    next: () => void;
};
declare function usePause(): {
    play: () => void;
    paused: boolean;
};
declare function useManager(config: Config): {
    view: JSX.Element;
    next: () => void;
};
declare function useFrameManager(config: Config): {
    view: JSX.Element;
};

declare function repeat(frames: number, element: JSX.Element): Generator<JSX.Element, void, unknown>;

interface AnimatableProps {
    style: React.CSSProperties;
}
declare type Animatable = React.ComponentType<AnimatableProps>;
declare function Animate({ element, springProps, noPlay, }: {
    element: Animatable;
    springProps: UseSpringProps;
    noPlay?: boolean;
}): JSX.Element;
declare function animate(key: string, element: Animatable, springProps: UseSpringProps): Generator<JSX.Element, void, unknown>;

export { Animatable, AnimatableProps, Animate, animate, repeat, useController, useFrameManager, useManager, usePause };
