import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const PRODUCTION_URL = "https://multimeter-speaker.netlify.app";
const DEPLOY_URL = process.env.DEPLOY_URL || PRODUCTION_URL;

const title = "Multimeter speaker";
const description =
  "Speaker for bluetooth DMMs like Aneng-9002, BSIDE ZT-300AB, ZOYI ZT-300AB, BABATools AD-900";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(DEPLOY_URL),
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title,
    description,
    url: PRODUCTION_URL,
    siteName: title,
    locale: "en_US",
    type: "website",
    images: "/icon.png",
  },
  themeColor: "#F7CB47",
  manifest: "/manifest.json",
  category: "technology",
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
