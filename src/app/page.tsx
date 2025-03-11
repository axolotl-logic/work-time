"use client";

import Image from "next/image";
import Link from "next/link";
import { TimerForm } from "~/components/timer-form";

export default function HomePage() {
  return (
    <main className="flex flex-wrap-reverse justify-center gap-8 p-8">
      <div className="prose flex flex-col">
        <h1 className="border-secondary border-t-2 border-solid pt-6">
          Get ready to work!
        </h1>
        <div className="flex items-center">
          <div className="z-50">
            <Image
              className="animate-fancy-in hidden sm:block"
              alt="adorable axolotl"
              src="/mascot-medium.png"
              width="600"
              height="409"
            />
          </div>
          <div className="max-w-md">
            <TimerForm />
          </div>
        </div>
        <p className="border-secondary border-b-2 border-solid pb-4 text-justify">
          Our purpose is to guide you through work and break periods with a
          clutter-free timer. We embrace minimalism and will always be{" "}
          <Link className="text-primary" href="/donate">
            ad-free
          </Link>
          , allowing you to focus on the task at hand and not annoying ads.
          <br />
          <br />
          In addition, we provide quiet coworking and digital body doubling with
          shared timers in order to synchronize work and break cycles.
        </p>
      </div>
    </main>
  );
}
