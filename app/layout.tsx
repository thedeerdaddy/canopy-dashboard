import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canopy AI Dashboard",
  description: "AI-powered operations platform by Canopy AI Solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
