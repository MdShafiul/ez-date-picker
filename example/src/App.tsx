import React, { useState } from "react";
import {
  DatePicker,
  type DateRange,
  type DatePickerTheme,
  type SingleDatePreset,
  type RangeDatePreset
} from "ez-date-picker";
import "ez-date-picker/styles.css";
import "./app.css";

const SINGLE_PRESETS: SingleDatePreset[] = [
  { id: "yesterday", label: "Yesterday", getDate: ({ today }) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1) },
  { id: "today", label: "Today", getDate: ({ today }) => today },
  { id: "next-friday", label: "Next Friday", getDate: ({ today }) => {
    const base = new Date(today);
    const day = base.getDay();
    const diff = ((5 - day + 7) % 7) || 7;
    base.setDate(base.getDate() + diff);
    return base;
  } }
];

const RANGE_PRESETS: RangeDatePreset[] = [
  { id: "last-week", label: "Last Week" },
  { id: "last-month", label: "Last Month" },
  {
    id: "next-14-days",
    label: "Next 14 Days",
    getRange: ({ today }) => ({
      start: today,
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13)
    })
  }
];

const CUSTOM_THEME: Partial<DatePickerTheme> = {
  background: "#eff6ff",
  surface: "#dbeafe",
  primary: "#2563eb",
  primaryStrong: "#1d4ed8",
  primarySoft: "#dbeafe",
  border: "#93c5fd",
  shadow: "0 18px 40px rgba(37, 99, 235, 0.18)",
  inputRadius: "14px",
  panelRadius: "18px",
  dayRadius: "12px"
};

export function App(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: null,
    end: null
  });

  return (
    <main className="page">
      <section className="card">
        <h1>ez-date-picker</h1>
        <p>Local package integration test app</p>

        <div className="result">
          <div>
            <h3>Single Date Picker</h3>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Pick a date"
              minDate={new Date(2024, 0, 1)}
              maxDate={new Date(2030, 11, 31)}
              startWeekOnMonday
              showPresetPanel
              presetPanelTitle="Shortcuts"
              singlePresetLabel="My Presets"
              singlePresets={SINGLE_PRESETS}
              theme={CUSTOM_THEME}
            />
            <p>
              <span>Selected:</span>{" "}
              <strong>{selectedDate ? selectedDate.toDateString() : "None"}</strong>
            </p>
          </div>

          <div>
            <h3>Date Range Picker</h3>
            <DatePicker
              mode="range"
              rangeValue={selectedRange}
              onRangeChange={(range) =>
                setSelectedRange(range ?? { start: null, end: null })
              }
              placeholder="Pick a date range"
              minDate={new Date(2024, 0, 1)}
              maxDate={new Date(2030, 11, 31)}
              startWeekOnMonday
              rangeMonthsToShow={2}
              showPresetPanel
              presetPanelTitle="Quick Ranges"
              rangePresetLabel="Recent Windows"
              rangePresets={RANGE_PRESETS}
            />
            <p>
              <span>Selected:</span>{" "}
              <strong>
                {selectedRange.start ? selectedRange.start.toDateString() : "None"}{" "}
                to{" "}
                {selectedRange.end ? selectedRange.end.toDateString() : "None"}
              </strong>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
