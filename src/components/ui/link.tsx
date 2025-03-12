import NextLink from "next/link";
import { type ReactNode } from "react";

export function Link({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <NextLink
      className="text-blue-400 underline hover:text-purple-400"
      href={href}
    >
      {children}
    </NextLink>
  );
}
