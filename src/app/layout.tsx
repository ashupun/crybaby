import type { Metadata } from "next";
import "./globals.css";
import Shell from "./shell";

export const metadata: Metadata = {
  title: "cryba.by",
  description: "Your safe space to let it all out",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}