// The legacy two-argument `scrollTo(x, y)` is equivalent to
// `scrollTo({ left: x, top: y, behavior: "auto" })` — and "auto" means
// "defer to the element's computed `scroll-behavior` CSS property."
// Since index.css sets `scroll-behavior: smooth` on <html>, any corrective
// reset-to-top call made with the bare form animates visibly instead of
// snapping. Explicitly passing `behavior: "instant"` bypasses that CSS
// property entirely — this is standard, universally supported behavior
// across browsers, not a hack.
export function resetScrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}
