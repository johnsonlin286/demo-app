import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  shape: PropTypes.oneOf(['default', 'circle']),
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  border: PropTypes.bool,
  src: PropTypes.string,
  alt: PropTypes.string,
};

const defaultProps = {
  shape: 'default',
  size: 'default',
  border: false,
};

const Avatar = ({ shape, size, border, src, alt, }) => {
  const [initialName, setInitialName] = useState('');

  useEffect(() => {
    if (alt) {
      const arr = alt.split(' ');
      const firstName = arr[0];
      let lastName = '';
      if (arr.length > 1) {
        lastName = arr[1];
      }
      setInitialName(`${firstName.split('')[0]}${lastName ? `${lastName.split('')[0]}` : ''}`);
    }
  }, [alt]);

  return (
    <div className={`${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} ${size === 'sm' ? 'w-4 h-4 p-4' : size === 'lg' ? 'w-8 h-8 p-5' : 'w-6 h-6 p-[18px]'}${border ? ' border-2 border-white' : ''} bg-gray-300 flex justify-center items-center overflow-hidden`}>
      {
        src ? <img src={src} alt={initialName || 'avatar'} className="w-full"/> : <span className={`font-semibold ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-xl' : 'text-base'}`}>{initialName}</span>
      }
    </div>
  );
};

Avatar.propTypes = propTypes;
Avatar.defaultProps = defaultProps;

export default Avatar;