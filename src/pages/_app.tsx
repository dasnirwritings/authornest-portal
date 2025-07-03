import type { AppProps } from 'next/app';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/router';
import { UserProvider, useUser } from '@/context/UserContext';
import Theme from '@/components/Theme';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// A basic theme to start. We can customize this later.
const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#6a11cb',
    },
    secondary: {
      main: '#2575fc',
    },
  },
});

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const userContext = useUser();
  
  const theme = userContext?.userProfile?.theme_preference || 'modern';

  const noLayout = 
    router.pathname === '/' || 
    router.pathname.startsWith('/sites/') || 
    router.pathname.startsWith('/signup');

  // Show a global loading indicator while the user profile is being fetched
  if (userContext && userContext.loading && !noLayout) {
      return (
          <Theme themeName={theme}>
              <div style={{display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center'}}>Loading Platform...</div>
          </Theme>
      )
  }

  return (
    <Theme themeName={theme}>
      {noLayout ? (
        <Component {...pageProps} />
      ) : (
        <div style={{display: 'flex'}}>
          <Sidebar />
          <main style={{flexGrow: 1, paddingLeft: '250px'}}>
            <Component {...pageProps} />
          </main>
        </div>
      )}
    </Theme>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={muiTheme}>
      <UserProvider>
        <CssBaseline />
        <AppContent Component={Component} pageProps={pageProps} />
      </UserProvider>
    </ThemeProvider>
  );
}

export default MyApp;
