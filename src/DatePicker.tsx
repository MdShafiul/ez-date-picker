import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";
import {
  WEEKDAYS_MON_FIRST,
  WEEKDAYS_SUN_FIRST,
  addMonths,
  formatInputDate,
  formatRangeValue,
  getCalendarDays,
  isBetween,
  isDateDisabled,
  isSameDay,
  normalizePresetRange,
  normalizeRange,
  orderDates,
  startOfDay
} from "./date-picker/date-utils";
import { DEFAULT_RANGE_PRESETS, DEFAULT_SINGLE_PRESETS } from "./date-picker/presets";
import { buildThemedStyle } from "./date-picker/theme";
import type {
  CalendarMonth,
  DatePickerProps,
  DateRange,
  DatePickerTheme,
  PresetContext,
  RangeDatePreset,
  ResolvedRangeDatePreset,
  ResolvedSingleDatePreset,
  SingleDatePreset
} from "./date-picker/types";

export type {
  DatePickerProps,
  DateRange,
  DatePickerTheme,
  PresetContext,
  RangeDatePreset,
  SingleDatePreset
} from "./date-picker/types";

function resolveSinglePresets(
  presets: SingleDatePreset[],
  context: PresetContext
): ResolvedSingleDatePreset[] {
  return presets
    .map((preset) => {
      const rawDate = preset.getDate ? preset.getDate(context) : preset.date;
      if (!rawDate) return null;
      return {
        id: preset.id,
        label: preset.label,
        date: startOfDay(rawDate)
      };
    })
    .filter((preset): preset is ResolvedSingleDatePreset => !!preset);
}

function resolveRangePresets(
  presets: RangeDatePreset[],
  context: PresetContext
): ResolvedRangeDatePreset[] {
  return presets
    .map((preset) => {
      const rawRange = preset.getRange ? preset.getRange(context) : preset.range;
      const normalized = normalizePresetRange(rawRange);
      if (!normalized) return null;
      return {
        id: preset.id,
        label: preset.label,
        range: normalized
      };
    })
    .filter((preset): preset is ResolvedRangeDatePreset => !!preset);
}

