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
  const [onRemove, setOnRemove] = useState(false);

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

  const showConfirmWindow = (photoId) => {
    let confirmWindow = window.confirm('Are you sure want to delete this post?');
    if (!confirmWindow) {
      return
    }
    deleteUserPhoto(photoId);
  }

  const deleteUserPhoto = async (photoId) => {
    setOnRemove(true);
    await API.delete(PHOTOS + `/${photoId}`)
      .then((response) => {
        const allPhoto = data;
        const photo = data.find(item => item._id === photoId);
        const indexPhoto = allPhoto.indexOf(photo);
        allPhoto.splice(indexPhoto, 1);
        setData([...allPhoto]);
        setOnRemove(false);
      })
      .catch((error) => {
        console.log(error);
        setOnRemove(false);
      });
  }
  
  return (
    <div className="dashboard">
      <Header backBtn backRoute={'/'} fixed title={user && user.name}/>
      <div className={`flex flex-col min-h-screen pb-20${!data || data.length <= 0 ? ' justify-between' : ''}`}>
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
            <div className="flex justify-center items-center pt-14">
              <Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> fetching...
            </div>
          ) : null
        }
        {
          data && data.length > 0 ? (
            <div className="px-5 md:px-0">
              {
                data.map((item, i) => (
                  <div className="border-b pb-4 mb-4" key={i}>
                    <PhotoPreview data={data[i]} canDelete deleteCallback={showConfirmWindow}/>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="flex flex-col justify-end items-center">
              <p>No post found! Start post your image here...</p>
              <Icon icon={arrowDownOutline} width="38" height="38"/>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Dashboard;