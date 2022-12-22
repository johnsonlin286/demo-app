import { Icon } from '@iconify/react';
import heartOutline from '@iconify/icons-ion/heart-outline';
import heartIcon from '@iconify/icons-ion/heart';
import PropTypes from 'prop-types';
import { useState } from 'react';

const propTypes = {
  onClick: PropTypes.func,
};

const defaultProps = {
  onClick: () => null,
};

const ButtonLike = ({ onClick }) => {
  const [liked, setLiked] = useState(false);

  const onLikeHandler = () => {
    setLiked(!liked);
    onClick();
  }

  return (
    <button onClick={onLikeHandler}>
      {
        liked ? <Icon icon={heartIcon} width="32" className="text-red-600" /> : <Icon icon={heartOutline} width="32" />
      }
    </button>
  );
};

ButtonLike.propTypes = propTypes;
ButtonLike.defaultProps = defaultProps;

export default ButtonLike;