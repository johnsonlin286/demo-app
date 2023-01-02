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

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [data, setData] = useState();
  const [fetchData, setFetchData] = useState(true);
  const [pickedPhotoId, setPickedPhotoId] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [onRemove, setOnRemove] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsData, setCommentsData] = useState();
  const [fetchingComments, setFetchingComments] = useState(false);

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
      const response = await API.get(COMMENT + `/${photoId}`);
      console.log(response);
      setCommentsData(response.data.data);
      setFetchingComments(false);
    } catch (error) {
      console.log(error);
      setFetchingComments(false);
    }
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
          ) : (
            <div className="flex flex-col justify-end items-center">
              <p>No post found! Start post your image here...</p>
              <Icon icon={arrowDownOutline} width="38" height="38"/>
            </div>
          )
        }
      </div>
      <BottomSheet open={showComments} onDismiss={dismissBottomSheet}>
        {
          fetchingComments ? (
            <div className="flex min-w-full min-h-full justify-center items-center">
              <Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> fetching...
            </div>
          ) : user && commentsData ? (
            <div>
              <h3 className="text-lg font-medium mb-4">Comments:</h3>
              <div className="flex items-center mb-4">
                <Avatar size="sm" shape="circle" border alt={user.name}/>
                <p className="flex px-3">
                  <strong className="inline-block mr-2">{user.name}</strong>
                  {data && data.length > 0 ? data.find(photo => photo._id === pickedPhotoId) ? data.find(photo => photo._id === pickedPhotoId).caption : null : null}
                </p>
              </div>
              <CommentsSection photoId={pickedPhotoId} comments={commentsData} user={user}/>
            </div>
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