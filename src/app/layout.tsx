import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ToastContainer from "@/components/ui/ToastContainer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Board",
  description: "A modern task management board built for Hintro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
