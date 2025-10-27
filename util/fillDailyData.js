function fillDailyData(dataAmounts, dataDates, sinceDate, fillWith = "last") {
  if (
    !Array.isArray(dataAmounts) ||
    !Array.isArray(dataDates) ||
    dataAmounts.length !== dataDates.length ||
    dataAmounts.length === 0
  ) {
    return { dataAmounts: [], dates: [] };
  }

  // Combine and sort to ensure chronological order
  const combined = dataDates.map((d, i) => ({ date: d, amount: dataAmounts[i] }));
  combined.sort((a, b) => a.date - b.date);

  const since = new Date(sinceDate);
  since.setHours(0, 0, 0, 0);

  const lastDate = new Date(combined[combined.length - 1].date);
  lastDate.setHours(0, 0, 0, 0);

  // Map of last entry per day
  const dayMap = new Map();
  for (const { date, amount } of combined) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    dayMap.set(d.getTime(), amount); // overwrite so last one per day stays
  }

  const outputAmounts = [];
  const outputDates = [];

  let current = new Date(since);
  let lastKnown = null;

  while (current <= lastDate) {
    const key = current.getTime();

    if (dayMap.has(key)) {
      lastKnown = dayMap.get(key);
      outputAmounts.push(lastKnown);
    } else {
      if (fillWith === "last" && lastKnown !== null) {
        outputAmounts.push(lastKnown);
      } else {
        outputAmounts.push(0);
      }
    }

    outputDates.push(key);
    current.setDate(current.getDate() + 1);
  }

  return { dataAmounts: outputAmounts, dataDates: outputDates };
}

export default fillDailyData;