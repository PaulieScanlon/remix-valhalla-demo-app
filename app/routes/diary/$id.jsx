import { useState } from 'react';
import { Link, useLoaderData } from '@remix-run/react';
import Image from 'remix-image';

import Logo from '../../components/logo';

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
            title
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
    <div>
      <div className="mx-auto max-w-4xl flex items-center min-h-screen">
        <div className="grid md:grid-cols-2 gap-16 p-16">
          <div className="-rotate-6">
            <div className="flex flex-col justify-center bg-white p-4">
              <Image
                loaderUrl="/api/image"
                src={diary.photo.url}
                placeholder="blur"
                alt={diary.photo.title}
                className="w-full m-0"
                responsive={[
                  {
                    size: {
                      width: 300,
                      height: 300
                    },
                    maxWidth: 400
                  }
                ]}
              />
              <p className="font-nanum text-3xl bg-transparent text-gray-600 text-center m-0 mt-4">{diary.photo.title}</p>
            </div>
          </div>

          <div>
            <Logo />
            <h2 className="font-black text-3xl m-0">{diary.title}</h2>
            <p className="m-0 mb-8">{diary.entry.entry}</p>
            <Link to="/" className="flex gap-1 items-center no-underline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryRoute;
