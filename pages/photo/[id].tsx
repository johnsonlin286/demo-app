import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { API } from "../../endpoints/api";
import Cookies from "js-cookie";
import Header from "../../components/header";
import PhotoPreview from "../../components/photo-preview";
import { Icon } from "@iconify/react";
import loadingIcon from "@iconify/icons-mdi/loading";
import BottomSheet from "../../components/bottomsheet";
import Avatar from "../../components/avatar";
import CommentsSection from "../../components/comments-section";
import { PhotoType } from "../../utils/types";
import { fetchAllPosts, fetchPhoto } from "../../endpoints/posts";

type Props = {
  photoData: PhotoType
}

const Photo = ({ photoData }: Props) => {
  const router = useRouter();
  const [photoId, setPhotoId] = useState<string>();
  const [data, setData] = useState<Array<PhotoType>>([]);
  const [totalPost, setTotalPost] = useState(10);
  const [fetchingData, setFetchingData] = useState(true);
  const [pagination, setPagination] = useState(false);
  const [pickedPhotoId, setPickedPhotoId] = useState();
  const observerOptions = useMemo(() => {
    return {
      treshold: 1,
      rootMargin: '0px 0px 0px 0px'
    }
  }, []);


  useEffect(() => {
    if (photoData) {
      setData(() => [photoData]);
      setPhotoId(photoData._id);
      setPagination(true);
    }
    setFetchingData(false);
  }, [photoData, setData, setPhotoId, setPagination, setFetchingData]);

  const fetchPhotos = async () => {
    if (data.length >= totalPost) {
      setPagination(false);
      return;
    }
    setFetchingData(true);
    try {
      const result: any = await fetchAllPosts(photoId, (data.length - 1), 2);
      if (result.photos.data.length > 0) {
        setData((prev) => [...prev, ...result.photos.data.reverse()]);
      } else {
        setPagination(false);
      }
      if (totalPost !== result.photos.total) {
        setTotalPost(result.photos.total);
      }
      setFetchingData(false);
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
  }, [pagination, data, totalPost]);

  return (
    <div className="photo">
      <Header backBtn fixed title={"Explore"} />
      <div className="flex flex-col min-h-screen pt-14 pb-20">
        <div className="px-5 md:px-0">
          {data && data.length > 0
            ? data.map((item, i) => (
              <div className="border-b pb-4 mb-4" key={i}>
                <PhotoPreview
                  photo={item}
                  showComments
                  commentsCallback={() => null}
                />
              </div>
            ))
            : null}
          {fetchingData ? (
            <div className="flex justify-center items-center py-5">
              <Icon
                icon={loadingIcon}
                className="inline-block animate-spin text-lg align-text-top"
              />{" "}
              fetching...
            </div>
          ) : pagination && <div id="paginationElm" className="w-full h-1 bg-black" />}
        </div>
      </div>
      {/* <BottomSheet open={showComments} onDismiss={dismissBottomSheet}>
        {pickedPhotoData && commentsData && (
          <>
            <h3 className="text-xl font-medium mb-4">Comments</h3>
            <div className="flex items-center mb-4">
              <Avatar
                size="sm"
                shape="circle"
                border
                alt={pickedPhotoData.user.name}
              />
              <p className="flex flex-col px-3">
                <strong className="inline-block mr-2">
                  {pickedPhotoData.user.name}
                </strong>
                {pickedPhotoData.caption}
              </p>
            </div>
            <CommentsSection
              photoId={pickedPhotoId}
              comments={commentsData}
              total={totalComments}
              loadMoreCallback={fetchMoreComments}
            />
          </>
        )}
        {fetchingComments ? (
          <div className="flex min-w-full min-h-full justify-center items-center">
            <Icon
              icon={loadingIcon}
              className="inline-block animate-spin text-lg align-text-top"
            />{" "}
            fetching...
          </div>
        ) : null}
      </BottomSheet> */}
    </div>
  );
};

export default Photo;

export async function getStaticPaths() {
  const result: any = await fetchAllPosts();
  const data: PhotoType[] = result.photos.data;
  const paths = data.map((item: PhotoType) => {
    return {
      params: { id: item._id },
    };
  });
  return {
    paths: paths,
    fallback: true,
  };
}

export async function getStaticProps(context: { params: { id: any; }; }) {
  try {
    const { id } = context.params;
    const result: any = await fetchPhoto(id);
    return {
      props: {
        photoData: result.photo,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error
      }
    }
  }
}
