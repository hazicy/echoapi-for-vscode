// Webviews receive the editor language in their HTML before modules execute.
export default typeof document !== "undefined"
  ? document.documentElement.lang || navigator.language
  : "en";
