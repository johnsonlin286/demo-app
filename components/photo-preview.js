import { useEffect, useState } from 'react';
import { likePost, unlikePost } from '../services/like-post';
import { useRouter } from 'next/router';
import Avatar from './avatar';
import Cookies from 'js-cookie';
import ButtonLike from './button-like';
import { Icon } from '@iconify/react';
import trashBin from '@iconify/icons-ion/trash-bin';
import PropTypes from 'prop-types';

const propTypes = {
  data: PropTypes.object,
  canDelete: PropTypes.bool,
  deleteCallback: PropTypes.func,
};

const defaultProps = {
  canDelete: false,
  deleteCallback: () => null,
};

const PhotoPreview = ({ data, canDelete, deleteCallback }) => {
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
    if (data) setItemData(data);
    if (user) {
      const likes = [...itemData.likes];
      const isLiked = likes.filter(item => item.user === user._id);
      if (isLiked.length > 0) setLiked(true);
    }
    if (data && user) {
      const authorId = data.user;
      if (authorId === user._id) {
        console.log('is owner of the post');
      }
    }
  }, [data, user]);

  const onLikeHandler = async (status) => {
    if (!user) {
      router.push('/signin');
      return;
    }
    setLiked(status);
    if (!status) {
      const likesData = itemData.likes;
      const likeItem = likesData.find(data => data.user === user._id);
      const indexItem = likesData.indexOf(likeItem);
      if (likeItem) {
        setUpdateLike(true);
        await unlikePost(likeItem._id).then(() => {
          likesData.splice(indexItem, 1);
          setItemData(prev => (
            {
              ...prev,
              likes: [...likesData],
            }
          ));
          setUpdateLike(false);
        }).catch((error) => {
          console.log(error);
          setUpdateLike(false);
        });
      }
    } else {
      const likesData = itemData.likes;
      setUpdateLike(true);
      await likePost(itemData._id).then((response) => {
        const result = response.data.data;
        likesData.push({_id: result._id, user: result.user})
        setItemData(prev => (
          {
            ...prev,
            likes: [...likesData],
          }
        ));
        setUpdateLike(false);
      }).catch((error) => {
        console.log(error);
        setUpdateLike(false);
      });
    };
  }

  return (
    <>
      <div className="relative rounded-lg overflow-hidden">
        {
          itemData && itemData.user ? (
            <div className="absolute w-full flex items-center top-0 left-0 p-3 bg-gradient-to-r from-black">
              <Avatar size="sm" shape="circle" border alt={itemData.user.name}/>
              <p className="text-lg font-medium text-white ml-2">{itemData.user.name}</p>
            </div>
          ) : null
        }
        {
          itemData && <img src={itemData.imageUrl} alt={itemData.caption} className="w-full"/>
        }
      </div>
      <div className="flex w-full justify-between items-center pt-2">
        <div className="flex items-center">
          <ButtonLike value={liked} disabled={updateLike} onClick={onLikeHandler}/>
          {
            itemData && itemData.likes.length > 0 && <p className="font-medium text-sm ml-2">{`${itemData.likes.length} Like${itemData.likes.length > 1 ? 's' : ''}`}</p>
          }
        </div>
        {
          canDelete && (
            <button title="Delete post" onClick={() => deleteCallback(itemData._id)}>
              <Icon icon={trashBin} width="20" />
            </button>
          )
        }
      </div>
      <p className="pt-2 pl-2 italic">
        {itemData && itemData.caption}
      </p>
    </>
  );
};

PhotoPreview.propTypes = propTypes;
PhotoPreview.defaultProps = defaultProps;

export default PhotoPreview;