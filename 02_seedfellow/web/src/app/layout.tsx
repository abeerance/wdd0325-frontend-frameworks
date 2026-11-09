import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { SiteNav } from "@/components/site-nav";

// next/font downloads these fonts at build time and serves them from this site, so the page
// does not wait on a request to Google. `variable` names the CSS variable the stylesheet reads.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Next reads this export and writes the <title> and the description meta tag into the <head>.
// A page can export its own metadata to replace it.
export const metadata: Metadata = {
  title: "Seedfellow",
  description:
    "A neighbourhood seed library. Borrow a packet, grow it, bring some back.",
};

// The root layout wraps every page and is the only file that renders <html> and <body>.
// `children` is the page the router picked, so the header and footer stay while the page between them
// changes. LayoutProps<"/"> is a type Next generates from the route files, so `children` is typed
// without writing it out.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* A column that is at least as tall as the window, with <main> taking the spare space (flex-1):
          the footer sits at the bottom of a short page instead of floating under the content. */}
      <body className="min-h-full flex flex-col">
        <header className="border-line border-b bg-card">
          <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6">
            <Logo />
            <SiteNav />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
