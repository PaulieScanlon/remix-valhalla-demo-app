import { Link, useLoaderData } from '@remix-run/react';

export const loader = async ({ params }) => {
  const { client } = require('../../../utils/valhalla-client');

  const { id } = params;

  const query = `
  query ProductQuery($id:String) {
    shopifyProduct(id: {eq: $id}) {
      title
      priceRangeV2 {
        maxVariantPrice {
          amount
        }
      }
      description
    }
  }
  `;

  const {
    data: { shopifyProduct }
  } = await client.query(query, { id: id }).toPromise();

  if (!shopifyProduct) {
    throw new Response('Not Found', {
      status: 404
    });
  }

  return shopifyProduct;
};

const ProductssRoute = () => {
  const product = useLoaderData();

  return (
    <div>
      <Link to="/" className="block">
        Back
      </Link>
      <div className="flex gap-4">
        <img className="m-0 rounded-lg" src="" alt={product.title} />
        <div className="self-center">
          <small className="capitalize">{product.priceRangeV2.maxVariantPrice.amount}</small>
          <h1 className="m-0">{product.title}</h1>
          <p className="m-0">{product.description}</p>
        </div>
      </div>
      <pre>{JSON.stringify(product, null, 2)}</pre>
    </div>
  );
};

export default ProductssRoute;
