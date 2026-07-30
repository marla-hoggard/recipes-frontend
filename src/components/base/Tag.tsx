import React, { useCallback } from 'react';
import classNames from 'classnames';
import classes from './Tag.module.css';
import { useNavigate } from 'react-router-dom';

type Props = {
  text: string;
};

const colors = ['red', 'orange', 'green', 'blue', 'purple', 'gray', 'black'];

const Tag: React.FC<Props> = ({ text }) => {
  const navigate = useNavigate();
  const color = colors[Math.floor(Math.random() * colors.length)];

  const searchByTag = useCallback(() => {
    const url = text === 'vegetarian' ? '/search?vegetarian=true' : `/search?tags=${text}`;
    navigate(url);
  }, [navigate, text]);

  return (
    <div className={classNames(classes.tag, classes[color])} onClick={searchByTag}>
      {text}
    </div>
  );
};

export default Tag;
