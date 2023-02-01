import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Avatar from './avatar';
import PropTypes from 'prop-types';
import ButtonLike from './button-like';

const propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    message: PropTypes.string,
    photo: PropTypes.string,
    user: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    likes: PropTypes.array,
    reply: PropTypes.array,
  }),
  onReply: PropTypes.func,
  likeToggle: PropTypes.func,
};

const defaultProps = {
  onReply: () => null,
  likeToggle: () => null,
};

const CommentItem = ({ data, onReply, likeToggle }) => {
  const [user, setUser] = useState();
  const [like, setLike] = useState(false);

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) setUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    if (data && user) {
      const likes = data.likes;
      const findUser = likes.find(like => like.user._id === user.id);
      if (findUser) {
        setLike(true);
      } else setLike(false);
    }
  }, [data, user]);

  return (
    <div className="comment-container flex items-center mb-3">
      <Avatar size="sm" shape="circle" border alt={data.user.name || 'No Name'}/>
      <p className="flex-1 px-3">
        <strong className="inline-block mr-2">{data.user.name || 'No Name'}</strong>
        {data.message || ''}
        <br/>
        <button className="font-medium text-xs text-sky-400 mt-3" onClick={onReply}>Reply</button>
      </p>
      <span className="flex flex-col items-center text-xs px-3">
        <ButtonLike size="sm" value={like} onClick={likeToggle}/>
        {data.likes && data.likes.length > 0 ? data.likes.length : null}
      </span>
    </div>
  );
};

CommentItem.propTypes = propTypes;
CommentItem.defaultProps = defaultProps;

export default CommentItem;