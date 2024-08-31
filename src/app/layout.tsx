import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Providers } from "@/context/provders";
const inter = Noto_Kufi_Arabic({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "اقرألي",
  description:
    "يتيح لك إقرألي تسجيل أو إدخال آية قرآنية، ويعرض لك التلاوة الأقرب لما تبحث عنه مع إمكانية الاطلاع على التفسير. استمع للآيات واكتشف المزيد من الميزات المفيدة!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" data-theme="cupcake" lang="ar">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
