import { useState } from 'react';
import { useLoaderData, Link } from '@remix-run/react';

import Logo from '../components/logo';
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

  const [id, setId] = useState(null);

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen">
      <div>
        <h1 className="sr-only">NYC Diary</h1>
        <Logo />
        <Timeline entries={entries} onAnimationComplete={setId} startingIndex={Math.floor(entries.length - 1)} />
      </div>
      {id ? (
        <Link to={`/diary/${id}`} prefetch="intent" className="text-sm bg-alt no-underline px-3 py-2 text-center text-white min-w-[120px]">
          Read Entry
        </Link>
      ) : (
        <button className="disabled cursor-not-allowed text-sm bg-white/10 px-3 py-2 text-white/20 min-w-[120px]">Please Wait</button>
      )}
    </div>
  );
};

export default IndexRoute;
