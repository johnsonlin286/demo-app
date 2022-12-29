import Avatar from './avatar';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ButtonLike from './button-like';
import PropTypes from 'prop-types';

const propTypes = {
  data: PropTypes.object,
};

const defaultProps = {};

const PhotoPreview = ({ data }) => {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) setUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    if (user) {
      const likes = [...data.likes];
      const isLiked = likes.filter(item => item.user === user._id);
      if (isLiked.length > 0) setLiked(true);
    }
  }, [data, user]);

  return (
    <>
      <div className="relative rounded-lg overflow-hidden">
        {
          data.user ? (
            <div className="absolute w-full flex items-center top-0 left-0 p-3 bg-gradient-to-r from-black">
              <Avatar size="sm" shape="circle" border alt={data.user.name}/>
              <p className="text-lg font-medium text-white ml-2">{data.user.name}</p>
            </div>
          ) : null
        }
        <img src={data.imageUrl} alt={data.caption} className="w-full"/>
      </div>
      {
        user && data ? (
          <div className="flex w-full items-center pt-2">
            <ButtonLike value={liked} onClick={() => console.log('like button toggle')}/>
            {
              data.likes.length > 0 && (
                <p className="font-medium text-sm ml-2">
                  {`Liked by ${liked ? 'you' : ''} ${liked && data.likes.length > 1 ? 'and' : ''} ${liked ? data.likes.length > 1 ? `${data.likes.length - 1} people` : '' : `${data.likes.length} people`}`}
                </p>
              )
            }
          </div>
        ) : null
      }
      <p className="pt-2 pl-2 italic">
        {data.caption}
      </p>
    </>
  );
};

PhotoPreview.propTypes = propTypes;
PhotoPreview.defaultProps = defaultProps;

export default PhotoPreview;