import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { resetScrollToTop } from "./utils/scrollTop";

// Refresh/reload must always land at the top of the page. A single early
// call isn't enough, because two independent things can move the
// viewport after this script runs:
//
//  1. `history.scrollRestoration = "manual"` (set below) only suppresses
//     the *history entry's* own auto-restore on back/forward navigation.
//     It has no effect on a browser's separate "restore the position you
//     were at on reload" feature, which is a different mechanism.
//  2. That reload-restore feature is asynchronous — it can reapply a
//     remembered offset once the document is tall enough again for that
//     offset to be valid, which may happen only after React, web fonts,
//     or the 3D canvas finish laying out the page. Chromium browsers
//     don't all trigger this at the same point in the lifecycle, which
//     is why Chrome and Edge behave differently here.
//
// Rather than guess with a timer, we hook the two real lifecycle events
// this can happen on: `pageshow` (fires on normal load AND on
// back/forward-cache restoration) and `load` (fires once, after the
// document and its resources have finished loading — i.e. after the
// point where late layout growth could trigger a browser's own
// restoration). Both fire at most once and are removed with `{ once: true }`,
// so neither can interfere with scrolling after initialization.
// `resetScrollToTop` uses `behavior: "instant"` so none of these calls
// animate visibly, regardless of where the page happened to be.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
resetScrollToTop();
window.addEventListener("pageshow", resetScrollToTop, { once: true });
window.addEventListener("load", resetScrollToTop, { once: true });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
