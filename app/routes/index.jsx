import { useState } from 'react';
import { useLoaderData, Link } from '@remix-run/react';

import NycDiaryLogo from '../components/nyc-diary-logo';
import Timeline from '../components/timeline';

export const loader = async () => {
  const { client } = require('../../utils/valhalla-client');

  const query = `
  {
    allContentfulDiary(sort: { fields: date, order: DESC }) {
      nodes {
        id
        title
        weekend
        slug
      }
    }
  }
  `;

  const {
    data: {
      allContentfulDiary: { nodes: entries }
    }
  } = await client.query(query).toPromise();

  return { entries };
};

const IndexRoute = () => {
  const { entries } = useLoaderData();
  const [status, setStatus] = useState({ id: null, entry: null });

  const callback = (id, entry) => {
    setStatus({
      id,
      entry
    });
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen">
      <div className="grid gap-8">
        <div>
          <h1 className="sr-only">NYC Diary</h1>
          <NycDiaryLogo className="mx-auto max-w-2xl px-4" />
          <h2 className="m-0 text-center">Just some stuff i've been doing</h2>
          <p className="m-0 text-center font-light text-sm">
            <a href="https://www.gatsbyjs.com/products/valhalla-content-hub/" target="_blank" rel="noreferrer" className="font-light">
              Gatsby Valhalla Content Hub{' '}
            </a>
            +{' '}
            <a href="https://remix.run/" target="_blank" rel="noreferrer" className="font-light">
              Remix
            </a>{' '}
            Demo by{' '}
            <a href="https://twitter.com/PaulieScanlon/" target="_blank" rel="noreferrer" className="font-light">
              @PaulieScanlon
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center w-full overflow-hidden">
          <h3 className="m-0 text-center text-base text-zinc-500 font-normal h-[30px]">{status.entry}</h3>
          <Timeline entries={entries} callback={callback} startingIndex={Math.floor(entries.length - 1)} />
        </div>
      </div>
      {status.id ? (
        <Link to={`/diary/${status.id}`} prefetch="intent" className="text-sm bg-alt no-underline rounded px-3 py-2 text-center text-white min-w-[120px]">
          Read Entry
        </Link>
      ) : (
        <button className="disabled cursor-not-allowed rounded text-sm bg-white/10 px-3 py-2 text-white/20 min-w-[120px]">Please Wait</button>
      )}
    </div>
  );
};

export default IndexRoute;
