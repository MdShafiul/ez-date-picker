import React, { useState } from "react";
import { DatePicker, type DateRange } from "ez-date-picker";
import "ez-date-picker/styles.css";
import "./app.css";

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
