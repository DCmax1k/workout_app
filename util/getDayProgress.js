export default getDayProgress = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msSinceStart = now - startOfDay;
  const msInDay = 24 * 60 * 60 * 1000;
  return (msSinceStart / msInDay) * 100;
}