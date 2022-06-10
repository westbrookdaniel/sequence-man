import { repeat, useFrameManager } from "sequence-man";

interface WithChildren {
  children?: React.ReactNode;
}

function Box() {
  return (
    <span className="inline-block ml-[2px] -mb-[1px] h-[14px] w-[8px] bg-black" />
  );
}

function Logo({
  children,
  withoutBox,
}: WithChildren & { withoutBox?: boolean }) {
  return (
    <>
      {children}
      {withoutBox ? null : <Box />}
    </>
  );
}

const logoType = "Daniel Westbrook";

function* typing() {
  const message = logoType;
  let str = "";
  while (str.length !== message.length) {
    str += message[str.length];
    yield* repeat(6, <Logo>{str}</Logo>);
  }
}

function* blink() {
  for (let i = 1; i <= 5; i++) {
    yield* repeat(45, <Logo>{logoType}</Logo>);
    yield* repeat(45, <Logo withoutBox>{logoType}</Logo>);
  }
  yield* repeat(45, <Logo>{logoType}</Logo>);
}

function* deleting() {
  let str = logoType;
  while (str.length > 0) {
    str = str.split("").slice(0, -1).join("");
    yield* repeat(6, <Logo>{str}</Logo>);
  }
  yield* repeat(12, <Logo></Logo>);
}

export default function Typing() {
  const { view } = useFrameManager({
    scenes: [typing, blink, deleting],
    shouldLoop: true,
  });

  return <span className="font-mono">{view}</span>;
}
