import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "ez-date-picker/styles.css";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

export const metadata: Metadata = {
  title: "ez-date-picker Docs",
  description:
    "Modern React date picker docs with live demos, code snippets, and package comparisons."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>{children}</body>
    </html>
  );
}
