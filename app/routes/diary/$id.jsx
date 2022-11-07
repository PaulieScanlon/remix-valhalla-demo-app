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

const ProductssRoute = () => {
  const entry = useLoaderData();

  return (
    <div>
      <Link to="/" className="block">
        Back
      </Link>
      <pre>{JSON.stringify(entry, null, 2)}</pre>
    </div>
  );
};

export default ProductssRoute;
