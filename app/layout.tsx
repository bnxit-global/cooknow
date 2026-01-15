import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CookNow - Find Recipes by Ingredients",
  description: "Tell us what ingredients you have, and we'll find the perfect recipe for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
