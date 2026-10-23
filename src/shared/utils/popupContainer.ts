/** Keep legacy popup controls inside the active drawer's focus boundary. */
export const getPopupContainer = (trigger?: HTMLElement): HTMLElement =>
  trigger?.closest<HTMLElement>("[data-echoapi-drawer]") ?? document.body;
