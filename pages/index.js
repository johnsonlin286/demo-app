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

export default function Home() {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [data, setData] = useState();
  const [fetchData, setFetchData] = useState(true);
  const [photo, setPhoto] = useState();
  const [fetchPhoto, setFetchPhoto] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setFetchData(true);
      const response = await API.get(PHOTOS);
      setData(response.data.data);
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
      <div className={`${fetchData ? 'flex min-w-full min-h-screen  justify-center items-center ' : ''}pt-14 pb-20`}>
        {
          fetchData ? <><Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> fetching...</> : null
        }
        <GalleryGrid>
          {
            data && data.length > 0 ? data.map((item, i) => (
              <ThumbnailImg key={i} src={item.imageUrl} alt={item.caption} onClick={() => fetchPhotoDetail(item._id)}/>
            )) : null
          }
        </GalleryGrid>
      </div>
      <BottomSheet
        open={showBottomSheet}
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
