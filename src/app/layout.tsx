import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Zelo', template: '%s · Zelo' },
  description: 'Comunicação entre escola e família na educação infantil.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8f7' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1113' },
  ],
};

const THEME_COOKIE = 'zelo-theme';

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const theme = (await cookies()).get(THEME_COOKIE)?.value;
  const dataTheme = theme === 'dark' || theme === 'light' ? theme : undefined;

  return (
    <html lang="pt-BR" data-theme={dataTheme} className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
