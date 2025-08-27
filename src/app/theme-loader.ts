/**
 * Small runtime theme loader for Angular Material prebuilt theme.
 * This appends a <link> to the head so the CSS is fetched at runtime
 * instead of being included in the initial build.
 */
export function loadMaterialTheme(href = 'https://unpkg.com/@angular/material@20.2.0/prebuilt-themes/indigo-pink.css') {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = (err) => reject(err);
    document.head.appendChild(link);
  });
}
