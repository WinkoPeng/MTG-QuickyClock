import { Inter } from "next/font/google";
import PrelineScript from "./PrelineScript";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MTG Quicky Clock",
  description: "Clock in and out with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <PrelineScript />
    </html>
  );
}
