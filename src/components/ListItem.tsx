import React, { useEffect, useRef } from 'react';
import { Timestamp } from '../types/timestamp';
import classNames from 'classnames';
import convert from '../utils/convert';

type ListItemProps = {
  data: Timestamp;
  handleClick: (item: Timestamp) => void;
  isSelected: boolean;
};

export const ListItem = (props: ListItemProps) => {
  const { data, handleClick, isSelected } = props;

  const itemRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [isSelected]);

  const itemClasses = classNames({
    itemContainer: true,
    selected: isSelected,
  });

  return (
    <>
      <li ref={itemRef} className={itemClasses} onClick={() => handleClick(data)}>
        <div className="paramValue">{convert.formatTime(data.timestamp)}</div>
      </li>
    </>
  );
};
