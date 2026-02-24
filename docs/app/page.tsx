import { CodeSnippet } from "../components/code-snippet";
import { LiveDemos } from "../components/live-demos";

const installSnippet = `npm install ez-date-picker`;

const quickStartSnippet = `import { useState } from "react";
import { DatePicker } from "ez-date-picker";
import "ez-date-picker/styles.css";

export default function Example() {
  const [date, setDate] = useState<Date | null>(null);

  return <DatePicker value={date} onChange={setDate} />;
}`;

const comparisonRows = [
  {
    package: "ez-date-picker",
    focus: "Product-ready date + range picker",
    strength: "Preset side panel, theme tokens, range UX, two-month mode",
    tradeoff: "Narrow scope (date-focused)"
  },
  {
    package: "react-datepicker",
    focus: "Classic all-in-one picker",
    strength: "Mature ecosystem, familiar API, broad adoption",
    tradeoff: "Heavier customization via CSS overrides"
  },
  {
    package: "react-day-picker",
    focus: "Headless calendar building block",
    strength: "Maximum composability and accessibility control",
    tradeoff: "You build most UX shell yourself"
  },
  {
    package: "MUI X Date Pickers",
    focus: "Enterprise design-system integration",
    strength: "Deep Material UI integration and broad date/time components",
    tradeoff: "Best fit when you already use MUI"
  },
  {
    package: "react-date-range",
    focus: "Range-heavy interactions",
    strength: "Strong range-selection UX patterns",
    tradeoff: "Project maintenance cadence has slowed"
  }
];

const featureItems = [
  "Single-date mode and full range mode in one component",
  "Hover-preview range selection with clear start/end states",
  "Single-month or dual-month panel rendering",
  "Optional range meta panel and optional preset side panel",
  "Built-in default presets + customizable single/range presets",
  "Theme tokens API (colors, radius, shadow, font) for fast white-labeling",
  "Controlled state API with TypeScript-first prop and preset types"
];

const propDocs: Array<{
  name: string;
  type: string;
  defaultValue: string;
  description: string;
  snippet: string;
}> = [
  {
    name: "mode",
    type: `"single" | "range"`,
    defaultValue: `"single"`,
    description: "Switches between single-date and date-range picker behaviors.",
    snippet: `<DatePicker mode="range" />`
  },
  {
    name: "showRangeMeta",
    type: "boolean",
    defaultValue: "true",
    description: "Controls the range meta block (start/end + helper text) in range mode.",
    snippet: `<DatePicker mode="range" showRangeMeta={false} />`
  },
  {
    name: "rangeMonthsToShow",
    type: "1 | 2",
    defaultValue: "1",
    description: "Shows one or two calendar months in range mode.",
    snippet: `<DatePicker mode="range" rangeMonthsToShow={2} />`
  },
  {
    name: "theme",
    type: "Partial<DatePickerTheme>",
    defaultValue: "undefined",
    description: "Typed theme tokens mapped to CSS variables for fast white-labeling.",
    snippet: `const theme = { primary: "#176b87", panelRadius: "18px" };
<DatePicker theme={theme} />`
  },
  {
    name: "showPresetPanel",
    type: "boolean",
    defaultValue: "false",
    description: "Enables side panel with quick date/date-range presets.",
    snippet: `<DatePicker mode="range" showPresetPanel />`
  },
  {
    name: "presetPanelTitle",
    type: "string",
    defaultValue: `"Quick Select"`,
    description: "Heading text displayed at the top of the preset panel.",
    snippet: `<DatePicker showPresetPanel presetPanelTitle="Quick Ranges" />`
  },
  {
    name: "singlePresetLabel",
    type: "string",
    defaultValue: `"Single Date"`,
    description: "Subtitle shown in preset panel when `mode=\"single\"`.",
    snippet: `<DatePicker showPresetPanel singlePresetLabel="Shortcuts" />`
  },
  {
    name: "rangePresetLabel",
    type: "string",
    defaultValue: `"Date Range"`,
    description: "Subtitle shown in preset panel when `mode=\"range\"`.",
    snippet: `<DatePicker mode="range" showPresetPanel rangePresetLabel="Team Presets" />`
  },
  {
    name: "singlePresets",
    type: "SingleDatePreset[]",
    defaultValue: "built-in presets",
    description: "Custom single-date presets. Add/remove items or dynamic resolvers.",
    snippet: `const singlePresets = [
  { id: "today", label: "Today" },
  { id: "next-friday", label: "Next Friday", getDate: ({ today }) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5) }
];
<DatePicker showPresetPanel singlePresets={singlePresets} />`
  },
  {
    name: "rangePresets",
    type: "RangeDatePreset[]",
    defaultValue: "built-in presets",
    description: "Custom range presets with static `range` or dynamic `getRange`.",
    snippet: `const rangePresets = [
  { id: "last-week", label: "Last Week" },
  { id: "next-14", label: "Next 14 Days", getRange: ({ today }) => ({ start: today, end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13) }) }
];
<DatePicker mode="range" showPresetPanel rangePresets={rangePresets} />`
  },
  {
    name: "value",
    type: "Date | null",
    defaultValue: "null",
    description: "Controlled selected value for single-date mode.",
    snippet: `<DatePicker value={date} onChange={setDate} />`
  },
  {
    name: "onChange",
    type: "(date: Date | null) => void",
    defaultValue: "undefined",
    description: "Change callback for single-date mode.",
    snippet: `<DatePicker value={date} onChange={(next) => setDate(next)} />`
  },
  {
    name: "rangeValue",
    type: "DateRange | null",
    defaultValue: "null",
    description: "Controlled selected range for range mode.",
    snippet: `<DatePicker mode="range" rangeValue={range} onRangeChange={setRange} />`
  },
  {
    name: "onRangeChange",
    type: "(range: DateRange | null) => void",
    defaultValue: "undefined",
    description: "Change callback for range mode.",
    snippet: `<DatePicker mode="range" onRangeChange={(next) => setRange(next ?? { start: null, end: null })} />`
  },
  {
    name: "placeholder",
    type: "string",
    defaultValue: `"Select a date"`,
    description: "Placeholder shown when no value/range is selected.",
    snippet: `<DatePicker placeholder="Pick your meeting date" />`
  },
  {
    name: "minDate",
    type: "Date",
    defaultValue: "undefined",
    description: "Disables all dates before this value.",
    snippet: `<DatePicker minDate={new Date(2025, 0, 1)} />`
  },
  {
    name: "maxDate",
    type: "Date",
    defaultValue: "undefined",
    description: "Disables all dates after this value.",
    snippet: `<DatePicker maxDate={new Date(2030, 11, 31)} />`
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables the trigger input and all interactions.",
    snippet: `<DatePicker disabled />`
  },
  {
    name: "className",
    type: "string",
    defaultValue: "undefined",
    description: "Adds custom class to the root wrapper.",
    snippet: `<DatePicker className="my-picker" />`
  },
  {
    name: "style",
    type: "React.CSSProperties",
    defaultValue: "undefined",
    description: "Inline style for the root wrapper (can work with theme tokens).",
    snippet: `<DatePicker style={{ width: 340 }} />`
  },
  {
    name: "locale",
    type: "string",
    defaultValue: `"en-US"`,
    description: "Locale for month labels and formatted selected values.",
    snippet: `<DatePicker locale="en-GB" />`
  },
  {
    name: "startWeekOnMonday",
    type: "boolean",
    defaultValue: "false",
    description: "Reorders weekday layout so the calendar starts with Monday.",
    snippet: `<DatePicker startWeekOnMonday />`
  }
];

