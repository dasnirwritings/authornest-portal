import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/components/theme-provider'
import { UserProvider } from '@/context/UserContext'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/router'

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const noLayout = 
    router.pathname === '/' || 
    router.pathname.startsWith('/sites/') || 
    router.pathname.startsWith('/signup');

  return (
    <>
      {noLayout ? (
        <Component {...pageProps} />
      ) : (
        <div className="flex">
          <Sidebar />
          <main className="flex-grow pl-64"> {/* 250px sidebar width + padding */}
            <Component {...pageProps} />
          </main>
        </div>
      )}
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </UserProvider>
    </ThemeProvider>
  )
}
