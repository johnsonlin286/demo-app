import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import Button from './button';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import homeIcon from '@iconify/icons-ion/home';
import addCircle from '@iconify/icons-ion/add-circle';
import personIcon from '@iconify/icons-ion/person';
import logOutSharp from '@iconify/icons-ion/log-out-sharp';
import Avatar from './avatar';
import Dropdown from './dropdown';

// import PropTypes from 'prop-types';

const propTypes = {};

const defaultProps = {};

const BottomNav = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) setUser(JSON.parse(user));
  }, []);

  return (
    <div className="fixed right-0 bottom-0 left-0 z-10">
      <nav className="md:w-7/12 lg:w-6/12 xl:w-4/12 flex justify-between items-center bg-white shadow-[0px_-1px_3px_0px_rgba(0,0,0,0.3)] rounded-t-md p-4 mx-auto">
        <div className="flex-1 flex justify-start items-center">
          <Link href={'/'} className="text-sky-400">
            <Icon icon={homeIcon} width="38"/>
          </Link>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Link href={user ? '/create-post' : '/signin'} className="inline-block text-sky-400">
            <Icon icon={addCircle} width="38"/>
          </Link>
        </div>
        <div className="flex-1 flex justify-end items-center">
          {
            user ? (
              <Dropdown
                top
                menu={[
                  {
                    label: 'Profile',
                    icon: personIcon,
                    link: `/profile/${user.id}`,
                    className: 'text-sky-400',
                  },
                  {
                    label: 'Sign Out',
                    icon: logOutSharp,
                    link: '/signout',
                    className: 'text-sky-400',
                  }
                ]}
              >
                <Avatar alt={user.name} shape="circle" border/>
              </Dropdown>
            ) : <Button type="link" route={"/signin"} size="sm" color="primary">Sign in</Button>
          }
        </div>
      </nav>
    </div>
  );
};

BottomNav.propTypes = propTypes;
BottomNav.defaultProps = defaultProps;

export default BottomNav;