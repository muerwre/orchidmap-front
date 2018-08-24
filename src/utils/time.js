export const toHours = (info) => {
  const hrs = parseInt(Number(info), 10);
  const min = Math.round((Number(info) - hrs) * 60);
  const lmin = min < 10 ? '0' + min : min;
  return `${hrs}:${lmin}`;
};
