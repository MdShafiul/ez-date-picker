import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

type CalendarDay = {
  date: Date;
  currentMonth: boolean;
};

export type DatePickerProps = {
  mode?: "single" | "range";
  showRangeMeta?: boolean;
  rangeMonthsToShow?: 1 | 2;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  rangeValue?: DateRange | null;
  onRangeChange?: (range: DateRange | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  locale?: string;
  startWeekOnMonday?: boolean;
};

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

const WEEKDAYS_SUN_FIRST = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_MON_FIRST = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  const normalized = startOfDay(date).getTime();
  if (minDate && normalized < startOfDay(minDate).getTime()) return true;
  if (maxDate && normalized > startOfDay(maxDate).getTime()) return true;
  return false;
}

function getCalendarDays(monthDate: Date, startWeekOnMonday: boolean): CalendarDay[] {
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
    const date = new Date(year, month, 1 - i);
    days.push({ date, currentMonth: false });
  }

  for (let d = 1; d <= lastOfMonth.getDate(); d += 1) {
    days.push({ date: new Date(year, month, d), currentMonth: true });
  }

  const trailing = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= trailing; i += 1) {
    const date = new Date(year, month + 1, i);
    days.push({ date, currentMonth: false });
  }

  return days;
}

function formatInputDate(value: Date | null | undefined, locale: string): string {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(value);
}

function formatRangeValue(range: DateRange | null | undefined, locale: string): string {
  if (!range?.start && !range?.end) return "";
  if (range?.start && range?.end) {
    return `${formatInputDate(range.start, locale)} - ${formatInputDate(range.end, locale)}`;
  }
  if (range?.start) {
    return `${formatInputDate(range.start, locale)} - ...`;
  }
  return "";
}

function normalizeRange(range: DateRange | null | undefined): DateRange | null {
  if (!range) return null;
  return {
    start: range.start ? startOfDay(range.start) : null,
    end: range.end ? startOfDay(range.end) : null
  };
}

function isBetween(date: Date, start: Date, end: Date): boolean {
  const value = startOfDay(date).getTime();
  const startTime = startOfDay(start).getTime();
  const endTime = startOfDay(end).getTime();
  return value > startTime && value < endTime;
}

