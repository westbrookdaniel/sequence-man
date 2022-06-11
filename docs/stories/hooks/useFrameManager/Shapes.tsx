import * as React from "react";
import { repeat, useFrameManager, animate, Animate } from "sequence-man";

function Square({ className = "", ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={`absolute w-16 h-16 bg-blue-500 ${className}`} {...props} />
  );
}

function Circle({ className = "", ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={`absolute w-16 h-16 top-[100px] rounded-full bg-purple-500 ${className}`}
      {...props}
    />
  );
}

function* race() {
  yield* repeat(60, <></>);
  yield (
    <div>
      <Animate
        key="fade-square"
        element={Square}
        springProps={{
          from: { opacity: 0 },
          to: { opacity: 1 },
        }}
      />
      <Animate
        key="fade-circle"
        element={Circle}
        springProps={{
          from: { opacity: 0 },
          to: { opacity: 1 },
        }}
      />
    </div>
  );
  yield (
    <div>
      <Animate
        key="right-square"
        element={Square}
        noPlay
        springProps={{
          from: { left: 0 },
          to: { left: 100 },
        }}
      />
      <Animate
        key="right-circle"
        element={Circle}
        springProps={{
          from: { left: 0 },
          to: { left: 100 },
          delay: 200,
        }}
      />
    </div>
  );
  yield (
    <div>
      <Square className="left-[100px]" />
      <Animate
        key="fadeout-circle"
        element={Circle}
        springProps={{
          from: { left: 100, opacity: 1 },
          to: { left: 100, opacity: 0 },
        }}
      />
    </div>
  );
}

function* move() {
  yield* animate("down", Square, {
    from: { left: 100, top: 0 },
    to: { left: 0, top: 100 },
  });
}

function* fadeOut() {
  yield* animate("fadeout-square", Square, {
    from: { left: 0, top: 100, opacity: 1 },
    to: { left: 0, top: 100, opacity: 0 },
  });
}

function* red() {
  yield* repeat(30, <Square className="top-[100px] bg-red-500" />);
}

export default function Shapes() {
  const { view } = useFrameManager({
    scenes: [race, move, fadeOut, race, move, red],
  });

  return <div className="relative">{view}</div>;
}
