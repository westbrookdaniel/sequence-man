import { useSequencer, useFrameSequencer, usePause } from ".";
import { render, screen, renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { raf } from "@react-spring/rafz";

vi.mock("zustand");
vi.mock("@react-spring/rafz", () => {
  const raf = vi.fn();
  // @ts-expect-error Not sure how to add this properly
  raf.cancel = vi.fn();
  return { raf };
});

function* scene1() {
  yield <div>First</div>;
  yield <div>Second</div>;
}
function* scene2() {
  yield <div>Third</div>;
  yield* scene1();
}
function* empty() {}

describe("useSequencer", () => {
  test("can run and swap scenes", async () => {
    const { result } = renderHook(() =>
      useSequencer({ scenes: [scene1, scene2] })
    );

    const { rerender } = render(result.current.view);
    expect(screen.getByText("First")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("Second")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("Third")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("First")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  test("will maintain last frame if not looping", async () => {
    const { result } = renderHook(() => useSequencer({ scenes: [scene1] }));

    const { rerender } = render(result.current.view);
    expect(screen.getByText("First")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("Second")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("Second")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  test("will loop with shouldLoop", async () => {
    const { result } = renderHook(() =>
      useSequencer({ scenes: [scene1], shouldLoop: true })
    );

    const { rerender } = render(result.current.view);
    expect(screen.getByText("First")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("Second")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("First")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("Second")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("First")).toBeInTheDocument();
  });

  test("handle no scenes", async () => {
    const { result } = renderHook(() => useSequencer({ scenes: [] }));

    const { asFragment, rerender } = render(result.current.view);
    expect(asFragment()).toMatchInlineSnapshot("<DocumentFragment />");

    act(() => result.current.next());
    rerender(result.current.view);
    expect(asFragment()).toMatchInlineSnapshot("<DocumentFragment />");
  });

  test("handle empty scene", async () => {
    const { result } = renderHook(() => useSequencer({ scenes: [empty] }));

    const { asFragment, rerender } = render(result.current.view);
    expect(asFragment()).toMatchInlineSnapshot("<DocumentFragment />");

    act(() => result.current.next());
    rerender(result.current.view);
    expect(asFragment()).toMatchInlineSnapshot("<DocumentFragment />");
  });

  test("handle moving to empty scene", async () => {
    const { result } = renderHook(() =>
      useSequencer({ scenes: [scene1, empty] })
    );

    act(() => result.current.next());
    act(() => result.current.next());
    const { rerender } = render(result.current.view);
    expect(screen.getByText("Second")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  test("handle being paused", async () => {
    const { result } = renderHook(() => useSequencer({ scenes: [scene1] }));
    const { result: pause } = renderHook(() => usePause());

    expect(pause.current.paused).toBe(true);

    const { rerender } = render(result.current.view);
    expect(screen.getByText("First")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("First")).toBeInTheDocument();

    expect(pause.current.paused).toBe(true);
    act(() => pause.current.play());
    expect(pause.current.paused).toBe(false);
    rerender(result.current.view);
    expect(screen.getByText("First")).toBeInTheDocument();

    act(() => result.current.next());
    rerender(result.current.view);
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});

describe("useFrameSequencer", () => {
  test("should run every frame", async () => {
    const { result } = renderHook(() =>
      useFrameSequencer({ scenes: [scene1] })
    );
    const { rerender } = render(result.current.view);
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(raf).toHaveBeenCalled();

    act(() => {
      // @ts-expect-error raf is currently mocked
      const frameReturn = raf.mock.lastCall[0]();
      expect(frameReturn).toBe(true);
    });
    rerender(result.current.view);
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
