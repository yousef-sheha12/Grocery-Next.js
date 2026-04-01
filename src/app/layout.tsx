import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Wrapper from "./Wrapper";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grocery",
  description:
    "Grocery is a grocery store that sells fresh food and other products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Wrapper>{children}</Wrapper>
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: "#166534",
                  color: "white",
                },
              },
              error: {
                style: {
                  background: "#dc2626",
                  color: "white",
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
