import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tennis Coach",
  description: "Planificá clases, registrá sesiones y seguí el progreso de tus alumnos.",
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="polvo-de-ladrillo">
      <body>{children}</body>
    </html>
  );
}
