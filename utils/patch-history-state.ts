export const patchHistoryState = () => {
  if (typeof window === "undefined") {
    return;
  }

  // get the current history stack index, if it doesn't exist, initialize it to 0
  const getCurrentIdx = (): number => window.history?.state?.idx ?? 0;

  const orinReplaceState = window.history.replaceState.bind(window.history);
  window.history.replaceState = (state, title, url) => {
    const idx = getCurrentIdx();

    return orinReplaceState({ ...state, idx }, title, url);
  };

  const orinPushState = window.history.pushState.bind(window.history);
  window.history.pushState = (state, title, url) => {
    const idx = getCurrentIdx() + 1;

    return orinPushState({ ...state, idx }, title, url);
  };
};
