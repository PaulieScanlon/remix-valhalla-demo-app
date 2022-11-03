import { Link, useLoaderData } from '@remix-run/react';

export const loader = async () => {
  const { client } = require('../../utils/valhalla-client');

  const query = `
  {
    allContentfulAnimal {
      nodes {
        id
        name
      }
    }
    allShopifyProduct {
      nodes {
        id
        title
      }
    }
  }
  `;

  const { data } = await client.query(query).toPromise();
  return data;
};

const IndexRoute = () => {
  const {
    allContentfulAnimal: { nodes: animals },
    allShopifyProduct: { nodes: products }
  } = useLoaderData();

  return (
    <div>
      <h1>Welcome to Remix + Gatsby Valhalla</h1>
      <div className="grid grid-cols-2">
        <div>
          <h2>Contentful</h2>
          <ul>
            {animals.map((animal, index) => {
              const { name, id } = animal;

              return (
                <li key={index}>
                  <Link to={`/animals/${id}`} prefetch="intent">
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h2>Shopify</h2>
          <ul>
            {products.map((product, index) => {
              const { title, id } = product;

              return (
                <li key={index}>
                  <Link to={`/products/${id}`} prefetch="intent">
                    {title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* <pre>{JSON.stringify(nodes, null, 2)}</pre> */}
    </div>
  );
};

export default IndexRoute;
