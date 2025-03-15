"use client";

import { useMemo, useState } from "react";

import { useLiveQuery } from "dexie-react-hooks";

// react-hook-form
import { useForm } from "react-hook-form";

// Ours - Utils
import { timeInWords } from "~/lib/time";
import { Timer } from "./timer";
import { db } from "~/client/db";
import { useUserId } from "~/hooks/useUserId";

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

  const { register, watch, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      breakLength: timer?.breakLength ?? DEFAULT_FORM.breakLength,
      workLength: timer?.workLength ?? DEFAULT_FORM.workLength,
      sync: true,
    },
  });

  const sync = watch("sync");

  const startTime = useMemo(() => {
    if (sync) {
      return 0;
    } else {
      return Date.now();
    }
  }, [sync]);

  const onSubmit = handleSubmit(async ({ workLength, breakLength }, e) => {
    e?.preventDefault();

    const timer = {
      userId,
      workLength: Number(workLength),
      breakLength: Number(breakLength),
      startTime: Number(startTime),
      createdAt: Date.now(),
    };

    await db.timer.add(timer);

    const url = `/timer?workLength=${workLength}&breakLength=${breakLength}&startTime=${startTime}`;
    window.history.pushState(null, "", url);
    setShowTimer(true);
  });

  const onClose = () => {
    setShowTimer(false);
    window.history.pushState(null, "", "/");
  };

  return (
    <>
      <form
        className="flex flex-col gap-4"
        method="GET"
        onSubmit={onSubmit}
        action="/timer"
      >
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
          <input name="startTime" type="hidden" value={startTime} />
        </div>
        <div>
          <button className="btn btn-primary btn-sm" type="submit">
            Start
          </button>
        </div>
      </form>
      {showTimer && <Timer onClose={() => onClose()} />}
    </>
  );
}
