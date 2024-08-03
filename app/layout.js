import { Inter } from "next/font/google";
import { JetBrains_Mono } from "next/font/google"; // Import JetBrains Mono font
import "./globals.css";
import "devicon/devicon.min.css";

const inter = Inter({ subsets: ["latin"] });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"] }); // Initialize JetBrains Mono

export const metadata = {
  title: "Zachary Zusin",
  description: "Zachary Zusin's Personal Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add any additional links or meta tags here */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} ${jetBrainsMono.className}`}>
        {children}
      </body>
    </html>
  );
}
