const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Missing #root element');
}

const showBootError = (label, value) => {
  const details =
    value instanceof Error
      ? `${value.name}: ${value.message}\n\n${value.stack ?? ''}`
      : typeof value === 'string'
        ? value
        : JSON.stringify(value, null, 2);

  document.body.style.margin = '0';
  document.body.style.background = '#0A0A0F';
  rootElement.innerHTML = `
    <pre style="position:fixed;inset:16px;z-index:999999;margin:0;padding:16px;overflow:auto;border-radius:16px;background:#0A0A0F;color:#FCA5A5;border:1px solid rgba(239,68,68,0.4);font:12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;white-space:pre-wrap;">${label}

${details}</pre>
  `;
};

if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_BOOT === 'true') {
  document.body.style.margin = '0';
  document.body.style.background = '#05070B';
  rootElement.innerHTML = `
    <div style="min-height:100vh;background:#05070B;color:#FFFFFF;font-family:system-ui,sans-serif;padding:32px;">
      <div style="font-size:48px;font-weight:800;letter-spacing:0.14em;margin-bottom:16px;">
        DEBUG BOOT OK
      </div>
      <div style="font-size:22px;line-height:1.5;max-width:880px;">
        The browser is executing the NexusClub entry script. Any remaining issue is deeper in the app stack.
      </div>
    </div>
  `;
} else {
  import('react')
    .then(({ StrictMode, createElement, Component }) => {
      const mountApp = async (attempt = 0) => {
        try {
          const appModulePath = `/src/App.tsx?t=${Date.now()}-${attempt}`;
          const [reactDomClient, appModule] = await Promise.all([
            import('react-dom/client'),
            import(/* @vite-ignore */ appModulePath),
          ]);

          const { createRoot } = reactDomClient;
          const App = appModule.default;

          class BootErrorBoundary extends Component {
            constructor(props) {
              super(props);
              this.state = { error: null };
            }

            static getDerivedStateFromError(error) {
              return { error };
            }

            componentDidCatch(error) {
              console.error('React boot error in NexusClub', error);
            }

            render() {
              if (this.state.error) {
                return createElement(
                  'pre',
                  {
                    style: {
                      position: 'fixed',
                      inset: '16px',
                      zIndex: 999999,
                      margin: 0,
                      padding: '16px',
                      overflow: 'auto',
                      borderRadius: '16px',
                      background: '#0A0A0F',
                      color: '#FCA5A5',
                      border: '1px solid rgba(239,68,68,0.4)',
                      font: '12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace',
                      whiteSpace: 'pre-wrap',
                    },
                  },
                  `React render error while booting NexusClub\n\n${this.state.error?.stack ?? this.state.error?.message ?? String(this.state.error)}`,
                );
              }

              return this.props.children;
            }
          }

          import('./index.css').catch((error) => {
            console.error('Failed to load index.css', error);
          });

          createRoot(rootElement).render(
            createElement(
              StrictMode,
              null,
              createElement(
                BootErrorBoundary,
                null,
                createElement(App),
              ),
            ),
          );
        } catch (error) {
          const isTransientDynamicImportFailure =
            error instanceof TypeError &&
            String(error.message || '').includes('Failed to fetch dynamically imported module');

          if (isTransientDynamicImportFailure && attempt < 5) {
            window.setTimeout(() => {
              void mountApp(attempt + 1);
            }, 800 * (attempt + 1));
            return;
          }

          throw error;
        }
      };

      return mountApp();
    })
    .catch((error) => {
      showBootError('Failed while importing the NexusClub app', error);
    });
}
