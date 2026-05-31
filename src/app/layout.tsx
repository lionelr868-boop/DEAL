import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DEAL - المنصة المتكاملة لسوق أهراس",
  description: "منصة رقمية متكاملة تربط الحرفيين، التجار، ولوحي المعدات بالمستخدمين في سوق أهراس والولايات المجاورة",
  keywords: ["DEAL", "سوق أهراس", "حرفيين", "تجار", "معدات", "Souk Ahras", "artisans", "Algérie"],
  authors: [{ name: "DEAL Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "DEAL - المنصة المتكاملة لسوق أهراس",
    description: "الحرفيون والتجار في متناول يدك",
    siteName: "DEAL",
    type: "website",
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
