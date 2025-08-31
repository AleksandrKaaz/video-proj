import { Timestamp } from '../types/timestamp';

const pathPrefix = 'http://localhost:3006';

async function getTimestamps(): Promise<Timestamp[]> {
  const response = await fetch(`${pathPrefix}/`, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}

const api = {
  getTimestamps,
};

export default api;
