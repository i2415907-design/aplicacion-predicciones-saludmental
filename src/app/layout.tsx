import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { InterstitialPopup } from "@/components/interstitial-popup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema IA - Prevención Depresión y Suicidio",
  description: "Sistema de BI e Inteligencia Artificial para análisis de depresión y prevención del suicidio",
  icons: {
    icon: "/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <InterstitialPopup />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
