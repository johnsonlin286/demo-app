import { useEffect, useState } from 'react';
import InputField from './input-field';
import Button from './button';
import PropTypes from 'prop-types';

const propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  value: PropTypes.string,
  onReply: PropTypes.func,
  posting: PropTypes.bool,
};

const defaultProps = {
  value: '',
  onReply: () => null,
  posting: false,
};

const CommentForm = ({ user, value, onReply, posting }) => {
  const [comment, setComment] = useState('');
  const [errMsg, setErrMsg] = useState({});
  
  useEffect(() => {
    setComment(value)
  }, [value]);
  
  useEffect(() => {
    if (!posting) setComment('');
  }, [posting]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const err = {};
    if (!comment) {
      err.comment = 'required!';
    } else delete err.comment;
    setErrMsg(err);
    if (Object.keys(err).length > 0) {
      return;
    }
    onReply(comment);
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="flex justify-center">
        <InputField
          id="inputComment"
          placeholder={`Comment as ${user.name}...`}
          value={comment}
          disabled={posting}
          error={errMsg.comment ? ' ' : ''}
          className="flex-1 mr-2"
          focus={comment.length > 0 ? true : false}
          onChange={(val) => setComment(val)}
        />
        <Button size="sm" disabled={posting} loading={posting}>
          Reply
        </Button>
      </div>
      {
        errMsg.comment && <span className="block text-red-600 text-xs">{errMsg.comment}</span>
      }
    </form>
  );
};

CommentForm.propTypes = propTypes;
CommentForm.defaultProps = defaultProps;

export default CommentForm;