import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Commit",
  description:
    "Founder MVP for planning, executing, and reviewing daily commitments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
