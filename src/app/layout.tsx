import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'DEAL - منصة الحرفيين والتجار في سوق أهراس | Souk Ahras',
  description: 'DEAL هي منصة رقمية متكاملة تربط الحرفيين والتجار وأصحاب المعدات والمستخدمين في سوق أهراس والولايات المجاورة. ابحث عن أفضل الخدمات والمنتجات والمعدات.',
  keywords: 'سوق أهراس, حرفيين, تجار, معدات, خدمات, منتجات, Souk Ahras, DEAL, artisans, commerçants, Algérie',
  authors: [{ name: "DEAL Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: 'DEAL - منصة الحرفيين والتجار في سوق أهراس',
    description: 'ابحث عن أفضل الخدمات والمنتجات والمعدات في سوق أهراس',
    siteName: 'DEAL',
    locale: 'ar_DZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DEAL - منصة الحرفيين والتجار',
    description: 'ابحث عن أفضل الخدمات والمنتجات والمعدات في سوق أهراس',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Inter', 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
