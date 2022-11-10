import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@remix-run/react';

const CallToAction = ({ id }) => {
  return (
    <Fragment>
      {id ? (
        <Link to={`/diary/${id}`} prefetch="intent" className="text-sm bg-pink-600 no-underline px-3 py-2 text-center text-white min-w-[120px]">
          Read Entry
        </Link>
      ) : (
        <button className="disabled cursor-not-allowed text-sm bg-white/10 px-3 py-2 text-white/20 min-w-[120px]">Please Wait</button>
      )}
    </Fragment>
  );
};

// CallToAction.propTypes = {
/** The id of the entry */
// id: PropTypes.oneOfType([PropTypes.string, PropTypes.])
// };

export default CallToAction;
