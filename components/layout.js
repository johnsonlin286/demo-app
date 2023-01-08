import { useContext } from 'react';
import { AppContext } from '../context';
import { useRouter } from 'next/router';

import Head from 'next/head'
import BottomNav from './bottom-nav';
import BottomSheet from './bottomsheet';

import { about } from '../utils/about';

const parse = require('html-react-parser');

const propTypes = {};

const defaultProps = {};

const Layout = ({ children }) => {
  const router = useRouter();
  const context = useContext(AppContext);
  
  return (
    <div>
      <Head>
        <title>MERN Stack Demo App</title>
        <meta name="description" content="MERN Stack Demo App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="md:w-7/12 lg:w-6/12 xl:w-4/12 min-h-screen mx-auto overflow-x-hidden">
        {
          children
        }
        {
          router.asPath !== '/signin' && router.asPath !== '/signout' && <BottomNav/>
        }
        <BottomSheet 
          open={context.about}
          height="50"
          onDismiss={() => context.setAbout(false)}
        >
          {parse(about)}
        </BottomSheet>
      </main>
    </div>
  );
};

Layout.propTypes = propTypes;
Layout.defaultProps = defaultProps;

export default Layout;