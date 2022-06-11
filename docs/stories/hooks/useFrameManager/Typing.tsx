import { repeat, useFrameSequencer } from "sequence-man";

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

const textContent = "Hello World";

function* typing() {
  const message = textContent;
  let str = "";
  while (str.length !== message.length) {
    str += message[str.length];
    yield* repeat(6, <Logo>{str}</Logo>);
  }
}

function* blink() {
  for (let i = 1; i <= 5; i++) {
    yield* repeat(45, <Logo>{textContent}</Logo>);
    yield* repeat(45, <Logo withoutBox>{textContent}</Logo>);
  }
  yield* repeat(45, <Logo>{textContent}</Logo>);
}

function* deleting() {
  let str = textContent;
  while (str.length > 0) {
    str = str.split("").slice(0, -1).join("");
    yield* repeat(6, <Logo>{str}</Logo>);
  }
  yield* repeat(12, <Logo></Logo>);
}

export default function Typing() {
  const { view } = useFrameSequencer({
    scenes: [typing, blink, deleting],
    shouldLoop: true,
  });

  return <span className="font-mono">{view}</span>;
}
