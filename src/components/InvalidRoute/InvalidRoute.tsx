import React from 'react';
import { faMapSigns } from '@fortawesome/free-solid-svg-icons';
import FailWhale from '../base/FailWhale';

const InvalidRoute: React.FC = () => {
  return (
    <FailWhale
      icon={faMapSigns}
      title="Page Not Found"
      message="We couldn't find the page you were looking for."
      linkTo="/"
      linkLabel="Home"
    />
  );
};

export default InvalidRoute;
