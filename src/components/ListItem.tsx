import React from 'react';
import { Timestamp } from '../types/timestamp';
import classNames from 'classnames';

type ListItemProps = {
  data: Timestamp;
  handleClick: (item: Timestamp) => void;
  isSelected: boolean;
};

export const ListItem = (props: ListItemProps) => {
  const { data, handleClick, isSelected } = props;

  const itemClasses = classNames({
    itemContainer: true,
    selected: isSelected,
  });

  const formatTime = (rawValue: number) => {
    const parts = rawValue.toString().split('.');
    const secmin = parts[0];
    const msAll = parts[1];

    const minutes = Math.floor(+secmin / 60);
    const seconds = +secmin % 60;
    const milliSeconds = msAll.substring(0, 3);

    return [
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
      milliSeconds.toString().padStart(3, '0'),
    ].join(':');
  };

  return (
    <>
      <li className={itemClasses} onClick={() => handleClick(data)}>
        <div className="paramValue">{formatTime(data.timestamp)}</div>
      </li>
    </>
  );
};
