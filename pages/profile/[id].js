import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import Cookies from "js-cookie";
import { API } from "../../endpoints/api";
// import { PHOTOS, COMMENT } from "../../endpoints/url";
import Header from "../../components/header";
import PhotoPreview from "../../components/photo-preview";
import { Icon } from "@iconify/react";
import loadingIcon from "@iconify/icons-mdi/loading";
import arrowDownOutline from "@iconify/icons-ion/arrow-down-outline";
import Avatar from "../../components/avatar";
import Modal from "../../components/modal";
import Button from "../../components/button";
import BottomSheet from "../../components/bottomsheet";
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
  const [totalComments, setTotalComments] = useState(0);
  const [fetchingComments, setFetchingComments] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [router]);

  useEffect(() => {
    if (photosData) {
      setData(photosData.userPhotos.data);
      setTotalPost(photosData.userPhotos.total);
      setFetchData(false);
    }
  }, [photosData]);

  const fetchUserData = async () => {
    const reqBody = {
      query: `
        query profile($userId: ID!){
          profile(userId: $userId), {
            _id
            name
            email
          }
        }
      `,
      variables: {
        userId: router.query.id,
      },
    };
    const response = await API.post(process.env.API_URL, reqBody);
    const result = response.data.profile;
    setUser({ id: result._id, name: result.name, email: result.email });
  };

  const fetchUserPhotos = async () => {
    try {
      setFetchData(true);
      const reqBody = {
        query: `
          query userPhotos($userId: ID!, $skip: Float, $limit: Float) {
            userPhotos(userId: $userId, skip: $skip, limit: $limit) {
              data {
                _id
                imageUrl
                caption
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
          userId: user.id,
          skip: (data && data.length) || 0,
          limit: 2,
        },
      };
      const response = await API.post(process.env.API_URL, reqBody);
      const result = response.data.userPhotos;
      if (result.data && result.data.length > 0) {
        setData((prev) => [...prev, ...result.data]);
      }
      setFetchData(false);
    } catch (error) {
      setFetchData(false);
      console.log(error);
    }
  };

  const showConfirmWindow = (photoId) => {
    setPickedPhotoId(photoId);
    setShowConfirm(true);
  };

  const hideConfirmWindow = () => {
    setShowConfirm(false);
  };

  const deleteUserPhoto = async () => {
    try {
      setOnRemove(true);
      const allPhoto = data;
      const photo = data.find((item) => item._id === pickedPhotoId);
      const indexPhoto = allPhoto.indexOf(photo);
      const reqBody = {
        query: `
          mutation deletePost($photoId: ID!){
            deletePost(photoId: $photoId), {
              _id
              imageUrl
              caption
            }
          }
        `,
        variables: {
          photoId: pickedPhotoId,
        },
      };
      const response = await API.post(process.env.API_URL, reqBody);
      console.log(response);
      allPhoto.splice(indexPhoto, 1);
      setData([...allPhoto]);
      setOnRemove(false);
      hideConfirmWindow();
    } catch (error) {
      console.log(error);
      setOnRemove(false);
      hideConfirmWindow();
    }
  };

  const dismissBottomSheet = () => {
    setPickedPhotoId();
    setShowComments(false);
    setCommentsData();
    setTotalComments(0);
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

  const windowScroll = () => {
    let docOffsetheight = document.body.offsetHeight;
    if (window.innerHeight + window.scrollY >= docOffsetheight) {
      if (data && data.length < totalPost && !fetchData) fetchUserPhotos();
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", windowScroll);
    return () => document.removeEventListener("scroll", windowScroll);
  }, [windowScroll]);

  return (
    <div className="dashboard">
      <Header backBtn fixed title={user && user.name} />
      <div
        className={`flex flex-col min-h-screen pb-20${
          data && !data.length > 0 ? " justify-between" : ""
        }`}
      >
        <div className="flex px-5 md:px-0 pt-16 pb-4">
          <Avatar shape="circle" size="lg" border alt={user && user.name} />
          <div className="flex flex-col flex-1 justify-center items-center text-2xl">
            {totalPost}
            <p>{`Post${data && data.length > 1 ? "s" : ""}`}</p>
          </div>
          <div className="flex-1" />
          <div className="flex-1" />
        </div>
        {data && data.length > 0 ? (
          <div className="px-5 md:px-0">
            {data.map((item, i) => (
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
            ))}
          </div>
        ) : !fetchData ? (
          <div className="flex flex-col justify-end items-center">
            <p>No post found! Start post your image here...</p>
            <Icon icon={arrowDownOutline} width="38" height="38" />
          </div>
        ) : null}
        {fetchData ? (
          <div className="flex justify-center items-center py-5">
            <Icon
              icon={loadingIcon}
              className="inline-block animate-spin text-lg align-text-top"
            />{" "}
            fetching...
          </div>
        ) : null}
      </div>
      <BottomSheet open={showComments} onDismiss={dismissBottomSheet}>
        {user && pickedPhotoData && commentsData && (
          <>
            <h3 className="text-xl font-medium mb-4">Comments</h3>
            <div className="flex items-center mb-4">
              <Avatar size="sm" shape="circle" border alt={user.name} />
              <p className="flex flex-col px-3">
                <strong className="inline-block mr-2">{user.name}</strong>
                {pickedPhotoData.caption}
              </p>
            </div>
            <CommentsSection
              photoId={pickedPhotoId}
              comments={commentsData}
              total={totalComments}
              // user={user}
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
      <Modal show={showConfirm} size="sm" onDismiss={hideConfirmWindow}>
        <p className="mb-2">Are you sure want to delete this photo?</p>
        <div className="inline-block w-1/2 pr-1">
          <Button
            size="sm"
            outline
            block
            disabled={onRemove}
            loading={onRemove}
            onClick={deleteUserPhoto}
          >
            Yes
          </Button>
        </div>
        <div className="inline-block w-1/2 pl-1">
          <Button
            size="sm"
            block
            disabled={onRemove}
            onClick={hideConfirmWindow}
          >
            No
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;

export async function getServerSideProps(context) {
  try {
    const reqBody = {
      query: `
        query userPhotos($userId: ID!, $skip: Float, $limit: Float) {
          userPhotos(userId: $userId, skip: $skip, limit: $limit) {
            data {
              _id
              imageUrl
              caption
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
        userId: context.params.id,
        skip: 0,
        limit: 2,
      },
    };
    const response = await API.post(process.env.API_URL, reqBody);
    return {
      props: {
        photosData: response.data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        statusCode: 307,
      },
    };
  }
}
