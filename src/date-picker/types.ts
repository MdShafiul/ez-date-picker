import type React from "react";

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type PresetContext = {
  today: Date;
  startWeekOnMonday: boolean;
};

export type SingleDatePreset = {
  id: string;
  label: string;
  date?: Date;
  getDate?: (context: PresetContext) => Date;
};

export type RangeDatePreset = {
  id: string;
  label: string;
  range?: DateRange;
  getRange?: (context: PresetContext) => DateRange;
};

export type DatePickerTheme = {
  background: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
  primary: string;
  primaryStrong: string;
  primarySoft: string;
  shadow: string;
  fontFamily: string;
  inputRadius: string;
  panelRadius: string;
  dayRadius: string;
};

export type DatePickerProps = {
  mode?: "single" | "range";
  showRangeMeta?: boolean;
  rangeMonthsToShow?: 1 | 2;
  theme?: Partial<DatePickerTheme>;
  showPresetPanel?: boolean;
  presetPanelTitle?: string;
  singlePresetLabel?: string;
  rangePresetLabel?: string;
  singlePresets?: SingleDatePreset[];
  rangePresets?: RangeDatePreset[];
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  rangeValue?: DateRange | null;
  onRangeChange?: (range: DateRange | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  locale?: string;
  startWeekOnMonday?: boolean;
};

export type CalendarDay = {
  date: Date;
  currentMonth: boolean;
};

export type CalendarMonth = {
  monthDate: Date;
  monthLabel: string;
  days: CalendarDay[];
};

export type ResolvedSingleDatePreset = {
  id: string;
  label: string;
  date: Date;
};

export type ResolvedRangeDatePreset = {
  id: string;
  label: string;
  range: {
    start: Date;
    end: Date;
  };
};
