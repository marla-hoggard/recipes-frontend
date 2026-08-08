import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import classes from './FailWhale.module.css';

type Props = {
  icon: IconDefinition;
  title: string;
  message: string;
  linkTo?: string;
  linkLabel?: string;
};

const FailWhale: React.FC<Props> = ({ icon, title, message, linkTo, linkLabel }) => {
  return (
    <div className={classes.container}>
      <div className={classes.iconContainer}>
        <FontAwesomeIcon className={classes.icon} icon={icon} />
      </div>
      <h1 className={classes.title}>{title}</h1>
      <div className={classes.message}>{message}</div>
      {linkTo && (
        <Link className={classes.link} to={linkTo}>
          {linkLabel}
        </Link>
      )}
    </div>
  );
};

export default FailWhale;
