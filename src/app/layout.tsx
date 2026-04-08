import { Open_Sans } from "next/font/google";
import "./globals.css";
import Layout from "@/layouts/Layout";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${openSans.variable} antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
