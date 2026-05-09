import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IPA OTA Installer",
  description: "Drop .ipa, get install link",
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