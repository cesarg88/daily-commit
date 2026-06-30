import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Commit",
  description: "Minimal scaffold for the Daily Commit web app.",
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
