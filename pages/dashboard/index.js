import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { API } from '../../endpoints/api';
import { PHOTOS } from "../../endpoints/url";
import Header from "../../components/header";
import PhotoPreview from "../../components/photo-preview";
import { Icon } from '@iconify/react';
import loadingIcon from '@iconify/icons-mdi/loading';
import arrowDownOutline from '@iconify/icons-ion/arrow-down-outline';
import Avatar from "../../components/avatar";

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

  const fetchUserPhotos = async () => {
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
      <Header backBtn backRoute={'/'} fixed title={user && user.name}/>
      <div className="flex px-5 md:px-0 pt-16 pb-4">
        <Avatar shape="circle" size="lg" border alt={user && user.name}/>
        <div className="flex flex-col flex-1 justify-center items-center text-2xl">
          {data && data.length || 0}
          <p>{`Post${data && data.length > 1 ? 's' : ''}`}</p>
        </div>
        <div className="flex-1"/>
        <div className="flex-1"/>
      </div>
      {
        fetchData ? (
          <div className="flex min-w-full min-h-screen justify-center items-center pt-14 pb-20">
            <Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> fetching...
          </div>
        ) : null
      }
      {
        data && data.length > 0 ? (
          <div className="px-5 md:px-0 pb-20">
            {
              data.map((item, i) => (
                <div key={i}>
                  <PhotoPreview data={data[i]}/>
                  <hr className="my-4"/>
                </div>
              ))
            }
          </div>
        ) : (
          <div className="flex flex-col min-w-full min-h-screen justify-end items-center pt-14 pb-20">
            <p>No post found! Start post your image here...</p>
            <Icon icon={arrowDownOutline} width="38" height="38"/>
          </div>
        )
      }
    </div>
  );
};

export default Dashboard;