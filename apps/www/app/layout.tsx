import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import '@/registry/theme/globals.css';
import './app.css';
import { cn } from '@/registry/lib/utils';
import { Header } from '@/header/components/header';
import { TooltipProvider } from '@/registry/ui/tooltip';

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
        <NuqsAdapter>
          <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            <TooltipProvider>
              <div>
                <div>
                  <Header />
                  <main>{children}</main>
                </div>
              </div>
            </TooltipProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
