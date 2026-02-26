# ez-date-picker

A modern, lightweight React date picker component with a polished calendar popover UI.

## Install

```bash
npm install ez-date-picker
```

## Usage

```tsx
import { useState } from "react";
import { DatePicker } from "ez-date-picker";
import "ez-date-picker/styles.css";

export default function App() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      placeholder="Choose a date"
      minDate={new Date(2020, 0, 1)}
      maxDate={new Date(2030, 11, 31)}
      startWeekOnMonday
    />
  );
}
```

Range mode:

```tsx
import { useState } from "react";
import { DatePicker, type DateRange } from "ez-date-picker";

export default function App() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  return (
    <DatePicker
      mode="range"
      rangeValue={range}
      onRangeChange={setRange}
      placeholder="Choose date range"
    />
  );
}
```

Preset side panel:

```tsx
import { DatePicker } from "ez-date-picker";

<DatePicker
  mode="range"
  showPresetPanel
  presetPanelTitle="Quick Ranges"
  rangePresetLabel="Popular ranges"
  rangeMonthsToShow={2}
/>;
```

Theme customization:

```tsx
import { DatePicker, type DatePickerTheme } from "ez-date-picker";

const theme: Partial<DatePickerTheme> = {
  primary: "#c2410c",
  primaryStrong: "#9a3412",
  primarySoft: "#ffedd5",
  border: "#fed7aa",
  shadow: "0 18px 40px rgba(154, 52, 18, 0.16)",
  inputRadius: "14px",
  panelRadius: "18px",
  dayRadius: "12px"
};

<DatePicker theme={theme} />;
```

## Props

- `mode?: "single" | "range"` (default `"single"`)
- `showRangeMeta?: boolean` (default `true`, range mode only)
- `rangeMonthsToShow?: 1 | 2` (default `1`, used in range mode)
- `theme?: Partial<DatePickerTheme>` (typed visual tokens for color/radius/shadow/font)
- `showPresetPanel?: boolean` (default `false`)
- `presetPanelTitle?: string` (default `"Quick Select"`)
- `singlePresetLabel?: string` (default `"Single Date"`)
- `rangePresetLabel?: string` (default `"Date Range"`)
- `singlePresets?: SingleDatePreset[]` (custom list for single mode)
- `rangePresets?: RangeDatePreset[]` (custom list for range mode)
- `value?: Date | null`
- `onChange?: (date: Date | null) => void`
- `rangeValue?: { start: Date | null; end: Date | null } | null`
- `onRangeChange?: (range: { start: Date | null; end: Date | null } | null) => void`
- `placeholder?: string`
- `minDate?: Date`
- `maxDate?: Date`
- `disabled?: boolean`
- `className?: string`
- `style?: React.CSSProperties`
- `locale?: string` (default `en-US`)
- `startWeekOnMonday?: boolean` (default `false`)

## Development

```bash
npm install
npm run build
```

Documentation app:

```bash
cd docs
npm install
npm run dev
```

## Contributing & Issues

If you want to contribute or report bugs/issues, use:

`https://github.com/MdShafiul/ez-date-picker`

## License

MIT
