import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import "./globals.css";

export const metadata: Metadata = {
  title: "Bolão entre Amigos",
  description: "Bolões privados entre amigos — sem dinheiro, só diversão.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
