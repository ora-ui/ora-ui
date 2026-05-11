import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import '@/registry/theme/globals.css';
import './layout.css';
import { cn } from '@/registry/lib/utils';
import { AppHeader } from './layout/AppHeader';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ora UI',
  description: 'A React component library built on shadcn patterns.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(geist.variable, geistMono.variable)} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <div className="RootLayout">
            <div className="RootLayoutContainer">
              <div className="RootLayoutContent">
                <AppHeader />
                <main>{children}</main>
              </div>
              <span className="AppFooter"></span>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
