import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Everlasting | Shared Wedding Camera",
  description: "Join the celebration and share your memories in real-time. A premium shared camera experience for one unforgettable day.",
  applicationName: "Everlasting",
  keywords: ["wedding", "shared camera", "real-time photos", "event gallery"],
  openGraph: {
    title: "Everlasting | Our Shared History",
    description: "Capture and share the magic of our wedding day.",
    type: "website",
    images: [
      {
        url: "/couple-1.png",
        width: 1200,
        height: 630,
        alt: "Everlasting Wedding",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoSerif.variable} antialiased`}
      >
        <main className="min-h-screen selection:bg-accent selection:text-white">
          {children}
        </main>
      </body>
    </html>
  );
}
