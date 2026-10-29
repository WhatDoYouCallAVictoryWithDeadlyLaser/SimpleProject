import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from "next";
import I18nProvider from "./i18n/I18nProvider";
import Header from "./component/Header";
import Footer from "./component/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopMart - Online Shopping",
  description: "Everyday low prices, fast delivery and wide range of products.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-bs-theme', savedTheme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full d-flex flex-column">
        <I18nProvider>
          {/* Header hiển thị cố định ở mọi trang */}
          <Header />
          
          {/* Nội dung trang web */}
          <main className="flex-grow-1">
            {children}
          </main>

          {/* Footer chân trang chuẩn e-commerce */}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