function orderDates(a: Date, b: Date): [Date, Date] {
  return a.getTime() <= b.getTime() ? [a, b] : [b, a];
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function DatePicker({
  mode = "single",
  showRangeMeta = true,
  rangeMonthsToShow = 1,
  value = null,
  onChange,
  rangeValue = null,
  onRangeChange,
  placeholder = "Select a date",
  minDate,
  maxDate,
  disabled = false,
  className,
  locale = "en-US",
  startWeekOnMonday = false
}: DatePickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const normalizedSingleValue = useMemo(() => (value ? startOfDay(value) : null), [value]);
  const normalizedRangeValue = useMemo(() => normalizeRange(rangeValue), [rangeValue]);
  const singleValueTime = normalizedSingleValue?.getTime() ?? null;
  const rangeStartTime = normalizedRangeValue?.start?.getTime() ?? null;
  const rangeEndTime = normalizedRangeValue?.end?.getTime() ?? null;
  const hoveredDateTime = hoveredDate?.getTime() ?? null;

  const [viewMonth, setViewMonth] = useState<Date>(() => {
    if (mode === "range") {
      return normalizedRangeValue?.start ?? normalizedRangeValue?.end ?? new Date();
    }
    return normalizedSingleValue ?? new Date();
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => startOfDay(new Date()), []);
  const monthsToShow = mode === "range" ? rangeMonthsToShow : 1;
  const displayValue =
    mode === "range"
      ? formatRangeValue(normalizedRangeValue, locale)
      : formatInputDate(normalizedSingleValue, locale);
  const calendarMonths = useMemo(
    () =>
      Array.from({ length: monthsToShow }, (_, index) => {
        const monthDate = addMonths(viewMonth, index);
        return {
          monthDate,
          monthLabel: new Intl.DateTimeFormat(locale, {
            month: "long",
            year: "numeric"
          }).format(monthDate),
          days: getCalendarDays(monthDate, startWeekOnMonday)
        };
      }),
    [monthsToShow, viewMonth, locale, startWeekOnMonday]
  );

  useEffect(() => {
    let target: Date | null = null;

    if (mode === "range") {
      target = normalizedRangeValue?.start ?? normalizedRangeValue?.end ?? null;
    } else {
      target = normalizedSingleValue;
    }

    if (!target) return;

    const nextMonth = new Date(target.getFullYear(), target.getMonth(), 1);
    setViewMonth((prev) => {
      const sameMonth =
        prev.getFullYear() === nextMonth.getFullYear() &&
        prev.getMonth() === nextMonth.getMonth();
      return sameMonth ? prev : nextMonth;
    });
  }, [mode, singleValueTime, rangeStartTime, rangeEndTime]);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent): void => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", onDocumentClick);
    }
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setHoveredDate(null);
    }
  }, [isOpen]);

  const monthLabel =
    monthsToShow === 2
      ? `${calendarMonths[0]?.monthLabel ?? ""} - ${calendarMonths[1]?.monthLabel ?? ""}`
      : calendarMonths[0]?.monthLabel ?? "";

  const weekdayLabels = startWeekOnMonday ? WEEKDAYS_MON_FIRST : WEEKDAYS_SUN_FIRST;
  const rangeHasSelection = !!normalizedRangeValue?.start || !!normalizedRangeValue?.end;
  const isPickingRangeEnd =
    mode === "range" && !!normalizedRangeValue?.start && !normalizedRangeValue?.end;
  const [effectiveRangeStart, effectiveRangeEnd] = useMemo(() => {
    if (mode !== "range") return [null, null] as const;
    if (normalizedRangeValue?.start && normalizedRangeValue?.end) {
      return orderDates(normalizedRangeValue.start, normalizedRangeValue.end);
    }
    if (normalizedRangeValue?.start && hoveredDate) {
      return orderDates(normalizedRangeValue.start, hoveredDate);
    }
    return [normalizedRangeValue?.start ?? null, null] as const;
  }, [mode, rangeStartTime, rangeEndTime, hoveredDateTime]);

  const rangeHelperText =
    mode !== "range"
      ? ""
      : isPickingRangeEnd
        ? "Select an end date"
        : rangeHasSelection
          ? "Range selected"
          : "Select start date";

  const handleSelectDate = (date: Date): void => {
    if (isDateDisabled(date, minDate, maxDate)) return;

    const picked = startOfDay(date);

    if (mode === "single") {
      onChange?.(picked);
      setIsOpen(false);
      return;
    }

    const currentStart = normalizedRangeValue?.start ?? null;
    const currentEnd = normalizedRangeValue?.end ?? null;

    if (!currentStart || (currentStart && currentEnd)) {
      setHoveredDate(null);
      onRangeChange?.({ start: picked, end: null });
      return;
    }

    if (picked.getTime() < currentStart.getTime()) {
      setHoveredDate(null);
      onRangeChange?.({ start: picked, end: currentStart });
      setIsOpen(false);
      return;
    }

    setHoveredDate(null);
    onRangeChange?.({ start: currentStart, end: picked });
    setIsOpen(false);
  };

  const handlePrevMonth = (): void => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = (): void => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = (): void => {
    if (isDateDisabled(today, minDate, maxDate)) return;
    setHoveredDate(null);

    if (mode === "range") {
      onRangeChange?.({ start: today, end: today });
    } else {
      onChange?.(today);
    }

    setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setIsOpen(false);
  };

  const handleClear = (): void => {
    setHoveredDate(null);
    if (mode === "range") {
      onRangeChange?.({ start: null, end: null });
      return;
    }
    onChange?.(null);
  };

  return (
    <div className={["ezdp", className].filter(Boolean).join(" ")} ref={wrapperRef}>
      <button
        type="button"
        className="ezdp-input"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={displayValue ? "ezdp-value" : "ezdp-placeholder"}>
          {displayValue || placeholder}
        </span>
        <span className="ezdp-icon" aria-hidden>
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm13 8H4v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div
          className={[
            "ezdp-panel",
            mode === "range" && "is-range-mode",
            mode === "range" && monthsToShow === 2 && "is-two-months"
          ]
            .filter(Boolean)
            .join(" ")}
          role="dialog"
          aria-label="Date picker calendar"
        >
          <div className="ezdp-header">
            <button type="button" className="ezdp-nav" onClick={handlePrevMonth} aria-label="Previous month">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M14.7 5.3a1 1 0 0 1 0 1.4L9.41 12l5.3 5.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.41 0Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <div className="ezdp-month">{monthLabel}</div>
            <button type="button" className="ezdp-nav" onClick={handleNextMonth} aria-label="Next month">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M9.29 5.29a1 1 0 0 1 1.42 0l6 6a1 1 0 0 1 0 1.42l-6 6a1 1 0 1 1-1.42-1.42L14.59 12 9.29 6.71a1 1 0 0 1 0-1.42Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          {mode === "range" && showRangeMeta && (
            <div className="ezdp-range-meta">
              <div className="ezdp-range-pill">
                <span>Start</span>
                <strong>
                  {normalizedRangeValue?.start
                    ? formatInputDate(normalizedRangeValue.start, locale)
                    : "--"}
                </strong>
              </div>
              <div className="ezdp-range-pill">
                <span>End</span>
                <strong>
                  {normalizedRangeValue?.end
                    ? formatInputDate(normalizedRangeValue.end, locale)
                    : "--"}
                </strong>
              </div>
              <div className="ezdp-range-hint">{rangeHelperText}</div>
            </div>
          )}

          <div className={["ezdp-calendars", monthsToShow === 2 && "is-two-months"].filter(Boolean).join(" ")} onMouseLeave={() => setHoveredDate(null)}>
            {calendarMonths.map((calendar) => (
              <div className="ezdp-calendar" key={calendar.monthLabel}>
                {monthsToShow === 2 && (
                  <div className="ezdp-submonth">{calendar.monthLabel}</div>
                )}
                <div className="ezdp-weekdays">
                  {weekdayLabels.map((weekday) => (
                    <div key={`${calendar.monthLabel}-${weekday}`} className="ezdp-weekday">
                      {weekday}
                    </div>
                  ))}
                </div>

                <div className="ezdp-grid">
                  {calendar.days.map(({ date, currentMonth }) => {
                    const disabledDay = isDateDisabled(date, minDate, maxDate);
                    const hideOutsideDay =
                      mode === "range" &&
                      monthsToShow === 2 &&
                      !currentMonth;
                    const selected = normalizedSingleValue ? isSameDay(date, normalizedSingleValue) : false;
                    const isPreviewRange =
                      mode === "range" &&
                      !!normalizedRangeValue?.start &&
                      !normalizedRangeValue?.end &&
                      !!hoveredDate;

                    const rangeStart = effectiveRangeStart ? isSameDay(date, effectiveRangeStart) : false;
                    const rangeEnd = effectiveRangeEnd ? isSameDay(date, effectiveRangeEnd) : false;
                    const inRange =
                      !!effectiveRangeStart && !!effectiveRangeEnd
                        ? isBetween(date, effectiveRangeStart, effectiveRangeEnd)
                        : false;
                    const isToday = isSameDay(date, today);
                    const classes = [
                      "ezdp-day",
                      !currentMonth && "is-outside",
                      hideOutsideDay && "is-outside-hidden",
                      mode === "single" && selected && "is-selected",
                      mode === "range" && rangeStart && "is-range-start",
                      mode === "range" && rangeEnd && "is-range-end",
                      mode === "range" && inRange && "is-in-range",
                      mode === "range" && isPreviewRange && (rangeStart || rangeEnd || inRange) && "is-preview",
                      isToday && "is-today",
                      disabledDay && "is-disabled"
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        className={classes}
                        onClick={() => handleSelectDate(date)}
                        onMouseEnter={() => {
                          if (mode !== "range") return;
                          if (!normalizedRangeValue?.start || normalizedRangeValue?.end) return;
                          if (disabledDay) return;
                          setHoveredDate(startOfDay(date));
                        }}
                        onFocus={() => {
                          if (mode !== "range") return;
                          if (!normalizedRangeValue?.start || normalizedRangeValue?.end) return;
                          if (disabledDay) return;
                          setHoveredDate(startOfDay(date));
                        }}
                        disabled={disabledDay || hideOutsideDay}
                        aria-hidden={hideOutsideDay}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="ezdp-footer">
            <button type="button" className="ezdp-action" onClick={handleToday} disabled={isDateDisabled(today, minDate, maxDate)}>
              Today
            </button>
            <button
              type="button"
              className="ezdp-action ezdp-clear"
              onClick={handleClear}
              disabled={
                mode === "range"
                  ? !normalizedRangeValue?.start && !normalizedRangeValue?.end
                  : !normalizedSingleValue
              }
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
