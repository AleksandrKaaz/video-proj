import { Timestamp } from '../types/timestamp';

export const sortListItems = (items: Timestamp[]) => {
  const sortedItems = items.sort((item1, item2) => {
    return item1.timestamp - item2.timestamp;
  });
  return sortedItems;
};
