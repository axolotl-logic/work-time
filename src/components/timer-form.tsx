"use client";

// react-hook-form
import { useForm } from "react-hook-form";

// Ours - Utils
import { timeInWords } from "~/lib/time";

const TIME_PRESETS = [
  // 10 minutes
  10,
  // 15 minutes
  15,
  // 25 minutes
  25,
  // 30 minutes
  30,
  // 45 minutes
  45,
  // 50 minutes
  50,
  // 1 hour
  1 * 60,
  // 2 hours
  2 * 60,
].map((minutes) => minutes * 60 * 1000);

const DEFAULT_FORM = {
  workLength: 50,
  breakLength: 15,
  sync: true,
};

export function TimerForm() {
  const { register } = useForm<typeof DEFAULT_FORM>({
    defaultValues: DEFAULT_FORM,
  });

  return (
    <form className="flex flex-col gap-4" method="GET" action="/timer">
      <div className="flex flex-wrap gap-2">
        <label className="select select-primary">
          <span className="label">Work for</span>
          <select {...register("workLength", { required: true })}>
            {TIME_PRESETS.map((num) => (
              <option key={num} value={num}>
                {timeInWords(num)}
              </option>
            ))}
          </select>
        </label>
        <label className="select">
          <span className="label">Break for</span>
          <select {...register("breakLength", { required: true })}>
            {TIME_PRESETS.map((num) => (
              <option key={num} value={num}>
                {timeInWords(num)}
              </option>
            ))}
          </select>
        </label>
        <div className="flex justify-between gap-1">
          <span className="label">Sync with others?</span>
          <input
            className="checkbox"
            type="checkbox"
            {...register("sync", { required: true })}
          />
        </div>
      </div>
      <div>
        <button className="btn btn-primary btn-sm" type="submit">
          Start
        </button>
      </div>
    </form>
  );
}
