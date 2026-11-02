import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Seedfellow",
	description: "Seefellow",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<header className="border-line border-b bg-card">
					<div className="mx-auto flex min-h-16 w-full max-w-6xl items-center px-4 sm:px-6">
						<p className="font-semibold text-ink text-lg">Seedfellow</p>
					</div>
				</header>
				<main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
					{children}
				</main>
			</body>
		</html>
	);
}
