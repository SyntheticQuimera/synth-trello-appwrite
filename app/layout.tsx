"use client";
import AddModal from "@/components/AddModal";
import "./globals.css";
import type { Metadata } from "next";
import DeleteModal from "@/components/DeleteModal";
import { useTheme } from "@/store/useThemeStore";

export const metadata: Metadata = {
  title: "Synth Trello",
  description: "Generated by Jaime Roschupkin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <html data-theme={theme} lang='en'>
      <body>
        {children}
        <AddModal />
        <DeleteModal />
      </body>
    </html>
  );
}
