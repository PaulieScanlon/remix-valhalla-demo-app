import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from '@remix-run/react';

import styles from './styles/app.css';
import remixImageStyles from 'remix-image/remix-image.css';

import ValhallaLogo from './components/valhalla-logo';
import RemixLogo from './components/remix-logo';

export const meta = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1'
});

export const links = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: remixImageStyles },
    { rel: 'icon', type: 'image/x-icon', href: 'https://remix-valhalla-demo-app.vercel.app/images/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'https://remix-valhalla-demo-app.vercel.app/images/favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'https://remix-valhalla-demo-app.vercel.app/images/favicon-32x32.png' }
  ];
};

export const ErrorBoundary = () => {
  return (
    <html>
      <head>
        <title>404!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="prose mx-auto max-w-3xl text-center">
          <div className="p-16">
            <h1 className="text-8xl m-0 mb-4">404</h1>
            <h2 className="m-0 mb-2 text-red-600">Valhalla API Error</h2>
          </div>
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
        <title>Error!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="prose mx-auto max-w-3xl">
          <div className="p-16">
            <h1 className="text-8xl m-0 mb-4">404</h1>
            <h2 className="m-0 mb-2 text-red-600">Valhalla API Error</h2>
          </div>
          <Scripts />
        </main>
      </body>
    </html>
  );
};

const App = () => {
  const name = 'NYC Diary';
  const siteUrl = 'https://remix-valhalla-demo-app.vercel.app';
  const description = 'Gatsby Valhalla Content Hub Remix Demo';
  const defaultImage = `${siteUrl}/images/nyc-diary-open-graph-image.jpg`;
  const keywords = ['Gatsby', 'Valhalla Content Hub', 'Remix'];
  const twitter = '@PaulieScanlon';

  return (
    <html lang="en">
      <head>
        <title>{name}</title>
        <link rel="canonical" href={siteUrl} />
        <meta name="description" content={description} />
        <meta name="image" content={defaultImage} />
        <meta name="image:alt" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        {/* Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={name} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:image:alt" content={description} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={twitter} />
        <meta name="twitter:creator" content={twitter} />
        <meta name="twitter:title" content={name} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={defaultImage} />
        <meta name="twitter:image:alt" content={description} />

        <Meta />
        <Links />
      </head>
      <body className="bg-black text-white">
        <main className="prose mx-auto max-w-none">
          <ValhallaLogo />
          <RemixLogo />
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
