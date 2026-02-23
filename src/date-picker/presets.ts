import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek
} from "./date-utils";
import type { RangeDatePreset, SingleDatePreset } from "./types";

export const DEFAULT_SINGLE_PRESETS: SingleDatePreset[] = [
  {
    id: "yesterday",
    label: "Yesterday",
    getDate: ({ today }) => addDays(today, -1)
  },
  {
    id: "today",
    label: "Today",
    getDate: ({ today }) => today
  },
  {
    id: "tomorrow",
    label: "Tomorrow",
    getDate: ({ today }) => addDays(today, 1)
  }
];

export const DEFAULT_RANGE_PRESETS: RangeDatePreset[] = [
  {
    id: "last-week",
    label: "Last Week",
    getRange: ({ today, startWeekOnMonday }) => {
      const currentWeekStart = startOfWeek(today, startWeekOnMonday);
      const start = addDays(currentWeekStart, -7);
      const end = addDays(currentWeekStart, -1);
      return { start, end };
    }
  },
  {
    id: "last-month",
    label: "Last Month",
    getRange: ({ today }) => {
      const month = addMonths(today, -1);
      return { start: startOfMonth(month), end: endOfMonth(month) };
    }
  },
  {
    id: "next-week",
    label: "Next Week",
    getRange: ({ today, startWeekOnMonday }) => {
      const currentWeekEnd = endOfWeek(today, startWeekOnMonday);
      const start = addDays(currentWeekEnd, 1);
      const end = addDays(start, 6);
      return { start, end };
    }
  },
  {
    id: "next-month",
    label: "Next Month",
    getRange: ({ today }) => {
      const month = addMonths(today, 1);
      return { start: startOfMonth(month), end: endOfMonth(month) };
    }
  }
];
