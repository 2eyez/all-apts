import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";

export const metadata: Metadata = {
  title: "AllApartmentsonline",
  description: "Find and book shortlet apartments with All-Apts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

