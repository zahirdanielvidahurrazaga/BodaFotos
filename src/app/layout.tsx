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
  description: "Capture and share the magic of our special day in a premium, real-time gallery.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Everlasting",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
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
