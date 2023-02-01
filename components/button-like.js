import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import heartOutline from '@iconify/icons-ion/heart-outline';
import heartIcon from '@iconify/icons-ion/heart';
import loadingIcon from '@iconify/icons-mdi/loading';
import PropTypes from 'prop-types';

const propTypes = {
  size: PropTypes.oneOf(['sm', 'default']),
  value: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

const defaultProps = {
  size: 'default',
  value: false,
  disabled: false,
  onClick: () => null,
};

const ButtonLike = ({ size, value, disabled, onClick }) => {
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
        liked ? <Icon icon={heartIcon} width={size === 'default' ? '32' : '24'} className={`text-red-600${disabled ? ' opacity-20': ''}`} /> : <Icon icon={heartOutline} width={size === 'default' ? '32' : '24'} className={disabled ? 'opacity-20' : ''} />
      }
    </button>
  );
};

ButtonLike.propTypes = propTypes;
ButtonLike.defaultProps = defaultProps;

export default ButtonLike;