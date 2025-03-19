import { useMemo, type ReactNode } from "react";
import { type Route, routeToUrl } from "../router";

import { navigate } from "~/client/nav";

export function Link({
  route,
  children,
}: {
  route: Route;
  children: ReactNode;
}) {
  const href = useMemo(() => routeToUrl(route), [route]);

  return (
    <a
      onClick={async (e) => {
        e.preventDefault();
        navigate(route);
      }}
      href={href}
      className="p-4 text-blue-400 underline hover:cursor-pointer hover:text-purple-400"
    >
      {children}
    </a>
  );
}
