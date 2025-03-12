import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { AppDescription, AppName } from "./manifest";

export const metadata: Metadata = {
  title: AppName,
  description: AppDescription,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

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
