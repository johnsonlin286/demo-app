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
    reply: PropTypes.array,
  }),
  onReply: PropTypes.func,
};

const defaultProps = {
  onReply: () => null,
};

const CommentItem = ({ data, onReply }) => {
  return (
    <div className="comment-container flex items-center mb-3">
      <Avatar size="sm" shape="circle" border alt={data.user.name || 'No Name'}/>
      <p className="flex-1 px-3">
        <strong className="inline-block mr-2">{data.user.name || 'No Name'}</strong>
        {data.message || ''}
        <br/>
        <a role="button" className="font-medium text-xs text-sky-400 mt-3" onClick={(e) => { e.preventDefault(); onReply(); }}>Reply</a>
      </p>
      <span className="flex flex-col items-center">
        <ButtonLike/>
        {`999`}
      </span>
    </div>
  );
};

CommentItem.propTypes = propTypes;
CommentItem.defaultProps = defaultProps;

export default CommentItem;