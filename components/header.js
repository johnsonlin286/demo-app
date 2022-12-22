import { Icon } from '@iconify/react';
import arrowBack from '@iconify/icons-ion/arrow-back';
import PropTypes from 'prop-types';
import Link from 'next/link';

const propTypes = {
  fixed: PropTypes.bool,
  backBtn: PropTypes.bool,
  title: PropTypes.string,
};

const defaultProps = {
  fixed: false,
  backBtn: false,
  title: '',
};

const Header = ({ fixed, backBtn, title }) => {
  return (
    <div className={fixed ? 'fixed top-0 right-0 left-0' : ''}>
      <div className={`${fixed ? 'md:w-7/12 lg:w-6/12 xl:w-5/12' : ''} flex justify-between items-center bg-white shadow rounded-b-md py-3 px-4 mx-auto`}>
        <div className="flex">
          {backBtn && <Icon icon={arrowBack} className="text-lg mr-2"/>}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <Link href={"#"} className="text-sky-300 hover:underline order-last">
          About
        </Link>
      </div>
    </div>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;