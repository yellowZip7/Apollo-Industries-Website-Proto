// A tiny signal between the opening animation (Intro) and the hero backdrop (DotSun): while the
// intro plays, the hero's sun waits; when the intro starts to dissolve, the sun pops in.

export const introState = { playing: false };

const listeners = new Set<() => void>();

export function setIntroPlaying(playing: boolean): void {
  introState.playing = playing;
}

/** Called when the intro begins to reveal the site. Safe to call more than once. */
export function revealIntro(): void {
  introState.playing = false;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

/** Runs `listener` when the intro starts revealing the site. Returns a function that cancels. */
export function onIntroReveal(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
