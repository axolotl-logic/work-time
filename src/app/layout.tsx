import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <div
          className={`dark flex min-h-dvh flex-col items-center justify-center bg-gray-950`}
        >
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
