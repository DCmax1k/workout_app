const sinceWhen = (dateInput) => {
  const date = new Date(dateInput);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    return "Today";
  }

  const diffTime = now - date; // difference in milliseconds
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (diffDays < 7) {
    // within a week → day of the week
    return dayNames[date.getDay()];
  } else if (now.getFullYear() === date.getFullYear()) {
    // same year but older than a week → M/D
    return `${date.getMonth() + 1}/${date.getDate()}`;
  } else {
    // over a year ago → M/D/YYYY
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
}

export default sinceWhen;