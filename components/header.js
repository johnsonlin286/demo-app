import { useContext } from 'react';
import { AppContext } from '../context';
import { useRouter } from 'next/router';

import { Icon } from '@iconify/react';
import arrowBack from '@iconify/icons-ion/arrow-back';
import PropTypes from 'prop-types';

const propTypes = {
  fixed: PropTypes.bool,
  backBtn: PropTypes.bool,
  backRoute: PropTypes.string,
  title: PropTypes.string,
};

const defaultProps = {
  fixed: false,
  backBtn: false,
  backRoute: '',
  title: '',
};

const Header = ({ fixed, backBtn, backRoute, title }) => {
  const router = useRouter();
  const context = useContext(AppContext);

  return (
    <div className={fixed ? 'fixed top-0 right-0 left-0 z-10' : ''}>
      <div className={`${fixed ? 'md:w-7/12 lg:w-6/12 xl:w-5/12' : ''} flex justify-between items-center bg-white shadow rounded-b-md py-3 px-4 mx-auto`}>
        <div className="flex">
          {backBtn && <button onClick={() => backRoute ? router.push(backRoute) : router.back()}><Icon icon={arrowBack} width={28} className="mr-2"/></button>}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <button className="text-sky-300 hover:underline order-last" onClick={() => context.setAbout(true)}>
          About
        </button>
      </div>
    </div>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;