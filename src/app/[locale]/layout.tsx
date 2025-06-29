import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "../providers";
import { getMessages } from "next-intl/server";
import Header from "@/components/Header";
import { ReactNode } from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

type Props = {
    children: ReactNode;
    params: { locale: string };
};

export default async function RootLayout({ children, params }: Props) {
    const { locale } = params;

    return (
        <html lang={locale}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Header />
                <NextIntlClientProvider
                    locale={locale}
                    messages={await getMessages({ locale })}
                >
                    <Providers>
                        {/* клиентский компонент в серверном layout */}
                        {children}
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
