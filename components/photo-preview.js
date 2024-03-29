import { useEffect, useState } from 'react';
// import { likePost, unlikePost } from '../services/like-post';
import { API } from '../endpoints/api';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import ButtonLike from './button-like';
import Dropdown from './dropdown';
import Image from './image';
import { Icon } from '@iconify/react';
import trashBin from '@iconify/icons-ion/trash-bin';
import ellipsisVertical from '@iconify/icons-ion/ellipsis-vertical';
import pencilIcon from '@iconify/icons-ion/pencil';
import chatbubblesOutline from '@iconify/icons-ion/chatbubbles-outline';
import PropTypes from 'prop-types';

const propTypes = {
  photo: PropTypes.object,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  deleteCallback: PropTypes.func,
  showComments: PropTypes.bool,
  commentsCallback: PropTypes.func,
};

const defaultProps = {
  canEdit: false,
  canDelete: false,
  deleteCallback: () => null,
  showComments: false,
  commentsCallback: () => null,
};

const PhotoPreview = ({ photo, canEdit, canDelete, deleteCallback, showComments, commentsCallback }) => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [itemData, setItemData] = useState();
  const [liked, setLiked] = useState(false);
  const [updateLike, setUpdateLike] = useState(false);

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) setUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    if (photo) setItemData(photo);
    if (user) {
      const likes = [...itemData.likes];
      const isLiked = likes.filter(item => item.user._id === user.id);
      if (isLiked.length > 0) setLiked(true);
    }
  }, [photo, user]);

  const likeToggle = (status) => {
    if (!user) {
      router.push('/signin');
      return;
    }
    setLiked(status);
    if (status) {
      // like
      likeHandler();
    } else {
      // dislike
      dislikeHandler();
    };
  }

  const likeHandler = async () => {
    try {
      setUpdateLike(true);
      const reqBody = {
        query: `
          mutation like($itemId: ID!, $type: String!) {
            like(likeInput: {itemId: $itemId, type: $type}), {
              _id
              user {
                _id
              }
            }
          }
        `,
        variables: {
          itemId: itemData._id,
          type: 'photo'
        }
      };
      const response = await API.post(process.env.API_URL, reqBody);
      const result = response.data.like;
      const likes = itemData.likes;
      likes.push(result);
      setItemData(prev => (
        {
          ...prev,
          likes: [...likes],
        }
      ));
      setUpdateLike(false);
    } catch (error) {
      console.log(error);
      setUpdateLike(false);
    }
  }

  const dislikeHandler = async () => {
    try {
      setUpdateLike(true);
      const likes = itemData.likes;
      const userLike = await likes.find(like => like.user._id === user.id);
      const indexUserLike = likes.indexOf(userLike);
      const reqBody = {
        query: `
          mutation dislike($itemId: ID!, $type: String!) {
            dislike(likeInput: {itemId: $itemId, type: $type}), {
              _id
            }
          }
        `,
        variables: {
          itemId: userLike._id,
          type: 'photo'
        }
      };
      await API.post(process.env.API_URL, reqBody).then(() => {
        likes.splice(indexUserLike, 1);
        setItemData(prev => (
          {
            ...prev,
            likes: [...likes],
          }
        ));
        setUpdateLike(false);
      });
    } catch (error) {
      console.log(error);
      setUpdateLike(false);
    }
  }

  return (
    <>
      <div className="relative rounded-lg overflow-hidden">
        {
          itemData && <Image src={itemData.imageUrl} alt={itemData.caption} wrapperClassName="rounded-lg overflow-hidden"/>
        }
      </div>
      <div className="flex w-full justify-between items-center pt-2">
        <div className="flex items-center">
          <ButtonLike value={liked} disabled={updateLike} onClick={likeToggle}/>
          {
            itemData && showComments && (
              <button className="ml-4" onClick={() => commentsCallback(itemData._id)}>
                <Icon icon={chatbubblesOutline} width="30" />
              </button>
            )
          }
        </div>
        {
          itemData && user ? canEdit && canDelete ? (
            <Dropdown
              top
              menu={[
                {
                  label: 'Edit',
                  icon: pencilIcon,
                  link: `/edit-post?id=${itemData._id}`,
                  className: ' text-sky-400'
                },
                {
                  label: 'Delete',
                  icon: trashBin,
                  onClick: () => deleteCallback(itemData._id),
                  className: ' text-red-600'
                }
              ]}
            >
              <span className="inline-block px-3">
                <Icon icon={ellipsisVertical} width="20"/>
              </span>
            </Dropdown>
          ) : canEdit ? (
            <Link href={`/edit-post?id=${itemData ? itemData._id : ''}`} title="Edit post" className="px-3">
              <Icon icon={pencilIcon} width="20"/>
            </Link>
          ) : canDelete ? (
            <button title="Delete post" className="px-3" onClick={() => deleteCallback(itemData._id)}>
              <Icon icon={trashBin} width="20"/>
            </button>
          ) : null : null
        }
      </div>
      {
        itemData && itemData.likes.length > 0 && <p className="pl-2">{`${itemData.likes.length} Like${itemData.likes.length > 1 ? 's' : ''}`}</p>
      }
      <p className="mt-3 pl-2 italic">
        {
          itemData && (
            <>
              {
                itemData.user && (
                  <Link href={`/profile/${itemData.user._id}`} className="inline-block font-semibold mr-2">
                    {itemData.user.name}
                  </Link>
                )
              }
              {itemData.caption}
            </>
          )
        }
      </p>
    </>
  );
};

PhotoPreview.propTypes = propTypes;
PhotoPreview.defaultProps = defaultProps;

export default PhotoPreview;