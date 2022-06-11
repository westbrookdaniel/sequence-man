var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  Animate: () => Animate,
  animate: () => animate,
  repeat: () => repeat,
  useController: () => useController,
  useFrameManager: () => useFrameManager,
  useManager: () => useManager,
  usePause: () => usePause
});
module.exports = __toCommonJS(src_exports);

// src/useManager.tsx
var React = __toESM(require("react"));
var import_zustand = __toESM(require("zustand"));
var import_rafz = require("@react-spring/rafz");
var useStore = (0, import_zustand.default)((set) => ({
  scenes: [],
  sceneIndex: 0,
  view: /* @__PURE__ */ React.createElement(React.Fragment, null),
  currentScene: null,
  paused: false,
  shouldLoop: false,
  setConfig: (config) => {
    var _a, _b;
    const scenes = (_a = config.scenes) != null ? _a : [];
    const shouldLoop = (_b = config.shouldLoop) != null ? _b : false;
    set((s) => {
      var _a2, _b2;
      const currentScene = (_a2 = scenes[0]) == null ? void 0 : _a2.call(scenes);
      if (s.currentScene || !currentScene) {
        return {
          scenes,
          shouldLoop,
          currentScene: s.currentScene,
          view: s.view
        };
      } else {
        return {
          scenes,
          shouldLoop,
          currentScene,
          view: (_b2 = currentScene.next().value) != null ? _b2 : s.view
        };
      }
    });
  },
  next: () => {
    set((s) => {
      var _a, _b, _c, _d, _e, _f;
      if (s.paused)
        return s;
      const result = (_a = s.currentScene) == null ? void 0 : _a.next();
      if (!result)
        return s;
      if (result.done) {
        let nextSceneIndex = s.sceneIndex + 1;
        let nextScene = (_c = (_b = s.scenes)[nextSceneIndex]) == null ? void 0 : _c.call(_b);
        if (!nextScene && s.shouldLoop) {
          nextSceneIndex = 0;
          nextScene = (_e = (_d = s.scenes)[0]) == null ? void 0 : _e.call(_d);
        }
        if (!nextScene)
          return s;
        const nextResult = nextScene.next();
        return {
          sceneIndex: nextSceneIndex,
          currentScene: nextScene,
          view: (_f = nextResult.value) != null ? _f : s.view
        };
      } else {
        return {
          sceneIndex: s.sceneIndex,
          currentScene: s.currentScene,
          view: result.value
        };
      }
    });
  },
  pause: () => set({ paused: true }),
  play: () => set({ paused: false })
}));
function useController() {
  return useStore((s) => ({
    pause: s.pause,
    play: s.play,
    paused: s.paused,
    next: s.next
  }));
}
function usePause() {
  const { pause, play, paused } = useController();
  React.useEffect(() => {
    pause();
    return () => play();
  }, [pause, play]);
  return { play, paused };
}
function useManager(config) {
  const setConfig = useStore((s) => s.setConfig);
  const next = useStore((s) => s.next);
  const view = useStore((s) => s.view);
  React.useEffect(() => {
    setConfig(config);
  }, [config, setConfig]);
  return { view, next };
}
function useFrameManager(config) {
  const { view, next } = useManager(config);
  React.useEffect(() => {
    function frame() {
      next();
      return true;
    }
    (0, import_rafz.raf)(frame);
    return () => import_rafz.raf.cancel(frame);
  }, [next]);
  return { view };
}

// src/repeat.tsx
function* repeat(frames, element) {
  for (let i = 1; i <= frames; i++) {
    yield element;
  }
}

// src/animate.tsx
var React2 = __toESM(require("react"));
var import_web = require("@react-spring/web");
function Animate({
  element,
  springProps,
  noPlay
}) {
  const AnimatedElement = React2.useMemo(() => (0, import_web.animated)(element), [element]);
  const { play, paused } = usePause();
  const props = (0, import_web.useSpring)(__spreadProps(__spreadValues({}, springProps), {
    onResolve: () => !noPlay && play(),
    pause: !paused
  }));
  return /* @__PURE__ */ React2.createElement(AnimatedElement, {
    style: props
  });
}
function* animate(key, element, springProps) {
  yield /* @__PURE__ */ React2.createElement(Animate, {
    key,
    element,
    springProps
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Animate,
  animate,
  repeat,
  useController,
  useFrameManager,
  useManager,
  usePause
});
//# sourceMappingURL=index.js.map