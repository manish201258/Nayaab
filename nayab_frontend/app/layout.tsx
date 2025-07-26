import type { Metadata } from 'next'

import './globals.css'
import Content from "@/context/Content";

export const metadata: Metadata = {
  title: 'Nayab Co',
  description: 'Antique Boutique',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Nayab Co</title>
        <meta name="application-name" content="Nayab Co" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <Content>
          {children}
        </Content>
      </body>
    </html>
  );
}
