import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Preloader from "@/components/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://weekendtravellers.com'),
  title: {
    default: 'Weekend Trip Planner India | AI Itineraries & Getaways - Weekend Travellers',
    template: '%s | Weekend Travellers'
  },
  description: 'The #1 AI weekend trip planner for India. Discover perfect weekend getaways, plan short trips, and find hidden gems with personalized daily itineraries.',
  keywords: ['weekend trip planner india', 'weekend getaways india', 'AI trip planner', 'short trips india', 'weekend travel', 'holiday planner', 'India tourism', 'weekend destinatinos'],
  authors: [{ name: 'Weekend Travellers' }],
  creator: 'Weekend Travellers',
  publisher: 'Weekend Travellers',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://weekendtravellers.com',
    title: 'Weekend Travellers - AI-Powered Weekend Trip Planner',
    description: 'Discover perfect weekend getaways in India with AI-powered trip planning. Get personalized itineraries, hotel recommendations, and local attractions.',
    siteName: 'Weekend Travellers',
    images: [
      {
        url: '/logo.svg',
        width: 200,
        height: 200,
        alt: 'Weekend Travellers Logo',
      },
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Weekend Travellers - Plan Your Perfect Weekend',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weekend Travellers - AI-Powered Weekend Trip Planner',
    description: 'Discover perfect weekend getaways in India with AI-powered trip planning',
    images: ['/twitter-image.jpg'],
    creator: '@weekendtravellers',
  },
  verification: {
    google: 'V8n7TDg8nXjG8MSM24eAinDv6NLj4Mel31NizS_cX1o',
  },
  other: {
    'google-adsense-account': 'pub-9460255466960810',
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Preloader />
        <ThemeProvider defaultTheme="dark">
          <AnalyticsProvider />
          <StructuredData />
          <GoogleAnalytics />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
