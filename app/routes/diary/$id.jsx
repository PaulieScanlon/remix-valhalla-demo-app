import { Link, useLoaderData } from '@remix-run/react';
import Image from 'remix-image';

import NycDiaryLogo from '../../components/nyc-diary-logo';

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
    entries,
    currentId: id
  };
};

const DiaryRoute = () => {
  const { diary, entries, currentId } = useLoaderData();

  return (
    <div className="ml-16 lg:ml-none">
      <div className="fixed inset-0 z-10 w-[80px] overflow-y-auto scrollbar-hide">
        <ul className="list-none m-0 p-0 shadow-lg">
          {entries.map((entry, index) => {
            const { id, title, weekend } = entry;

            const isCurrent = id === currentId;
            const text = title.split(',');

            return (
              <li key={index} className="m-0 p-0 ">
                <Link
                  to={`/diary/${id}`}
                  className={`flex flex-col ${
                    weekend ? 'bg-zinc-800/80' : 'bg-zinc-800'
                  } justify-center no-underline w-[80px] h-[80px] transition-color duration-300 hover:bg-zinc-800/50`}
                >
                  <span className={`bg-transparent text-[8px] text-center ${isCurrent ? 'text-primary' : 'text-white'} `}>{text[1]}</span>
                  <span className={`bg-transparent font-bold text-[11px] text-center  ${isCurrent ? 'text-primary' : 'text-white'}`}>{text[0]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mx-auto max-w-4xl flex items-center min-h-screen">
        <div className="grid md:grid-cols-2 gap-16 items-center p-8 overflow-hidden">
          <div className="-rotate-6">
            <div className="flex flex-col justify-center bg-white p-4">
              <Image
                loaderUrl="/api/image"
                src={diary.photo.url}
                placeholder="blur"
                alt={diary.photo.title}
                placeholderAspectRatio="1:1"
                className="min-w-[280px] min-h-[280px] sm:min-w-[400px] min-h-[400px] m-0"
                responsive={[
                  {
                    size: { width: 300, height: 300 }
                  },
                  {
                    size: { width: 600, height: 600 }
                  }
                ]}
                dprVariants={[1, 3]}
                style={{ minWidth: 100 }}
              />
              <p className="font-nanum text-3xl bg-transparent text-gray-600 text-center m-0 mt-4">{diary.photo.title}</p>
            </div>
          </div>

          <div>
            <Link to="/" className="flex gap-1 items-center no-underline text-secondary mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" className="stroke-secondary" />
              </svg>
              Back
            </Link>
            <NycDiaryLogo />
            <h2 className="font-black text-3xl m-0 mb-2">{diary.title}</h2>
            <p className="m-0 mb-8">{diary.entry.entry}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryRoute;
