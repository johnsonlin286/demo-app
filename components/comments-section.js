import { useEffect, useState } from 'react';
import { API } from '../endpoints/api';
import { COMMENT } from '../endpoints/url';
import CommentForm from './comment-form';
import CommentItem from './comment-item';
import PropTypes from 'prop-types';

const propTypes = {
  photoId: PropTypes.string,
  comments: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
};

const defaultProps = {};

const CommentsSection = ({ photoId, comments, user }) => {
  const [commentsData, setCommentsData] = useState();
  const [userData, setUserData] = useState();
  const [postComment, setPostComment] = useState(false);

  useEffect(() => {
    if (comments) setCommentsData(comments);
  }, [comments]);

  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  const submitCommentForm = async (newComment) => {
    try {
      setPostComment(true);
      const response = await API.post(COMMENT, { message: newComment, photo_id: photoId });
      setCommentsData(prev => [
        ...prev,
        response.data.data,
      ]);
      setPostComment(false);
    } catch (error) {
      console.log(error);
      setPostComment(false);
    }
  }

  return (
    <div className="comments-section border-t pt-4 mt-4">
      <div className={`comments-list${commentsData && commentsData.length <= 0 ? ' flex h-[100] justify-center items-center' : ' h-[200px]'} overflow-y-auto mb-4`}>
        {
          commentsData && commentsData.length > 0 ? commentsData.map((item, i) => (
            <CommentItem data={item} key={i}/>
          )) : (
            <p className="font-medium text-xl">No comments yet...</p>
          )
        }
      </div>
      {
        userData && <CommentForm user={userData} onReply={submitCommentForm} posting={postComment}/>
      }
    </div>
  );
};

CommentsSection.propTypes = propTypes;
CommentsSection.defaultProps = defaultProps;

export default CommentsSection;