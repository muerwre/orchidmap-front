export const toHours = (info) => {
  const hrs = parseInt(Number(info));
  const min = Math.round((Number(info)-hrs) * 60);
  return hrs+':'+min;
}
