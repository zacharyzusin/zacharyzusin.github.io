import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import ParticleBackground from "./components/ParticleBackground";
import CursorSpotlight from "./components/CursorSpotlight";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zacharyzusin.github.io"),
  title: "Zach Zusin",
  description:
    "Columbia CS graduate and machine learning researcher. Vision-language models, automated theorem proving, and speech recognition — with interactive demos of the work.",
  keywords: [
    "Zach Zusin",
    "Zachary Zusin",
    "machine learning engineer",
    "ML researcher",
    "Columbia University",
    "computer science",
    "deep learning",
    "NLP",
    "computer vision",
  ],
  authors: [{ name: "Zach Zusin" }],
  openGraph: {
    type: "website",
    title: "Zach Zusin",
    description:
      "Columbia CS graduate and machine learning researcher. Interactive portfolio of ML research and projects.",
    url: "https://zacharyzusin.github.io",
    siteName: "Zach Zusin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zach Zusin",
    description:
      "Columbia CS graduate and machine learning researcher. Interactive portfolio of ML research and projects.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}
    >
      <body className="min-h-screen antialiased">
        <div className="fixed inset-0 pointer-events-none z-0">
          <ParticleBackground />
        </div>
        <CursorSpotlight />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
