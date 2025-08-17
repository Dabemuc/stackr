export function NoThemeFlashScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var storageKey = 'vite-ui-theme';
              var theme = localStorage.getItem(storageKey);
              if (!theme || theme === 'system') {
                var mql = window.matchMedia('(prefers-color-scheme: dark)');
                theme = mql.matches ? 'dark' : 'light';
              }
              document.documentElement.classList.add(theme);
            } catch (_) {}
          })();
        `,
      }}
    />
  );
}
