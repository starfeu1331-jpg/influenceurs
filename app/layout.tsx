import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { HomeIcon, UserGroupIcon, CalendarIcon, ChartBarIcon, Squares2X2Icon, PlusIcon } from '@heroicons/react/24/outline'
import NativeSwipeLayout from './native-swipe-page'

export const metadata: Metadata = {
  title: 'CRM Influenceurs',
  description: 'Gestion professionnelle de campagnes influenceurs',
  manifest: '/manifest.json',
  themeColor: '#007AFF',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'D2D CRM',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="smooth-scroll">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="D2D CRM" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <div className="min-h-screen">
          {/* Glass Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8">
              <div className="flex justify-between items-center h-14 md:h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-apple-blue-500 to-apple-purple-500 rounded-apple flex items-center justify-center shadow-apple transition-transform duration-200 group-hover:scale-110">
                    <span className="text-white font-bold text-xs md:text-sm">I</span>
                  </div>
                  <span className="text-callout md:text-headline text-apple-gray-900 font-semibold hidden sm:block">
                    Influenceurs
                  </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center space-x-0.5 md:space-x-1">
                  <Link
                    href="/"
                    className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1.5 md:py-2 rounded-apple text-footnote md:text-subhead font-medium text-apple-gray-700 hover:bg-white/50 hover:text-apple-blue-600 transition-all duration-200"
                  >
                    <HomeIcon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                  
                  <Link
                    href="/influencers"
                    className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1.5 md:py-2 rounded-apple text-footnote md:text-subhead font-medium text-apple-gray-700 hover:bg-white/50 hover:text-apple-blue-600 transition-all duration-200"
                  >
                    <UserGroupIcon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden lg:inline">Influenceurs</span>
                  </Link>
                  
                  <Link
                    href="/projects/pipeline"
                    className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1.5 md:py-2 rounded-apple text-footnote md:text-subhead font-medium text-apple-gray-700 hover:bg-white/50 hover:text-apple-blue-600 transition-all duration-200"
                  >
                    <Squares2X2Icon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden lg:inline">Pipeline</span>
                  </Link>
                  
                  <Link
                    href="/calendar"
                    className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1.5 md:py-2 rounded-apple text-footnote md:text-subhead font-medium text-apple-gray-700 hover:bg-white/50 hover:text-apple-blue-600 transition-all duration-200"
                  >
                    <CalendarIcon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden lg:inline">Calendrier</span>
                  </Link>
                  
                  <Link
                    href="/influencers/compare"
                    className="hidden md:flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1.5 md:py-2 rounded-apple text-footnote md:text-subhead font-medium text-apple-gray-700 hover:bg-white/50 hover:text-apple-blue-600 transition-all duration-200"
                  >
                    <ChartBarIcon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden lg:inline">Comparateur</span>
                  </Link>

                  {/* CTA Button */}
                  <Link
                    href="/projects/new"
                    className="ml-2 md:ml-4 flex items-center space-x-1 md:space-x-2 btn-primary text-footnote md:text-subhead px-2 md:px-4 py-1.5 md:py-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Nouveau projet</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content with top padding for fixed nav */}
          <main className="pt-16 md:pt-24 pb-12 md:pb-16">
            <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8">
              <NativeSwipeLayout>
                {children}
              </NativeSwipeLayout>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}

