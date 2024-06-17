import { Timestamp } from '../types/timestamp';

const pathPrefix = 'https://run.mocky.io';

async function getTimestamps(): Promise<Timestamp[]> {
  const response = await fetch(`${pathPrefix}/v3/86ba5ad4-c45e-4f3d-9a07-83ce9a345833`, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}

const api = {
  getTimestamps,
};

export default api;
