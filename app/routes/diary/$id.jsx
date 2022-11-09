import { Link, useLoaderData } from '@remix-run/react';

export const loader = async ({ params }) => {
  const { client } = require('../../../utils/valhalla-client');

  const { id } = params;

  const query = `
    query DiaryEntry($id: String) {
      contentfulDiary(id:{ eq: $id} ) {
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
    data: { contentfulDiary }
  } = await client.query(query, { id: id }).toPromise();

  if (!contentfulDiary) {
    throw new Response('Not Found', {
      status: 404
    });
  }

  return contentfulDiary;
};

const DiaryRoute = () => {
  const diary = useLoaderData();

  return (
    <div className="py-4">
      <div className="grid gap-8">
        <Link to="/" className="flex gap-1 items-center no-underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back
        </Link>
        <div>
          <h1 className="font-black text-3xl m-0">{diary.title}</h1>
          <p className="m-0">{diary.entry.entry}</p>
        </div>
        <img className="object-cover w-full h-full m-0" src={diary.photo.url} alt={diary.title} />
      </div>

      {/* <pre>{JSON.stringify(entry, null, 2)}</pre> */}
    </div>
  );
};

export default DiaryRoute;
