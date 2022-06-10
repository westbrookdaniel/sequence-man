import { repeat } from ".";

describe("repeat", () => {
  test("repeats for exact frames", () => {
    const el = <div>Foo</div>;
    const gen = repeat(10, el);

    for (let i = 1; i <= 10; i++) {
      const result = gen.next();
      expect(result.done).toBe(false);
      expect(result.value).toBe(el);
    }

    const result = gen.next();
    expect(result.done).toBe(true);
    expect(result.value).toBe(undefined);

    expect.assertions(22);
  });
});
