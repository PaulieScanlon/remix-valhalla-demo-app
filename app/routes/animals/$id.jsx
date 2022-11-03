import { Link, useLoaderData } from '@remix-run/react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

export const loader = async ({ params }) => {
  const { client } = require('../../../utils/valhalla-client');
  const { id } = params;

  const query = `
  query AnimalQuery($id:String) {
    contentfulAnimal(id: {eq: $id}) {
      name
      animalType
      about {
        about
      }
      image {
        gatsbyImage(placeholder:NONE layout:CONSTRAINED height: 300, width: 300)
      }
    }
  }
  `;

  const {
    data: { contentfulAnimal }
  } = await client.query(query, { id: id }).toPromise();

  if (!contentfulAnimal) {
    throw new Response('Not Found', {
      status: 404
    });
  }

  return contentfulAnimal;
};

const AnimalsRoute = () => {
  const animal = useLoaderData();

  return (
    <div>
      <Link to="/" className="block">
        Back
      </Link>
      <div className="flex gap-4">
        <GatsbyImage image={getImage(animal.image)} alt={animal.name} />
        <div className="self-center">
          <small className="capitalize">{animal.animalType}</small>
          <h1 className="m-0">{animal.name}</h1>
          <p className="m-0">{animal.about.about}</p>
        </div>
      </div>
      <pre>{JSON.stringify(animal, null, 2)}</pre>
    </div>
  );
};

export default AnimalsRoute;
