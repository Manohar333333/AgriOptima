// Single source of truth for animation timing, mirroring the CSS custom
// properties in index.css. Keeps entrances, exits and scroll reveals
// feeling like one coherent system instead of each component inventing
// its own curve.
export const EASE_OUT = "power3.out"; // decelerate in — for anything entering or responding to input
export const EASE_ENTER_SOFT = "power2.out"; // slightly gentler decel for secondary/staggered elements
export const EASE_IN_OUT = "power2.inOut"; // for crossfades and exits

export const DURATION = {
  instant: 0.12,
  fast: 0.2,
  base: 0.32,
  slow: 0.56,
};

// Small, restrained offsets — motion should read as a shift in focus,
// not a slide-in animation.
export const REVEAL_OFFSET_Y = 18;
export const REVEAL_BLUR_PX = 6;
