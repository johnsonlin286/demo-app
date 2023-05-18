import { useEffect, useState } from "react";
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

const Photo = ({ photoData }) => {
  const router = useRouter();
  const [photoId, setPhotoId] = useState();
  const [userData, setUserData] = useState();
  const [data, setData] = useState([]);
  const [totalPost, setTotalPost] = useState(0);
  const [fetchingPhotos, setFetchingPhotos] = useState(true);
  const [pickedPhotoId, setPickedPhotoId] = useState();
  const [pickedPhotoData, setPickedPhotoData] = useState();
  const [showComments, setShowComments] = useState(false);
  const [commentsData, setCommentsData] = useState();
  const [totalComments, setTotalComments] = useState(0);
  const [fetchingComments, setFetchingComments] = useState(false);

  useEffect(() => {
    const user = Cookies.get("user");
    if (user) setUserData(JSON.parse(user));
  }, []);

  useEffect(() => {
    if (photoData) {
      setPhotoId(photoData._id);
      setData([photoData]);
      setFetchingPhotos(false);
    }
  }, [photoData]);

  useEffect(() => {
    if (photoId) fetchPhotos();
  }, [photoId]);

  const fetchPhotos = async () => {
    try {
      setFetchingPhotos(true);
      const reqBody = {
        query: `
          query photos($exclude: ID, $skip: Float, $limit: Float) {
            photos(exclude: $exclude, skip: $skip, limit: $limit), {
              data {
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
              }
              total
            }
          }
        `,
        variables: {
          exclude: photoId,
          skip: data.length - 1,
          limit: 2,
        },
      };
      await API.post(process.env.API_URL, reqBody).then((response) => {
        const result = response.data.photos;
        if (result.data && result.data.length > 0) {
          setData((prev) => [...prev, ...result.data]);
        }
        setTotalPost(result.total + 1);
        setFetchingPhotos(false);
      });
    } catch (error) {
      setFetchingPhotos(false);
      console.log(error);
      throw error;
    }
  };

  const fetchComments = async (photoId) => {
    setShowComments(true);
    setPickedPhotoId(photoId);
    const photoData = data.find((photo) => photo._id === photoId);
    setPickedPhotoData(photoData);
    try {
      setFetchingComments(true);
      const reqBody = {
        query: `
          query comments($photoId: ID!, $skip: Float, $limit: Float) {
            comments(photoId: $photoId, skip: $skip, limit: $limit), {
              data {
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
                  likes {
                    _id
                    user {
                      _id
                    }
                  }
                }
                likes {
                  _id
                  user {
                    _id
                  }
                }
              }
              total
            }
          }
        `,
        variables: {
          photoId: photoId,
          skip: 0,
          limit: 4,
        },
      };
      const response = await API.post(process.env.API_URL, reqBody);
      const result = response.data.comments;
      setCommentsData(result.data);
      setTotalComments(result.total);
      setFetchingComments(false);
    } catch (error) {
      console.log(error);
      setFetchingComments(false);
    }
  };

  const fetchMoreComments = async () => {
    if (commentsData.length < totalComments) {
      try {
        const reqBody = {
          query: `
            query comments($photoId: ID!, $skip: Float, $limit: Float) {
              comments(photoId: $photoId, skip: $skip, limit: $limit), {
                data {
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
                    user {
                      _id
                    }
                  }
                }
                total
              }
            }
          `,
          variables: {
            photoId: pickedPhotoId,
            skip: commentsData.length,
            limit: 4,
          },
        };
        const response = await API.post(process.env.API_URL, reqBody);
        const result = response.data.comments;
        setCommentsData((prev) => [...prev, ...result.data]);
      } catch (error) {
        throw error;
      }
    }
  };

  const dismissBottomSheet = () => {
    // setPickedPhotoId();
    setShowComments(false);
    // setCommentsData();
    // setTotalComments(0);
  };

  const windowScroll = () => {
    let docOffsetheight = document.body.offsetHeight;
    if (window.innerHeight + window.scrollY >= docOffsetheight) {
      if (data && data.length < totalPost && !fetchingPhotos) fetchPhotos();
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", windowScroll);
    return () => document.removeEventListener("scroll", windowScroll);
  }, [windowScroll]);

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
                    commentsCallback={fetchComments}
                  />
                </div>
              ))
            : null}
          {fetchingPhotos ? (
            <div className="flex justify-center items-center py-5">
              <Icon
                icon={loadingIcon}
                className="inline-block animate-spin text-lg align-text-top"
              />{" "}
              fetching...
            </div>
          ) : null}
        </div>
      </div>
      <BottomSheet open={showComments} onDismiss={dismissBottomSheet}>
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
      </BottomSheet>
    </div>
  );
};

export default Photo;

export async function getStaticPaths() {
  const reqBody = {
    query: `
      query {
        photos, {
          data {
            _id
          }
        }
      }
    `,
  };
  const response = await API.post(process.env.API_URL, reqBody);
  const result = response.data.photos.data;
  const paths = result.map((item) => {
    return {
      params: { id: item._id },
    };
  });
  return {
    paths: paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const { id } = context.params;
  const reqBody = {
    query: `
      query photo($photoId: ID!) {
        photo(photoId: $photoId), {
          _id imageUrl caption
          user {
            _id name
          }
          likes {
            _id user {
              _id
            }
          }
        }
      }
    `,
    variables: {
      photoId: id,
    },
  };
  const response = await API.post(process.env.API_URL, reqBody);
  const result = response.data.photo;
  return {
    props: {
      photoData: result,
    },
  };
}