export function DatePicker({
  mode = "single",
  showRangeMeta = true,
  rangeMonthsToShow = 1,
  theme,
  showPresetPanel = false,
  presetPanelTitle = "Quick Select",
  singlePresetLabel = "Single Date",
  rangePresetLabel = "Date Range",
  singlePresets,
  rangePresets,
  value = null,
  onChange,
  rangeValue = null,
  onRangeChange,
  placeholder = "Select a date",
  minDate,
  maxDate,
  disabled = false,
  className,
  style,
  locale = "en-US",
  startWeekOnMonday = false
}: DatePickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const today = useMemo(() => startOfDay(new Date()), []);
  const themedStyle = useMemo(() => buildThemedStyle(theme, style), [theme, style]);
  const monthsToShow = mode === "range" ? rangeMonthsToShow : 1;

  const presetContext = useMemo(
    () => ({ today, startWeekOnMonday }),
    [today, startWeekOnMonday]
  );

  const weekdayLabels = startWeekOnMonday ? WEEKDAYS_MON_FIRST : WEEKDAYS_SUN_FIRST;

  const displayValue =
    mode === "range"
      ? formatRangeValue(normalizedRangeValue, locale)
      : formatInputDate(normalizedSingleValue, locale);

  const calendarMonths = useMemo<CalendarMonth[]>(
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

  const monthLabel =
    monthsToShow === 2
      ? `${calendarMonths[0]?.monthLabel ?? ""} - ${calendarMonths[1]?.monthLabel ?? ""}`
      : calendarMonths[0]?.monthLabel ?? "";

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

  const rangeHasSelection = !!normalizedRangeValue?.start || !!normalizedRangeValue?.end;
  const isPickingRangeEnd =
    mode === "range" && !!normalizedRangeValue?.start && !normalizedRangeValue?.end;
  const rangeHelperText =
    mode !== "range"
      ? ""
      : isPickingRangeEnd
        ? "Select an end date"
        : rangeHasSelection
          ? "Range selected"
          : "Select start date";

  const resolvedSinglePresets = useMemo(
    () => resolveSinglePresets(singlePresets ?? DEFAULT_SINGLE_PRESETS, presetContext),
    [singlePresets, presetContext]
  );

  const resolvedRangePresets = useMemo(
    () => resolveRangePresets(rangePresets ?? DEFAULT_RANGE_PRESETS, presetContext),
    [rangePresets, presetContext]
  );

  const isSinglePresetActive = (date: Date): boolean =>
    !!normalizedSingleValue && isSameDay(normalizedSingleValue, date);

  const isRangePresetActive = (presetRange: { start: Date; end: Date }): boolean =>
    !!effectiveRangeStart &&
    !!effectiveRangeEnd &&
    isSameDay(effectiveRangeStart, presetRange.start) &&
    isSameDay(effectiveRangeEnd, presetRange.end);

  useEffect(() => {
    const target =
      mode === "range"
        ? normalizedRangeValue?.start ?? normalizedRangeValue?.end ?? null
        : normalizedSingleValue;

    if (!target) return;

    const nextMonth = new Date(target.getFullYear(), target.getMonth(), 1);
    setViewMonth((prev) => {
      const isSameMonth =
        prev.getFullYear() === nextMonth.getFullYear() &&
        prev.getMonth() === nextMonth.getMonth();
      return isSameMonth ? prev : nextMonth;
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

  const handleSinglePreset = (date: Date): void => {
    if (isDateDisabled(date, minDate, maxDate)) return;
    const normalizedDate = startOfDay(date);
    onChange?.(normalizedDate);
    setViewMonth(new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), 1));
    setIsOpen(false);
  };

  const handleRangePreset = (range: { start: Date; end: Date }): void => {
    if (
      isDateDisabled(range.start, minDate, maxDate) ||
      isDateDisabled(range.end, minDate, maxDate)
    ) {
      return;
    }

    setHoveredDate(null);
    onRangeChange?.({ start: range.start, end: range.end });
    setViewMonth(new Date(range.start.getFullYear(), range.start.getMonth(), 1));
    setIsOpen(false);
  };

  const handlePrevMonth = (): void => {
    setViewMonth((prev) => addMonths(prev, -1));
  };

  const handleNextMonth = (): void => {
    setViewMonth((prev) => addMonths(prev, 1));
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
    <div className={["ezdp", className].filter(Boolean).join(" ")} ref={wrapperRef} style={themedStyle}>
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
            mode === "range" && monthsToShow === 2 && "is-two-months",
            showPresetPanel && "is-with-presets"
          ]
            .filter(Boolean)
            .join(" ")}
          role="dialog"
          aria-label="Date picker calendar"
        >
          <div className="ezdp-header">
            <button
              type="button"
              className="ezdp-nav"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
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

          <div className={["ezdp-content", showPresetPanel && "has-presets"].filter(Boolean).join(" ")}>
            {showPresetPanel && (
              <aside className="ezdp-presets" aria-label="Quick preset dates">
                <div className="ezdp-presets-title">{presetPanelTitle}</div>
                <div className="ezdp-presets-subtitle">
                  {mode === "range" ? rangePresetLabel : singlePresetLabel}
                </div>
                <div className="ezdp-presets-list">
                  {mode === "single" &&
                    resolvedSinglePresets.map((preset) => {
                      const disabledPreset = isDateDisabled(preset.date, minDate, maxDate);
                      const isActive = isSinglePresetActive(preset.date);
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          className={["ezdp-preset", isActive && "is-active"].filter(Boolean).join(" ")}
                          onClick={() => handleSinglePreset(preset.date)}
                          disabled={disabledPreset}
                        >
                          {preset.label}
                        </button>
                      );
                    })}

                  {mode === "range" &&
                    resolvedRangePresets.map((preset) => {
                      const disabledPreset =
                        isDateDisabled(preset.range.start, minDate, maxDate) ||
                        isDateDisabled(preset.range.end, minDate, maxDate);
                      const isActive = isRangePresetActive(preset.range);
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          className={["ezdp-preset", isActive && "is-active"].filter(Boolean).join(" ")}
                          onClick={() => handleRangePreset(preset.range)}
                          disabled={disabledPreset}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                </div>
              </aside>
            )}

            <div
              className={["ezdp-calendars", monthsToShow === 2 && "is-two-months"].filter(Boolean).join(" ")}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {calendarMonths.map((calendar) => (
                <div className="ezdp-calendar" key={calendar.monthDate.toISOString()}>
                  {monthsToShow === 2 && <div className="ezdp-submonth">{calendar.monthLabel}</div>}
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
                      const hideOutsideDay = mode === "range" && monthsToShow === 2 && !currentMonth;
                      const isPreviewRange =
                        mode === "range" &&
                        !!normalizedRangeValue?.start &&
                        !normalizedRangeValue?.end &&
                        !!hoveredDate;

                      const isSelectedSingle =
                        mode === "single" &&
                        !!normalizedSingleValue &&
                        isSameDay(date, normalizedSingleValue);
                      const isRangeStart =
                        mode === "range" && !!effectiveRangeStart && isSameDay(date, effectiveRangeStart);
                      const isRangeEnd =
                        mode === "range" && !!effectiveRangeEnd && isSameDay(date, effectiveRangeEnd);
                      const isInRange =
                        mode === "range" &&
                        !!effectiveRangeStart &&
                        !!effectiveRangeEnd &&
                        isBetween(date, effectiveRangeStart, effectiveRangeEnd);
                      const isToday = isSameDay(date, today);

                      const classes = [
                        "ezdp-day",
                        !currentMonth && "is-outside",
                        hideOutsideDay && "is-outside-hidden",
                        isSelectedSingle && "is-selected",
                        isRangeStart && "is-range-start",
                        isRangeEnd && "is-range-end",
                        isInRange && "is-in-range",
                        isPreviewRange && (isRangeStart || isRangeEnd || isInRange) && "is-preview",
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
          </div>

          <div className="ezdp-footer">
            <button
              type="button"
              className="ezdp-action"
              onClick={handleToday}
              disabled={isDateDisabled(today, minDate, maxDate)}
            >
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
