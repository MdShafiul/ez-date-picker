"use client";

import { useState } from "react";
import { DatePicker, type DateRange, type DatePickerTheme } from "ez-date-picker";
import { CodeSnippet } from "./code-snippet";

const SINGLE_SNIPPET = `import { DatePicker } from "ez-date-picker";
import "ez-date-picker/styles.css";

<DatePicker
  value={date}
  onChange={setDate}
  minDate={new Date(2024, 0, 1)}
  maxDate={new Date(2030, 11, 31)}
  startWeekOnMonday
/>;
`;

const RANGE_SNIPPET = `<DatePicker
  mode="range"
  rangeValue={range}
  onRangeChange={setRange}
  rangeMonthsToShow={2}
  startWeekOnMonday
/>;
`;

const PRESET_SNIPPET = `const rangePresets = [
  { id: "last-week", label: "Last Week" },
  { id: "next-14", label: "Next 14 Days", getRange: ({ today }) => ({
      start: today,
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13)
  })}
];

<DatePicker
  mode="range"
  showPresetPanel
  presetPanelTitle="Quick Ranges"
  rangePresetLabel="Team Presets"
  rangePresets={rangePresets}
/>;
`;

const THEME_SNIPPET = `const theme = {
  background: "#f4f8f9",
  surface: "#e6eef0",
  primary: "#176b87",
  primaryStrong: "#0f5168",
  border: "#bdd4db",
  panelRadius: "20px"
};

<DatePicker theme={theme} showPresetPanel />;
`;

const customTheme: Partial<DatePickerTheme> = {
  background: "#f4f8f9",
  surface: "#e6eef0",
  primary: "#176b87",
  primaryStrong: "#0f5168",
  primarySoft: "#dbe9ed",
  border: "#bdd4db",
  shadow: "0 20px 40px rgba(20, 84, 106, 0.18)",
  panelRadius: "20px",
  inputRadius: "14px",
  dayRadius: "12px"
};

export function LiveDemos(): JSX.Element {
  const [singleDate, setSingleDate] = useState<Date | null>(new Date());
  const [rangeDate, setRangeDate] = useState<DateRange>({ start: null, end: null });
  const [presetRange, setPresetRange] = useState<DateRange>({ start: null, end: null });
  const [themedDate, setThemedDate] = useState<Date | null>(new Date());

  return (
    <div className="demo-grid">
      <article className="demo-card reveal">
        <h3>Single Date Mode</h3>
        <p>Controlled input, locale support, min/max bounds, and Monday-based week layout.</p>
        <DatePicker
          value={singleDate}
          onChange={setSingleDate}
          minDate={new Date(2024, 0, 1)}
          maxDate={new Date(2030, 11, 31)}
          startWeekOnMonday
        />
        <small>Selected: {singleDate ? singleDate.toDateString() : "None"}</small>
        <CodeSnippet title="Single Date" code={SINGLE_SNIPPET} />
      </article>

      <article className="demo-card reveal">
        <h3>Range Mode + Two Months</h3>
        <p>
          Hover preview, start/end selection flow, dual-month panel, and hidden spillover days for
          cleaner focus.
        </p>
        <DatePicker
          mode="range"
          rangeValue={rangeDate}
          onRangeChange={(next) => setRangeDate(next ?? { start: null, end: null })}
          rangeMonthsToShow={2}
          startWeekOnMonday
        />
        <small>
          Selected: {rangeDate.start ? rangeDate.start.toDateString() : "None"} to{" "}
          {rangeDate.end ? rangeDate.end.toDateString() : "None"}
        </small>
        <CodeSnippet title="Range + Two Months" code={RANGE_SNIPPET} />
      </article>

      <article className="demo-card reveal">
        <h3>Preset Side Panel</h3>
        <p>
          Enable quick actions with defaults or provide your own presets, labels, and contextual
          names.
        </p>
        <DatePicker
          mode="range"
          rangeValue={presetRange}
          onRangeChange={(next) => setPresetRange(next ?? { start: null, end: null })}
          showPresetPanel
          presetPanelTitle="Quick Ranges"
          rangePresetLabel="Team Presets"
          rangePresets={[
            { id: "last-week", label: "Last Week" },
            { id: "last-month", label: "Last Month" },
            {
              id: "next-14",
              label: "Next 14 Days",
              getRange: ({ today }) => ({
                start: today,
                end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13)
              })
            }
          ]}
        />
        <small>
          Selected: {presetRange.start ? presetRange.start.toDateString() : "None"} to{" "}
          {presetRange.end ? presetRange.end.toDateString() : "None"}
        </small>
        <CodeSnippet title="Preset Panel" code={PRESET_SNIPPET} />
      </article>

      <article className="demo-card reveal">
        <h3>Theme Tokens</h3>
        <p>
          Pass typed theme tokens for color, radius, font, and elevation. No CSS override hacks
          needed.
        </p>
        <DatePicker
          value={themedDate}
          onChange={setThemedDate}
          showPresetPanel
          singlePresetLabel="Shortcuts"
          theme={customTheme}
        />
        <small>Selected: {themedDate ? themedDate.toDateString() : "None"}</small>
        <CodeSnippet title="Theme Customization" code={THEME_SNIPPET} />
      </article>
    </div>
  );
}
