import { useEffect, useState } from "react";
import axios from "axios";
import { API } from '../endpoints/api';
// import { PHOTOS, COMMENT } from '../endpoints/url';
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
      setData(photosData.photos.data);
      setTotalPost(photosData.photos.total);
      setFetchData(false);
    };
  }, [mountStat]);
  
  const fetchPhotos = async () => {
    try {
      setFetchData(true);
      const reqBody = {
        query: `
          query photos($isAuth: Boolean!, $skip: Float, $limit: Float) {
            photos(isAuth: $isAuth, skip: $skip, limit: $limit) {
              data {
                _id
                imageUrl
                user {
                  email
                }
              }
              total
            }
          }
        `,
        variables: {
          isAuth: user ? true : false,
          skip: data && data.length || 0,
          limit: 10
        }
      };
      const response = await API.post(process.env.API_URL, reqBody);
      const result = response.data.photos.data;
      if (result && result.length > 0) {
        setData(prev => [...prev, ...result]);
      }
      setFetchData(false);
    } catch (error) {
      setFetchData(false);
      console.log(error);
    }
  };
  
  /*
  const fetchPhotoDetail = async (photoId) => {
    setPhoto();
    setShowBottomSheet(true);
    try {
      setFetchPhoto(true);
      const reqBody = {
        query: `
          query photo($photoId: ID!){
            photo(photoId: $photoId) {
              _id
              imageUrl
              caption
              user {
                _id
                name
              }
              likes {
                _id
                user {
                  _id
                }
              }
              comments {
                _id
                message
                user {
                  _id
                  name
                }
                reply {
                  _id
                  message
                  user {
                    _id
                    name
                  }
                }
                likes {
                  _id
                }
              }
            }
          }
        `,
        variables: {
          photoId,
        }
      };
      const photo = await API.post(process.env.API_URL, reqBody);
      setPhoto(photo.data.photo);
      setComments(photo.data.photo.comments);
      // const photo = await API.get(PHOTOS + `/${photoId}`);
      // const comments = await API.get(COMMENT + `/${photoId}`);
      // setPhoto(photo.data.data);
      // setComments(comments.data.data);
      setFetchPhoto(false);
    } catch (error) {
      setFetchPhoto(false);
      console.log(error);
    }
  }
  */

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
                  <ThumbnailImg key={i} src={item.imageUrl} alt={item.caption} href={`/photo/${item._id}`}/>
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
        height="80"
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

export async function getServerSideProps (context) {
  try {
    const token = context.req.cookies.auth_token || null;
    const reqBody = {
      query: `
        query photos($isAuth: Boolean!, $skip: Float, $limit: Float) {
          photos(isAuth: $isAuth, skip: $skip, limit: $limit) {
            data {
              _id
              imageUrl
              user {
                email
              }
            }
            total
          }
        }
      `,
      variables: {
        isAuth: token ? true : false,
        skip: 0,
        limit: 20
      }
    }
    const response = await API.post(process.env.API_URL, reqBody, {
      headers: {
        Authorization: token ? `Bearer ${token}` : null
      }
    });
    return {
      props: {
        photosData: response.data
      }
    }
  } catch (error) {
    console.log(error);
    return {
      props: {}
      // redirect: {
      //     destination: '/505',
      //     statusCode: 307
      // }
    }
  }
}