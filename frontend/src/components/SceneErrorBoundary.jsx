import { Component } from "react";

// The 3D scene is the one part of this app that depends on WebGL and can
// fail in ways a normal try/catch can't intercept, since the failure
// surfaces as an error thrown during React's render/commit phase (a lost
// WebGL context, a failed resource fetch inside Suspense, etc). Without a
// boundary here, any such failure unmounts the *entire* app instead of
// just this section. This has to be a class component — error boundaries
// are the one thing React doesn't support as a hook.
export default class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("[AgriculturalScene] render failed, falling back:", error, info?.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
