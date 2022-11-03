import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from '@remix-run/react';

import styles from './styles/app.css';

export const meta = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1'
});

export const links = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export const ErrorBoundary = () => {
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="prose mx-auto max-w-3xl">
          <h1>404</h1>
          <p>Page Not Found</p>
          <Scripts />
        </main>
      </body>
    </html>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="prose mx-auto max-w-3xl">
          <h1>404</h1>
          <p>
            {caught.status} {caught.statusText}
          </p>
          <Scripts />
        </main>
      </body>
    </html>
  );
};

const App = () => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="prose mx-auto max-w-3xl">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </main>
      </body>
    </html>
  );
};

export default App;
