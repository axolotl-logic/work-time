import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Eternal Work Buddies",
  description: "Alternate between work and rest with people across the world.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <main
          className={`min-h-screen overflow-hidden bg-gray-950 text-gray-100`}
        >
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
