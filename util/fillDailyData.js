import getDateKey from "./getDateKey";

function fillDailyData(data, dates, sinceDate, fillWith = "last") {
  if (!data.length || !dates.length) return { dataAmounts: [], dataDates: [] };

  // Sort pairs just in case (though you said they’re in order)
  const paired = data
    .map((value, i) => ({ value, date: new Date(dates[i]) }))
    .sort((a, b) => a.date - b.date);

  // Group by day (using yyyy-mm-dd)
  const dailyMap = new Map();
  for (const { value, date } of paired) {
    const dayKey = getDateKey(date);
    dailyMap.set(dayKey, value);
  }

  const resultAmounts = [];
  const resultDates = [];

  const start = new Date(sinceDate);
  const now = new Date();

  let currentDate = new Date(start);
  let lastKnownValue = null;

  // Find last known value before sinceDate (if fillWith = "last")
  if (fillWith === "last") {
    for (const { value, date } of paired) {
      if (date < start) lastKnownValue = value;
      else break;
    }
  }

  // Loop day by day until today
  while (currentDate <= now) {
    const dayKey = getDateKey(currentDate);
    const timestamp = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    ).getTime();

    if (dailyMap.has(dayKey)) {
      lastKnownValue = dailyMap.get(dayKey);
      resultAmounts.push(lastKnownValue);
    } else {
      if (fillWith === "last") {
        resultAmounts.push(lastKnownValue ?? 0);
      } else {
        resultAmounts.push(0);
      }
    }

    resultDates.push(timestamp);

    // Next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { dataAmounts: resultAmounts, dataDates: resultDates };
}

export default fillDailyData;