export function formatDate(dateStr) {
  if (!dateStr) return "";
  const [hourStr, minuteStr] = dateStr.split(":");
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minuteStr} ${period}`;
}
