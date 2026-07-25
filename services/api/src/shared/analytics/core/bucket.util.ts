export function getHoldingTimeBucket(minutes: number): string {
  if (minutes <= 15) return "0-15 min";
  if (minutes <= 30) return "15-30 min";
  if (minutes <= 60) return "30-60 min";
  if (minutes <= 120) return "1-2 hrs";
  if (minutes <= 240) return "2-4 hrs";

  return "4+ hrs";
}

export function getDayOfWeek(date: Date): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[date.getDay()];
}

export function getTimeOfDayBucket(date: Date): string {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes >= 555 && totalMinutes < 600)
    return "09:15-10:00";

  if (totalMinutes >= 600 && totalMinutes < 660)
    return "10:00-11:00";

  if (totalMinutes >= 660 && totalMinutes < 720)
    return "11:00-12:00";

  if (totalMinutes >= 720 && totalMinutes < 840)
    return "12:00-14:00";

  return "14:00-15:30";
}
