import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { API } from '../../endpoints/api';
import { PHOTOS, COMMENT } from "../../endpoints/url";
import Header from "../../components/header";
import PhotoPreview from "../../components/photo-preview";
import { Icon } from '@iconify/react';
import loadingIcon from '@iconify/icons-mdi/loading';
import arrowDownOutline from '@iconify/icons-ion/arrow-down-outline';
import Avatar from "../../components/avatar";
import Modal from "../../components/modal";
import Button from "../../components/button";
import BottomSheet from '../../components/bottomsheet';
import CommentsSection from "../../components/comments-section";

const Profile = ({ photosData }) => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [data, setData] = useState();
  const [totalPost, setTotalPost] = useState(0);
  const [fetchData, setFetchData] = useState(true);
  const [pickedPhotoId, setPickedPhotoId] = useState();
  const [pickedPhotoData, setPickedPhotoData] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [onRemove, setOnRemove] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsData, setCommentsData] = useState();
  const [fetchingComments, setFetchingComments] = useState(false);

  useEffect(() => {
    // const user = Cookies.get('user');
    // if (!user) {
    //   router.push('/signin')
    // } else setUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    if (photosData) {
      setData(photosData.data);
      setTotalPost(photosData.total);
      setFetchData(false);
    }
  }, [photosData]);

  const fetchUserPhotos = async () => {
    try {
      setFetchData(true);
      const response = await API.get(PHOTOS + `/user/${user._id}?offset=${data ? data.length : 0}`);
      if (data && data.length > 0) {
        setData(prev => [...prev, ...response.data.data]);
      } else setData(response.data.data);
      setTotalPost(response.data.total);
      setFetchData(false);
    } catch (error) {
      setFetchData(false);
      console.log(error);
    }
  };

  const showConfirmWindow = (photoId) => {
    setPickedPhotoId(photoId);
    setShowConfirm(true);
  }

  const hideConfirmWindow = () => {
    setShowConfirm(false);
  }

  const deleteUserPhoto = async () => {
    setOnRemove(true);
    await API.delete(PHOTOS + `/${pickedPhotoId}`)
      .then((response) => {
        const allPhoto = data;
        const photo = data.find(item => item._id === pickedPhotoId);
        const indexPhoto = allPhoto.indexOf(photo);
        allPhoto.splice(indexPhoto, 1);
        setData([...allPhoto]);
        setPickedPhotoId();
        setOnRemove(false);
        hideConfirmWindow();
      })
      .catch((error) => {
        console.log(error);
        setOnRemove(false);
        hideConfirmWindow();
      });
  }

  const dismissBottomSheet = () => {
    setPickedPhotoId();
    setShowComments(false);
  };

  const fetchComments = async (photoId) => {
    setShowComments(true);
    setPickedPhotoId(photoId);
    try {
      setFetchingComments(true);
      const photoData = await data.find(photo => photo._id === photoId);
      if (photoData) setPickedPhotoData(photoData);
      const response = await API.get(COMMENT + `/${photoId}`);
      setCommentsData(response.data);
      setFetchingComments(false);
    } catch (error) {
      console.log(error);
      setFetchingComments(false);
    }
  };

  const windowScroll = () => {
    let docOffsetheight = document.body.offsetHeight;
    if ((window.innerHeight + window.scrollY) >= docOffsetheight) {
      if (data && data.length < totalPost && !fetchData) fetchUserPhotos();
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', windowScroll);
    return () => document.removeEventListener('scroll', windowScroll);
  }, [windowScroll]);
  
  return (
    <div className="dashboard">
      <Header backBtn backRoute={'/'} fixed title={user && user.name}/>
      <div className={`flex flex-col min-h-screen pb-20${data && !data.length > 0 ? ' justify-between' : ''}`}>
        <div className="flex px-5 md:px-0 pt-16 pb-4">
          <Avatar shape="circle" size="lg" border alt={user && user.name}/>
          <div className="flex flex-col flex-1 justify-center items-center text-2xl">
            {totalPost}
            <p>{`Post${data && data.length > 1 ? 's' : ''}`}</p>
          </div>
          <div className="flex-1"/>
          <div className="flex-1"/>
        </div>
        {
          data && data.length > 0 ? (
            <div className="px-5 md:px-0">
              {
                data.map((item, i) => (
                  <div className="border-b pb-4 mb-4" key={i}>
                    <PhotoPreview
                      photo={item}
                      canEdit
                      canDelete
                      deleteCallback={showConfirmWindow}
                      showComments
                      commentsCallback={fetchComments}
                    />
                  </div>
                ))
              }
            </div>
          ) : !fetchData ? (
            <div className="flex flex-col justify-end items-center">
              <p>No post found! Start post your image here...</p>
              <Icon icon={arrowDownOutline} width="38" height="38"/>
            </div>
          ) : null
        }
        {
          fetchData ? (
            <div className="flex justify-center items-center py-5">
              <Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> fetching...
            </div>
          ) : null
        }
      </div>
      <BottomSheet open={showComments} onDismiss={dismissBottomSheet}>
        {
          fetchingComments ? (
            <div className="flex min-w-full min-h-full justify-center items-center">
              <Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> fetching...
            </div>
          ) : user && pickedPhotoData && commentsData ? (
            <>
              <h3 className="text-xl font-medium mb-4">Comments</h3>
              <div className="flex items-center mb-4">
                <Avatar size="sm" shape="circle" border alt={user.name}/>
                <p className="flex px-3">
                  <strong className="inline-block mr-2">{user.name}</strong>
                  {pickedPhotoData.caption}
                </p>
              </div>
              <CommentsSection photoId={pickedPhotoId} comments={commentsData} user={user}/>
            </>
          ) : null
        }
      </BottomSheet>
      <Modal show={showConfirm} size="sm" onDismiss={hideConfirmWindow}>
        <p className="mb-2">Are you sure want to delete this photo?</p>
        <div className="inline-block w-1/2 pr-1">
          <Button size="sm" outline block disabled={onRemove} loading={onRemove} onClick={deleteUserPhoto}>Yes</Button>
        </div>
        <div className="inline-block w-1/2 pl-1">
          <Button size="sm" block disabled={onRemove} onClick={hideConfirmWindow}>No</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;

export async function getServerSideProps (context) {
  try {
    const user = JSON.parse(context.req.cookies.user);
    if (!user) throw new Error('User not authorize!');
    const response = await API.get(PHOTOS + `/user/${user._id}?offset=0`);
    return {
      props: {
        photosData: response.data,
      }
    }
  } catch (error) {
    return {
      redirect: {
          destination: '/signin',
          statusCode: 307
      }
    }
  }
}