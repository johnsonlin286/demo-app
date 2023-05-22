import { useEffect, useMemo, useState } from "react";

import { fetchAllPosts } from "../endpoints/posts";
import Header from "../components/header";
import GalleryGrid from "../components/gallery-grid";
import ThumbnailImg from "../components/thumbnail-img";
import { Icon } from "@iconify/react";
import loadingIcon from "@iconify/icons-mdi/loading";
import arrowDownOutline from "@iconify/icons-ion/arrow-down-outline";
import { PhotosType, PhotoType } from '../utils/types';

type Props = {
  photosData?: PhotosType,
  error?: any
}

export default function Home({ photosData, error }: Props) {
  const [data, setData] = useState<Array<PhotoType>>([]);
  const [totalPost, setTotalPost] = useState(0);
  const [fetchingData, setFetchingData] = useState(true);
  const [pagination, setPagination] = useState(false);
  const observerOptions = useMemo(() => {
    return {
      treshold: 1,
      rootMargin: '0px 0px 0px 0px'
    }
  }, []);

  useEffect(() => {
    if (photosData) {
      setData(photosData.data);
      setTotalPost(photosData.total);
    } else {
      console.log(error);
    }
    setFetchingData(false);
  }, [photosData, error]);

  useEffect(() => {
    if (data && data.length < totalPost) {
      setPagination(true);
    }
  }, [data, totalPost]);

  const fetchPhotos = async () => {
    if (data?.length >= totalPost || fetchingData) {
      setPagination(false);
      return;
    }
    setFetchingData(true);
    try {
      const result: any = await fetchAllPosts(undefined, data?.length);
      setData((prev) => [...prev, ...result.data]);
    } catch (error) {
      console.log(error);
    }
    setFetchingData(false);
  };

  useEffect(() => {
    const paginationELm = document.getElementById('paginationElm');
    if (!pagination || !paginationELm) return;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fetchPhotos();
        }
      })
    }, observerOptions);

    observer.observe(paginationELm);

    return () => observer.unobserve(paginationELm);
  }, [pagination]);


  return (
    <div className="home">
      <Header fixed title={"Home"} />
      <div className={`flex flex-col justify-between ${data.length === 0 ? ' h-screen ' : ''} px-1 md:px-0 pt-14 pb-20`}>
        <GalleryGrid>
          {
            data.length > 0 && data.map(item => (
              <ThumbnailImg
                key={item._id}
                src={item.imageUrl}
                alt={item.caption}
                href={`/photo/${item._id}`}
              />
            ))
          }
        </GalleryGrid>
        {fetchingData ? (
          <div className="flex justify-center items-center py-5">
            <Icon
              icon={loadingIcon}
              className="inline-block animate-spin text-lg align-text-top"
            />{" "}
            fetching...
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col justify-center items-center">
            <p>No post found! Start post your image here...</p>
            <Icon icon={arrowDownOutline} width="38" height="38" />
          </div>
        ) : pagination && <div id="paginationElm" className="w-full h-1 bg-black" />}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: { req: { cookies: { auth_token: undefined; }; }; }) {
  try {
    const token = context.req.cookies.auth_token || undefined;
    const result: any = await fetchAllPosts(undefined, 0, token);
    return {
      props: {
        photosData: result.photos
      }
    }
  } catch (error) {
    return {
      props: {
        error: error
      }
    }
  }
}
