import { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import Timeline from './timeline';
import CallToAction from './call-to-action';

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
        <h1 className="m-0 mb-2 text-center">NYC Diary</h1>
        <Timeline entries={entries} onAnimationComplete={setId} startingIndex={Math.floor(entries.length - 1)} />
      </div>
      <CallToAction id={id} />
    </div>
  );
};

export default IndexRoute;
