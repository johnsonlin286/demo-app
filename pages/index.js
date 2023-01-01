import { useEffect, useState } from "react";
import { API } from '../endpoints/api';
import { PHOTOS } from '../endpoints/url';
import Header from "../components/header";
import GalleryGrid from "../components/gallery-grid";
import ThumbnailImg from "../components/thumbnail-img";
import BottomSheet from "../components/bottomsheet";
import PhotoPreview from "../components/photo-preview";
import { Icon } from '@iconify/react';
import loadingIcon from '@iconify/icons-mdi/loading';
import arrowDownOutline from '@iconify/icons-ion/arrow-down-outline';

export default function Home() {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [data, setData] = useState();
  const [fetchData, setFetchData] = useState(true);
  const [photo, setPhoto] = useState();
  const [fetchPhoto, setFetchPhoto] = useState(false);

  useEffect(() => {
    if (!data) fetchPhotos();
  }, [data]);

  const fetchPhotos = async () => {
    try {
      setFetchData(true);
      const response = await API.get(PHOTOS);
      if (response.data.data) {
        setData(response.data.data);
      }
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
      const response = await API.get(PHOTOS + `/${photoId}`);
      setPhoto(response.data.data);
      setFetchPhoto(false);
    } catch (error) {
      setFetchPhoto(false);
      console.log(error);
    }
  }

  return (
    <div className="home">
      <Header fixed title={'Home'}/>
      {
        fetchData ? (
          <div className="flex min-w-full min-h-screen justify-center items-center pt-14 pb-20">
            <Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> fetching...
          </div>
        ) : null
      }
      {
        data && data.length > 0 ? (
          <div className="px-1 md:px-0 pt-14 pb-20">
            <GalleryGrid>
              {
                data.map((item, i) => (
                  <ThumbnailImg key={i} src={item.imageUrl} alt={item.caption} onClick={() => fetchPhotoDetail(item._id)}/>
                ))
              }
            </GalleryGrid>
          </div>
        ) : (
          <div className="flex flex-col min-w-full min-h-screen justify-end items-center pt-14 pb-20">
            <p>No post found! Start post your image here...</p>
            <Icon icon={arrowDownOutline} width="38" height="38"/>
          </div>
        )
      }
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
            <PhotoPreview data={photo}/>
          ) : null
        }
      </BottomSheet>
    </div>
  )
}
