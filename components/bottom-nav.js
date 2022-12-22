import Button from './button';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import homeIcon from '@iconify/icons-ion/home';
import addCircle from '@iconify/icons-ion/add-circle';
import PropTypes from 'prop-types';

const propTypes = {};

const defaultProps = {};

const BottomNav = () => {
  return (
    <div className="fixed right-0 bottom-0 left-0">
      <nav className="md:w-7/12 lg:w-6/12 xl:w-5/12 flex justify-between items-center bg-white shadow-[0px_-1px_3px_0px_rgba(0,0,0,0.3)] rounded-t-md p-4 mx-auto">
        <div className="flex-1 flex justify-start items-center">
          <Link href={'/'} className="text-sky-300">
            <Icon icon={homeIcon} width="38"/>
          </Link>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Link href={'#'} className="inline-block text-sky-300">
            <Icon icon={addCircle} width="38"/>
          </Link>
        </div>
        <div className="flex-1 flex justify-end items-center">
          <Button size="sm" color="primary">
            Signin
          </Button>
        </div>
      </nav>
    </div>
  );
};

BottomNav.propTypes = propTypes;
BottomNav.defaultProps = defaultProps;

export default BottomNav;