export default function HomePage(): JSX.Element {
  return (
    <main className="docs-shell">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />

      <section className="hero reveal">
        <p className="eyebrow">ez-date-picker</p>
        <h1>
          Production-grade React date picker with modern range UX and developer-first customization.
        </h1>
        <p className="hero-copy">
          This documentation app covers every feature with live demos, copy-ready snippets, and a
          direct comparison against other popular picker packages.
        </p>
      </section>

      <section className="content-grid">
        <article className="panel reveal">
          <h2>Install</h2>
          <CodeSnippet title="npm" code={installSnippet} language="bash" />
          <CodeSnippet title="Quick Start" code={quickStartSnippet} language="tsx" />
        </article>

        <article className="panel reveal">
          <h2>Feature Coverage</h2>
          <ul className="feature-list">
            {featureItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="panel reveal">
        <h2>Interactive Demos</h2>
        <p className="section-copy">
          Each block below is a real working instance of <code>ez-date-picker</code> with focused
          configuration examples.
        </p>
        <LiveDemos />
      </section>

      <section className="panel reveal">
        <h2>Props Reference</h2>
        <p className="section-copy">
          Detailed behavior, defaults, and ready-to-use snippets for every core prop in
          <code> DatePicker </code>.
        </p>
        <div className="prop-grid">
          {propDocs.map((prop) => (
            <article key={prop.name} className="prop-card">
              <div className="prop-head">
                <h3>{prop.name}</h3>
                <span>{prop.type}</span>
              </div>
              <p className="prop-default">Default: {prop.defaultValue}</p>
              <p>{prop.description}</p>
              <CodeSnippet title={prop.name} code={prop.snippet} language="tsx" />
            </article>
          ))}
        </div>
      </section>

      <section className="panel reveal">
        <h2>Package Comparison</h2>
        <p className="section-copy">
          High-level comparison against commonly used React date picker libraries (snapshot: February
          24, 2026).
        </p>
        <div className="table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Package</th>
                <th>Primary Focus</th>
                <th>Strength</th>
                <th>Tradeoff</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.package}>
                  <td>{row.package}</td>
                  <td>{row.focus}</td>
                  <td>{row.strength}</td>
                  <td>{row.tradeoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
