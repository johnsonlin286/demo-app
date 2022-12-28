import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { API } from '../../endpoints/api';
import { PHOTOS } from "../../endpoints/url";
import Header from "../../components/header";
import { Icon } from '@iconify/react';
import loadingIcon from '@iconify/icons-mdi/loading';
import PhotoPreview from "../../components/photo-preview";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [data, setData] = useState();
  const [fetchData, setFetchData] = useState(true);

  useEffect(() => {
    const user = Cookies.get('user');
    if (!user) {
      router.push('/signin')
    } else setUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    if (user) fetchUserPhotos();
  }, [user]);

  const fetchUserPhotos = async (props) => {
    try {
      setFetchData(true);
      const response = await API.get(PHOTOS + `/user/${user._id}`);
      setData(response.data.data);
      setFetchData(false);
    } catch (error) {
      setFetchData(false);
      console.log(error);
    }
  };
  
  return (
    <div className="dashboard">
      <Header backBtn backRoute={'/'} fixed title="Dashboard"/>
      <div className={`${fetchData ? 'flex min-w-full min-h-screen  justify-center items-center ' : ''}pt-14 pb-20`}>
        {
          fetchData ? <><Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> fetching...</> : null
        }
        {
          data && data.length > 0 ? data.map((item, i) => (
            <div key={i}>
              <PhotoPreview data={data[i]}/>
              <hr className="my-4"/>
            </div>
          )) : null
        }
      </div>
    </div>
  );
};

export default Dashboard;