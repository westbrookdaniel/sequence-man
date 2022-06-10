import { vi } from "vitest";
import { render, renderHook, waitFor } from "@testing-library/react";
import { animate, AnimatableProps, useController } from ".";
import { Globals } from "@react-spring/web";

vi.mock("zustand");

Globals.assign({
  skipAnimation: true,
});

const Comp = ({ style }: AnimatableProps) => <div style={style}>Foo</div>;

describe("animate", () => {
  test("should pause when rendered and resume when complete", async () => {
    const control = renderHook(() => useController());

    expect(control.result.current.paused).toBe(false);

    const gen = animate("key", Comp, {
      from: { opacity: 0 },
      to: { opacity: 1 },
    });
    expect(control.result.current.paused).toBe(false);

    const res = gen.next();
    expect(control.result.current.paused).toBe(false);
    if (!res.value) throw new Error("Shouldn't be done");

    render(res.value);
    expect(control.result.current.paused).toBe(true);

    // Animation occurs here due to `skipAnimation`

    await waitFor(() => {
      expect(control.result.current.paused).toBe(false);
    });
  });
});
