import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameWeek, parseISO } from "date-fns";

export const getWeekStart = (date = new Date()) => {
  return startOfWeek(date, { weekStartsOn: 0 }); // Sunday
};

export const getWeekDays = (weekStart) => {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
};

export const formatDate = (date, pattern = "MMM d") => {
  return format(date, pattern);
};

export const formatWeekRange = (weekStart) => {
  const weekEnd = addDays(weekStart, 6);
  return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
};

export const getPreviousWeek = (weekStart) => {
  return subWeeks(weekStart, 1);
};

export const getNextWeek = (weekStart) => {
  return addWeeks(weekStart, 1);
};

export const isSameWeekAs = (date1, date2) => {
  return isSameWeek(date1, date2, { weekStartsOn: 0 });
};

export const dateToString = (date) => {
  return format(date, "yyyy-MM-dd");
};

export const stringToDate = (dateString) => {
  return parseISO(dateString);
};