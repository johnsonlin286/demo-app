import { AppContextProvider } from '../context'
import Layout from '../components/layout'

import '../styles/global.scss'

function MyApp({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContextProvider>
  )
}

export default MyApp
