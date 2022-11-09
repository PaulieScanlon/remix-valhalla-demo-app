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
  const entry = useLoaderData();

  return (
    <div className="relative">
      <div className="relative grid gap-4 opacity-80 p-4 z-20 capitalize">
        <Link to="/" className="relative flex gap-1 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back
        </Link>
        <h1 className="font-black text-3xl">{entry.title}</h1>
      </div>
      <div className="absolute top-0 left-0 w-full h-screen bg-cover bg-center z-1">
        <img className="object-cover w-full h-full m-0" src={entry.photo.url} alt={entry.title} />
      </div>
      {/* <pre>{JSON.stringify(entry, null, 2)}</pre> */}
    </div>
  );
};

export default DiaryRoute;
