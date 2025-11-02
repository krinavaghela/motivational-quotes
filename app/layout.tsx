import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Motivation - Inspirational Quotes",
  description: "Get inspired with daily motivational quotes",
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


