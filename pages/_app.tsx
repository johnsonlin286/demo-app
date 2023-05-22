import type { AppProps } from 'next/app'
// import { Router } from 'next/router';
// import NProgress from 'nprogress';
import { AppContextProvider } from '../context'
import Layout from '../components/layout'

import '../styles/global.scss'

// NProgress.configure({showSpinner: false});
// Router.events.on('routeChangeStart', () => NProgress.start());
// Router.events.on('routeChangeComplete', () => NProgress.done(false));
// Router.events.on('routeChangeError', () => NProgress.done(true));

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContextProvider>
  )
}

export default MyApp
