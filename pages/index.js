import { useEffect, useState } from "react";
import { API } from '../endpoints/api';
import { PHOTOS, COMMENT } from '../endpoints/url';
import Cookies from "js-cookie";
import Header from "../components/header";
import GalleryGrid from "../components/gallery-grid";
import ThumbnailImg from "../components/thumbnail-img";
import BottomSheet from "../components/bottomsheet";
import PhotoPreview from "../components/photo-preview";
import CommentsSection from "../components/comments-section";
import { Icon } from '@iconify/react';
import loadingIcon from '@iconify/icons-mdi/loading';
import arrowDownOutline from '@iconify/icons-ion/arrow-down-outline';

export default function Home({ photosData }) {
  const [mountStat, setMoutStat] = useState(false);
  const [user, setUser] = useState();
  const [data, setData] = useState();
  const [totalPost, setTotalPost] = useState(0);
  const [fetchData, setFetchData] = useState(true);
  const [photo, setPhoto] = useState();
  const [comments, setComments] = useState();
  const [fetchPhoto, setFetchPhoto] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) setUser(JSON.parse(user));
    setMoutStat(true);
  }, []);

  useEffect(() => {
    if (mountStat) {
      setData(photosData.data);
      setTotalPost(photosData.total);
      setFetchData(false);
    };
  }, [mountStat]);
  
  const fetchPhotos = async () => {
    try {
      setFetchData(true);
      const response = await API.get(PHOTOS + `?offset=${data ? data.length : 0}&limit=20`);
      if (data && data.length > 0) {
        setData((prev) => [...prev, ...response.data.data]);
      } else setData(response.data.data);
      setTotalPost(response.data.total);
      setFetchData(false);
    } catch (error) {
      setFetchData(false);
      console.log(error);
    }
  };
  
  const fetchPhotoDetail = async (photoId) => {
    setPhoto();
    setShowBottomSheet(true);
    try {
      setFetchPhoto(true);
      const photo = await API.get(PHOTOS + `/${photoId}`);
      const comments = await API.get(COMMENT + `/${photoId}`);
      setPhoto(photo.data.data);
      setComments(comments.data.data);
      setFetchPhoto(false);
    } catch (error) {
      setFetchPhoto(false);
      console.log(error);
    }
  }

  const windowScroll = () => {
    let docOffsetheight = document.body.offsetHeight;
    if ((window.innerHeight + window.scrollY) >= (docOffsetheight - 124)) {
      if (data && data.length < totalPost && !fetchData) fetchPhotos();
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', windowScroll);
    return () => document.removeEventListener('scroll', windowScroll);
  }, [windowScroll]);

  return (
    <div className="home">
      <Header fixed title={'Home'}/>
      <div className={`${!data && fetchData ? 'flex h-screen justify-center ' : data && !data.length > 0 ? 'flex h-screen justify-center items-end ' : ''}px-1 md:px-0 pt-14 pb-20`}>
        {
          data && data.length > 0 ? (
            <GalleryGrid>
              {
                data.map((item, i) => (
                  <ThumbnailImg key={i} src={item.imageUrl} alt={item.caption} onClick={() => fetchPhotoDetail(item._id)}/>
                ))
              }
            </GalleryGrid>
          ) : !fetchData ? (
            <div className="flex flex-col justify-center items-center">
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
      <BottomSheet
        open={showBottomSheet}
        height="auto"
        onDismiss={() => setShowBottomSheet(false)}
      >
        {
          fetchPhoto ? (
            <div className="flex min-w-full min-h-full justify-center items-center">
              <Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> fetching...
            </div>
          ) : photo ? (
            <>
              <PhotoPreview photo={photo} canEdit={user && photo.user._id === user._id ? true : false}/>
              <CommentsSection photoId={photo._id} comments={comments} user={user} className="mt-4"/>
            </>
          ) : null
        }
      </BottomSheet>
    </div>
  )
}

export async function getServerSideProps () {
  try {
    const response = await API.get(PHOTOS + `?offset=0&limit=20`);
    return {
      props: {
        photosData: response.data
      }
    }
  } catch (error) {
    return {
      redirect: {
          destination: '/505',
          statusCode: 307
      }
    }
  }
}