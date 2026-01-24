import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
    default: 'Weekend Travellers - AI-Powered Weekend Trip Planner for India',
    template: '%s | Weekend Travellers'
  },
  description: 'Discover perfect weekend getaways in India with AI-powered trip planning. Get personalized itineraries, hotel recommendations, and local attractions for your next adventure.',
  keywords: ['weekend trips India', 'weekend getaways', 'AI trip planner', 'travel planner India', 'weekend travel', 'short trips India', 'weekend destinations', 'travel itinerary', 'India tourism'],
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
    canonical: 'https://weekendtravellers.com',
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
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
        <GoogleAnalytics />
        <ThemeProvider defaultTheme="dark">
          <StructuredData />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
