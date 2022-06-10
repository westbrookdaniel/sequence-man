export function* repeat(frames: number, element: JSX.Element) {
  for (let i = 1; i <= frames; i++) {
    yield element;
  }
}
