import { Link, useLoaderData } from '@remix-run/react';

export const loader = async () => {
  const { client } = require('../../utils/valhalla-client');

  const query = `
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

  const { data } = await client.query(query).toPromise();
  return data;
};

const IndexRoute = () => {
  const {
    allContentfulDiary: { nodes: entries }
  } = useLoaderData();

  return (
    <div>
      <h1>NYC Diary | 2022</h1>

      <div>
        <h2>Diary Entries</h2>
        <ul className="list-none m-0 p-0">
          {entries.map((entry, index) => {
            const { id, title, weekend } = entry;

            return (
              <li
                key={index}
                className={`m-0 my-4 p-0 rounded-lg border duration-300 transition-all hover:shadow-lg hover:-translate-y-1 ${
                  weekend ? 'border-orange-400' : 'border-sky-400'
                }`}
              >
                <Link to={`/diary/${id}`} prefetch="intent" className={`block no-underline p-3 ${weekend ? 'text-orange-400' : 'text-sky-600'}`}>
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default IndexRoute;
