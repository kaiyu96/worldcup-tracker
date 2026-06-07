import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap"
});

export const metadata: Metadata = {
  title: "WorldCup Tracker - 2026 世界杯 Polymarket 追踪",
  description: "专注追踪 Polymarket 上 2026 FIFA World Cup 冠军、晋级、球队、球员与交易异动市场。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-display antialiased`}>
        <div className="grid-noise min-h-screen">{children}</div>
      </body>
    </html>
  );
}
