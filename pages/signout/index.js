import { Icon } from '@iconify/react';
import loadingIcon from '@iconify/icons-mdi/loading';

import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const signout = () => {
  const router = useRouter();

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      Cookies.remove('user');
      Cookies.remove('auth_token');
    };
    router.push('/');
  }, []);

  return (
    <div className="flex h-screen justify-center items-center">
      <Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> Signing Out...
    </div>
  );
};

export default signout;