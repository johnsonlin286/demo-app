import { useEffect, useRef, useState } from 'react';
import { API } from '../endpoints/api';
import { COMMENT, COMMENT_REPLY } from '../endpoints/url';
import CommentForm from './comment-form';
import CommentItem from './comment-item';
import { Icon } from '@iconify/react';
import closeOutline from '@iconify/icons-ion/close-outline';
import PropTypes from 'prop-types';

const propTypes = {
  photoId: PropTypes.string,
  comments: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
  className: PropTypes.string,
};

const defaultProps = {};

const CommentsSection = ({ photoId, comments, user, className }) => {
  const listElm = useRef(null);
  const [commentsData, setCommentsData] = useState();
  const [dataLength, setDataLength] = useState();
  const [userData, setUserData] = useState();
  const [postComment, setPostComment] = useState(false);
  const [replyData, setReplyData] = useState();
  
  useEffect(() => {
    if (comments) {
      setCommentsData(comments);
      setDataLength(comments.length);
    };
  }, [comments]);

  useEffect(() => {
    if (commentsData && commentsData.length > dataLength) {
      listElm.current.scroll({top: listElm.current.scrollHeight, behavior: 'smooth'});
      setDataLength(commentsData.length);
    }
  }, [commentsData]);

  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  const replyHandler = (id, replyTo) => {
    setReplyData({
      thread_id: id,
      toUser: replyTo,
    });
  };

  const submitCommentForm = async (newComment) => {
    try {
      setPostComment(true);
      let response;
      if (replyData) {
        response = await API.post(COMMENT_REPLY, { message: newComment, thread_id: replyData.thread_id });
        const newReply = {
          _id: response.data.data._id,
          message: response.data.data.message,
          user: {
            _id: userData._id,
            name: userData.name,
          },
        };
        const thread = commentsData.find(thread => thread._id === replyData.thread_id);
        thread.reply.push(newReply);
        setReplyData();
      } else {
        response = await API.post(COMMENT, { message: newComment, photo_id: photoId });
        setCommentsData(prev => [
          ...prev,
          response.data.data,
        ]);
        listElm.current.scroll({top: 0, behavior: 'smooth'});
      }
      setPostComment(false);
    } catch (error) {
      console.log(error);
      setPostComment(false);
    }
  }

  return (
    <div className={`flex flex-col justify-between min-h-full comments-section border-t pt-4${className ? ` ${className}` : ''}`}>
      <div id="comment-list" ref={listElm} className={`comments-list${commentsData && commentsData.length <= 0 ? ' flex h-[100px] justify-center items-center' : ' h-[200px]'} overflow-y-auto mb-4`}>
        {
          commentsData && commentsData.length > 0 ? commentsData.map((item, i) => (
            <span className="comment-item" key={i}>
              <CommentItem data={item} onReply={() => replyHandler(item._id, item.user.name)}/>
              {
                item.reply && item.reply.length > 0 ? item.reply.map((reply, j) => (
                  <div className="comment-item reply pl-10" key={j}>
                    <CommentItem data={reply} onReply={() => replyHandler(item._id, reply.user.name)}/>
                  </div>
                )) : null
              }
            </span>
          )) : (
            <p className="font-medium text-xl">No comments yet...</p>
          )
        }
      </div>
      <div className="flex h-12 justify-between items-center py-3">
        {
          replyData && (
            <>
              <span>Replying to {replyData.toUser}</span>
              <button className="px-2" onClick={() => setReplyData()}>
                <Icon icon={closeOutline} width="20"/>
              </button>
            </>
          )
        }
      </div>
      {
        userData && <CommentForm user={userData} value={replyData ? `@${replyData.toUser} ` : ''} onReply={submitCommentForm} posting={postComment}/>
      }
    </div>
  );
};

CommentsSection.propTypes = propTypes;
CommentsSection.defaultProps = defaultProps;

export default CommentsSection;