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

const convert = {
  formatTime,
};

export default convert;
