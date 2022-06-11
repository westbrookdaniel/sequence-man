import * as React from "react";
import { useSpring, animated, UseSpringProps } from "@react-spring/web";
import { usePause } from "./useSequencer";

export interface AnimatableProps {
  style: React.CSSProperties;
}

export type Animatable = React.ComponentType<AnimatableProps>;

export function Animate({
  element,
  springProps,
  noPlay,
}: {
  element: Animatable;
  springProps: UseSpringProps;
  noPlay?: boolean;
}) {
  const AnimatedElement = React.useMemo(() => animated(element), [element]);

  const { play, paused } = usePause();

  const props = useSpring({
    ...springProps,
    onResolve: () => !noPlay && play(),
    pause: !paused,
  });

  return <AnimatedElement style={props} />;
}

export function* animate(
  key: string,
  element: Animatable,
  springProps: UseSpringProps
) {
  yield <Animate key={key} element={element} springProps={springProps} />;
}
