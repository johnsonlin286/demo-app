import { useEffect, useMemo, useRef, useState } from 'react';
import { API } from '../endpoints/api';
// import { COMMENT, COMMENT_REPLY } from '../endpoints/url';
import CommentForm from './comment-form';
import CommentItem from './comment-item';
import { Icon } from '@iconify/react';
import closeOutline from '@iconify/icons-ion/close-outline';
import loadingIcon from '@iconify/icons-mdi/loading';
import PropTypes from 'prop-types';

const propTypes = {
  photoId: PropTypes.string,
  comments: PropTypes.arrayOf(PropTypes.object),
  total: PropTypes.number,
  user: PropTypes.object,
  loadMoreCallback: PropTypes.func,
  className: PropTypes.string,
};

const defaultProps = {
  loadMoreCallback: () => null,
};

const CommentsSection = ({ photoId, comments, total, user, loadMoreCallback, className }) => {
  const listElm = useRef(null);
  const [commentsData, setCommentsData] = useState();
  const [dataLength, setDataLength] = useState();
  const [userData, setUserData] = useState();
  const [postComment, setPostComment] = useState(false);
  const [replyData, setReplyData] = useState();
  const [showBottomElm, setShowBottomElm] = useState(true);
  const observerOptions = useMemo(() => {
    return {
      treshold: 1,
      rootMargin: '0px 0px 0px 0px'
    }
  }, []);
  
  
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
    const bottomElm = document.querySelector('#bottomElm');
    if (!bottomElm) return;
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          if (commentsData.length < total) {
            setShowBottomElm(true);
          }
        } else {
          setShowBottomElm(false);
        };
      })
    }, observerOptions);

    observer.observe(bottomElm);
    
    return () => observer.unobserve(bottomElm);
  }, [commentsData]);

  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  useEffect(() => {
    if (!showBottomElm) {
      loadMoreCallback();
    }
  }, [showBottomElm]);

  const replyHandler = (id, replyTo) => {
    setReplyData({
      thread_id: id,
      toUser: replyTo,
    });
  };

  const submitCommentForm = async (newComment) => {
    try {
      setPostComment(true);
      if (replyData) {
        await postReplyThread(newComment).then(() => {
          setReplyData();
        });
      } else {
        await postNewThread(newComment).then(() => {
          listElm.current.scroll({top: 0, behavior: 'smooth'});
        });
      }
      setPostComment(false);
    } catch (error) {
      console.log(error);
      setPostComment(false);
    }
  }

  const postNewThread = async (newComment) => {
    try {
      const reqBody = {
        query: `
          mutation postComment($threadId: ID!, $message: String!) {
            postComment(commentInput: {threadId: $threadId, message: $message}), {
              _id
              message
              user {
                _id
                name
              }
              reply {
                _id
              }
              likes {
                _id
              }
            }
          }
        `,
        variables: {
          threadId: photoId,
          message: newComment,
        }
      };
      const response = await API.post(process.env.API_URL, reqBody);
      const result = response.data.postComment;
      setCommentsData(prev => [
        ...prev,
        result,
      ])
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const postReplyThread = async (newComment) => {
    try {
      const reqBody = {
        query: `
          mutation postReply($threadId: ID!, $message: String!) {
            postReply(commentInput: {threadId: $threadId, message: $message}), {
              _id
              message
              user {
                _id
                name
              }
              likes {
                _id
              }
            }
          }
        `,
        variables: {
          threadId: replyData.thread_id,
          message: newComment,
        }
      };
      const response = await API.post(process.env.API_URL, reqBody);
      const result = response.data.postReply;
      const thread = await commentsData.find(thread => thread._id === replyData.thread_id);
      thread.reply.push(result);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const likeToggle = (status, itemId) => {
    if (status) {
      // like
      likeHandler(itemId);
    } else {
      // dislike
      dislikeHandler(itemId);
    }
  }

  const likeHandler = async (itemId) => {
    try {
      const cloneData = commentsData;
      let comment = await cloneData.find(comment => comment._id === itemId);
      let reply = false;
      if (!comment) {
        await cloneData.map(item => {
          comment = item.reply.find(reply => reply._id === itemId);
          reply = true;
        });
      }
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
          itemId: comment._id,
          type: 'comment',
        }
      };
      const response = await API.post(process.env.API_URL, reqBody);
      const result = response.data.like;
      comment.likes.push(result);
      cloneData.map(item => {
        if (!reply) {
          if (item._id === comment._id) {
            item = comment;
          }
        } else {
          item.reply.map(reply => {
            if (reply._id === comment._id) {
              reply = comment;
            }
          })
        }
      });
      setCommentsData([...cloneData]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const dislikeHandler = async (itemId) => {
    try {
      const cloneData = commentsData;
      let comment = await cloneData.find(comment => comment._id === itemId);
      let isReply = false;
      if (!comment) {
        await cloneData.map(item => {
          comment = item.reply.find(reply => reply._id === itemId);
          isReply = true;
        });
      }
      const userLike = await comment.likes.find(item => item.user._id === userData.id);
      const indexUserLike = await comment.likes.indexOf(userLike);
      const reqBody = {
        query: `
          mutation dislike($itemId: ID!, $type: String!) {
            dislike(likeInput: {itemId: $itemId, type: $type}), {
              _id
              user {
                _id
              }
            }
          }
        `,
        variables: {
          itemId: userLike._id,
          type: 'comment',
        }
      };
      setCommentsData([...cloneData]);
      await API.post(process.env.API_URL, reqBody).then(() => {
        comment.likes.splice(indexUserLike, 1);
        cloneData.map(item => {
          if (!isReply) {
            if (item._id === comment._id) {
              item = comment;
            }
          } else {
            item.reply.map(reply => {
              if (reply._id === comment._id) {
                reply = comment;
              }
            })
          }
        });
        setCommentsData([...cloneData]);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return (
    <div className={`flex flex-col justify-between min-h-full comments-section border-t pt-4${className ? ` ${className}` : ''}`}>
      <div id="comment-list" ref={listElm} className={`comments-list${commentsData && commentsData.length <= 0 ? ' flex h-[100px] justify-center items-center' : ' h-[200px]'} overflow-y-auto mb-4`}>
        {
          commentsData && commentsData.length > 0 ? commentsData.map((item, i) => (
            <span className="comment-item" key={i}>
              <CommentItem data={item} onReply={() => replyHandler(item._id, item.user.name)} likeToggle={(status) => likeToggle(status, item._id)}/>
              {
                item.reply && item.reply.length > 0 ? item.reply.map((reply, j) => (
                  <div className="comment-item reply pl-10" key={j}>
                    <CommentItem data={reply} onReply={() => replyHandler(item._id, reply.user.name)} likeToggle={(status) => likeToggle(status, reply._id)}/>
                  </div>
                )) : null
              }
            </span>
          )) : (
            <p className="font-medium text-xl">No comments yet...</p>
          )
        }
        {
          showBottomElm ? (
            <div id="bottomElm" className="flex min-w-full h-8 justify-center items-center">
              <Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> fetching...
            </div>
          ) : null
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