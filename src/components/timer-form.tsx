"use client";

import { type MouseEventHandler, useState } from "react";

import { useLiveQuery } from "dexie-react-hooks";

// react-hook-form
import { useForm } from "react-hook-form";

// Ours - Utils
import { timeInWords } from "~/lib/time";
import { Timer } from "./timer";
import { db } from "~/client/db";
import { useUserId } from "~/hooks/useUserId";
import { handleError } from "~/lib/error";

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
  workLength: TIME_PRESETS[5]!,
  breakLength: TIME_PRESETS[0]!,
  sync: true,
};

type FormValues = typeof DEFAULT_FORM;

interface TimerFormProps {
  defaultShowTimer?: boolean;
}

export function TimerForm({ defaultShowTimer }: TimerFormProps) {
  const userId = useUserId();
  const [showTimer, setShowTimer] = useState(!!defaultShowTimer);
  const timer = useLiveQuery(async () => {
    return await db.timer.orderBy("createdAt").last();
  });

  const { register, watch } = useForm<FormValues>({
    defaultValues: {
      breakLength: timer?.breakLength ?? DEFAULT_FORM.breakLength,
      workLength: timer?.workLength ?? DEFAULT_FORM.workLength,
      sync: true,
    },
  });

  const sync = watch("sync");
  const breakLength = watch("breakLength");
  const workLength = watch("workLength");

  const onSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    e?.preventDefault();

    const startTime = sync ? 0 : Date.now();

    const timer = {
      userId,
      workLength: Number(workLength),
      breakLength: Number(breakLength),
      startTime: Number(startTime),
      createdAt: Date.now(),
    };

    db.timer.add(timer).catch(handleError);

    setShowTimer(true);
  };

  const onClose = () => {
    setShowTimer(false);
    window.history.pushState(null, "", "/");
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <label className="select select-primary">
            <span className="label">Work for</span>
            <select
              defaultValue={DEFAULT_FORM.workLength}
              {...register("workLength", { required: true })}
            >
              {TIME_PRESETS.map((num) => (
                <option key={num} value={num}>
                  {timeInWords(num)}
                </option>
              ))}
            </select>
          </label>
          <label className="select">
            <span className="label">Break for</span>
            <select
              defaultValue={DEFAULT_FORM.breakLength}
              {...register("breakLength", { required: true })}
            >
              {TIME_PRESETS.map((num) => (
                <option key={num} value={num}>
                  {timeInWords(num)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-wrap gap-4">
            <span className="label">Sync with universe?</span>
            <input
              className="checkbox"
              type="checkbox"
              {...register("sync", { required: true })}
            />
          </label>
        </div>
        <div>
          <button onClick={onSubmit} className="btn btn-primary btn-sm">
            Start
          </button>
        </div>
      </div>
      {showTimer && <Timer onClose={() => onClose()} />}
    </>
  );
}
