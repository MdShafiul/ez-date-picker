import type { CalendarDay, DateRange } from "./types";

export const WEEKDAYS_SUN_FIRST = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAYS_MON_FIRST = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function orderDates(a: Date, b: Date): [Date, Date] {
  return a.getTime() <= b.getTime() ? [a, b] : [b, a];
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfDay(next);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function startOfWeek(date: Date, startWeekOnMonday: boolean): Date {
  const day = date.getDay();
  const diff = startWeekOnMonday ? (day + 6) % 7 : day;
  return addDays(date, -diff);
}

export function endOfWeek(date: Date, startWeekOnMonday: boolean): Date {
  return addDays(startOfWeek(date, startWeekOnMonday), 6);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  const normalized = startOfDay(date).getTime();
  if (minDate && normalized < startOfDay(minDate).getTime()) return true;
  if (maxDate && normalized > startOfDay(maxDate).getTime()) return true;
  return false;
}

export function getCalendarDays(monthDate: Date, startWeekOnMonday: boolean): CalendarDay[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  let firstWeekday = firstOfMonth.getDay();
  if (startWeekOnMonday) {
    firstWeekday = (firstWeekday + 6) % 7;
  }

  const days: CalendarDay[] = [];

  for (let i = firstWeekday; i > 0; i -= 1) {
    days.push({ date: new Date(year, month, 1 - i), currentMonth: false });
  }

  for (let d = 1; d <= lastOfMonth.getDate(); d += 1) {
    days.push({ date: new Date(year, month, d), currentMonth: true });
  }

  const trailing = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= trailing; i += 1) {
    days.push({ date: new Date(year, month + 1, i), currentMonth: false });
  }

  return days;
}

export function formatInputDate(value: Date | null | undefined, locale: string): string {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(value);
}

export function formatRangeValue(range: DateRange | null | undefined, locale: string): string {
  if (!range?.start && !range?.end) return "";
  if (range?.start && range?.end) {
    return `${formatInputDate(range.start, locale)} - ${formatInputDate(range.end, locale)}`;
  }
  if (range?.start) {
    return `${formatInputDate(range.start, locale)} - ...`;
  }
  return "";
}

export function normalizeRange(range: DateRange | null | undefined): DateRange | null {
  if (!range) return null;
  return {
    start: range.start ? startOfDay(range.start) : null,
    end: range.end ? startOfDay(range.end) : null
  };
}

export function normalizePresetRange(
  range: DateRange | null | undefined
): { start: Date; end: Date } | null {
  if (!range?.start || !range?.end) return null;
  const [start, end] = orderDates(startOfDay(range.start), startOfDay(range.end));
  return { start, end };
}

export function isBetween(date: Date, start: Date, end: Date): boolean {
  const value = startOfDay(date).getTime();
  const startTime = startOfDay(start).getTime();
  const endTime = startOfDay(end).getTime();
  return value > startTime && value < endTime;
}
