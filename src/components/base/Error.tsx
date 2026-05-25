import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear } from '@fortawesome/free-solid-svg-icons';
import classes from './Error.module.css';

type Props = {
  errorText?: string;
};

const defaultText = 'Something went wrong. Please refresh to try again.';

const Error: React.FC<Props> = ({ errorText = defaultText }) => {
  return (
    <>
      <div className={classes.iconContainer}>
        <FontAwesomeIcon className={classes.icon} icon={faSadTear} />
      </div>
      <div className={classes.errorText}>{errorText}</div>
    </>
  );
};

export default Error;
