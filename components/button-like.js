import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import heartOutline from '@iconify/icons-ion/heart-outline';
import heartIcon from '@iconify/icons-ion/heart';
import loadingIcon from '@iconify/icons-mdi/loading';
import PropTypes from 'prop-types';

const propTypes = {
  value: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

const defaultProps = {
  value: false,
  disabled: false,
  onClick: () => null,
};

const ButtonLike = ({ value, disabled, onClick }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(value);
  }, [value]);

  const onLikeHandler = () => {
    setLiked(!liked);
    onClick(!liked);
  }

  return (
    <button onClick={onLikeHandler} disabled={disabled} className="flex justify-center items-center">
      {
        disabled && <Icon icon={loadingIcon} width="18" className="absolute inline-block animate-spin text-gray-300 align-text-top"/>
      }
      {
        liked ? <Icon icon={heartIcon} width="32" className={`text-red-600${disabled ? ' opacity-20': ''}`} /> : <Icon icon={heartOutline} width="32" className={disabled ? 'opacity-20' : ''} />
      }
    </button>
  );
};

ButtonLike.propTypes = propTypes;
ButtonLike.defaultProps = defaultProps;

export default ButtonLike;