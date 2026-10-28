import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vitapharm | Book Your Treatment",
  description: "Book aesthetic and clinical spa treatments at Vitapharm. Facials, laser, and more — pay on arrival.",
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
