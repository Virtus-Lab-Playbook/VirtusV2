import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/content/site";
import {
  getSiteUrl,
  isIndexableDeployment,
} from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

const metadataBase =
  getSiteUrl();

const indexable =
  isIndexableDeployment();

export const metadata: Metadata = {
  metadataBase,
  applicationName:
    site.name,
  title: {
    default:
      `${site.name} — ${site.tagline}`,
    template:
      `%s — ${site.name}`,
  },
  description:
    site.seo.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      `${site.name} — ${site.tagline}`,
    description:
      site.seo.socialDescription,
    type: "website",
    url: "/",
    siteName: site.name,
    images: [
      {
        url:
          "/opengraph-image",
        width: 1200,
        height: 630,
        alt:
          `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card:
      "summary_large_image",
    title:
      `${site.name} — ${site.tagline}`,
    description:
      site.seo.socialDescription,
    images: [
      "/opengraph-image",
    ],
  },
  robots: {
    index: indexable,
    follow: indexable,
    googleBot: {
      index: indexable,
      follow: indexable,
      "max-image-preview":
        "large",
      "max-snippet": -1,
      "max-video-preview":
        -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1B2A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
