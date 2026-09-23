import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ThemeProvider } from "@/components/site/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Niodemy — Learn Anything, Anytime",
    template: "%s — Niodemy",
  },
  description:
    "India's next-gen learning platform. School, Senior (NEET/JEE), Coaching, College, ITI, Skills, GK & Atlas — all in one place. Free to browse, structured to learn.",
  keywords: [
    "Niodemy",
    "SnapZila Academy",
    "NEET preparation",
    "JEE preparation",
    "SSC coaching",
    "RRB coaching",
    "NCERT solutions",
    "GK current affairs",
    "ITI learning",
    "online learning India",
  ],
  authors: [{ name: "SnapZila Academy" }],
  openGraph: {
    title: "Niodemy — Learn Anything, Anytime",
    description:
      "India's next-gen learning platform. 8 segments. Combined courses. AI tutor. Free to browse.",
    type: "website",
    siteName: "Niodemy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niodemy — Learn Anything, Anytime",
    description: "India's next-gen learning platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
