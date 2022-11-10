import { useState } from 'react';
import { Link, useLoaderData } from '@remix-run/react';
import Timeline from '../timeline';
import CallToAction from '../call-to-action';

export const loader = async ({ params }) => {
  const { client } = require('../../../utils/valhalla-client');

  const { id } = params;

  const allQuery = `
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

  const idQuery = `
    query DiaryEntry($id: String) {
      contentfulDiary(id:{ eq: $id} ) {
          id
          title
          date
          weekend
          entry {
            entry
          }
          photo {
            url
          }
      }
    }
  `;

  const {
    data: { contentfulDiary: diary }
  } = await client.query(idQuery, { id: id }).toPromise();

  const {
    data: {
      allContentfulDiary: { nodes: entries }
    }
  } = await client.query(allQuery).toPromise();

  if (!diary || !entries) {
    throw new Response('Not Found', {
      status: 404
    });
  }

  return {
    diary,
    entries
  };
};

const DiaryRoute = () => {
  const { diary, entries } = useLoaderData();
  const [id, setId] = useState(null);

  return (
    <div className="py-4">
      <div className="grid gap-8">
        <Link to="/" className="flex gap-1 items-center no-underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back
        </Link>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h1 className="font-black text-3xl m-0">{diary.title}</h1>
            <p className="m-0 mb-8">{diary.entry.entry}</p>
            <img className="object-cover w-full h-full m-0" src={diary.photo.url} alt={diary.title} />
          </div>
          <div className="flex flex-col gap-6 items-center">
            <Timeline entries={entries} onAnimationComplete={setId} startingIndex={entries.findIndex((e) => e.id === diary.id)} />
            <div>
              <CallToAction id={id} />
            </div>
          </div>
        </div>
      </div>

      {/* <pre>{JSON.stringify(entries, null, 2)}</pre> */}
    </div>
  );
};

export default DiaryRoute;
