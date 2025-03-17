import Image from "next/image";
import { TimerForm } from "./timer-form";
import { Link } from "./ui/link";
import { useEffect } from "react";

export function HomePage() {
  useEffect(() => {
    if (window.location.href != "/") {
      window.history.pushState(null, "", "/");
    }
  });

  return (
    <main className="prose flex flex-col p-8">
      <h1 className="text-neutral-200">Get ready to work!</h1>
      <div className="flex items-center">
        <div>
          <Image
            priority={true}
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
      <p className="border-l-2 border-solid border-l-white pl-2 text-justify text-neutral-200">
        Tip: After starting the timer, share the page{"'"}s URL to synchronize
        with your friends.
        <br />
      </p>
      <p className="text-justify text-neutral-200">
        Be guided alongside others through short sprints of work and rest by our
        minimalist visual timer. Best of all? It works offline and will always
        be free and open source!
        <br />
        <Link href="https://github.com/sponsors/axolotl-logic">Donate</Link> to
        help sustain us.
      </p>
    </main>
  );
}
