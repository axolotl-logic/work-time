"use client";

import Image from "next/image";
import { TimerForm } from "~/components/timer-form";

export default function HomePage() {
  return (
    <main className="flex size-full flex-wrap-reverse justify-center gap-8 p-16">
      <div className="prose flex flex-col">
        <h1 className="border-secondary border-t-2 border-solid pt-6">
          Get ready to work!
        </h1>
        <div className="flex items-center self-center">
          <Image
            className="hidden sm:block"
            alt="adorable axolotl"
            src="/mascot.png"
            width="240"
            height="393"
          />
          <div className="max-w-md">
            <TimerForm />
          </div>
        </div>
        <p className="border-secondary border-b-2 border-solid pb-4 text-justify">
          Our purpose is to guide you through work and break periods with a
          clutter-free timer. We embrace minimalism and will always be ad-free,
          allowing you to focus on the task at hand.
          <br />
          <br />
          In addition, we provide quiet coworking and digital body doubling with
          shared timers in order to synchronize work and break cycles.
        </p>
      </div>
    </main>
  );
}
