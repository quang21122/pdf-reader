import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import ApolloProvider from "@/components/providers/ApolloProvider";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "PDF Reader - Advanced PDF Viewer with OCR",
  description:
    "A modern PDF reader with OCR capabilities, note-taking, and highlighting features",
  keywords: ["PDF", "reader", "OCR", "notes", "highlights", "Tesseract"],
  authors: [{ name: "PDF Reader Team" }],
  icons: {
    icon: "/icon-app.svg",
    shortcut: "/icon-app.svg",
    apple: "/icon-app.svg",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EB5757",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        <AuthProvider>
          <ApolloProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ApolloProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
