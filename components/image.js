import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PropTypes from 'prop-types';

import 'react-lazy-load-image-component/src/effects/blur.css';

const propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  wrapperClassName: PropTypes.string,
  imageClassName: PropTypes.string,
};

const defaultProps = {
  wrapperClassName: '',
  imageClassName: '',
};

const Image = ({ src, alt, wrapperClassName, imageClassName }) => {
  const [placeholder, setPlaceholder] = useState(true);
  return (
    <div className="relative w-full h-full">
      {
        placeholder && <span className="absolute block bg-slate-300 w-full h-full top-0 left-0 animate-pulse -z-[1]"/>
      }
      <LazyLoadImage
        src={src}
        alt={alt}
        effect="blur"
        afterLoad={() => setPlaceholder(false)}
        wrapperClassName={`w-full h-full ${wrapperClassName}`}
        className={imageClassName}
      />
    </div>
  );
};

Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export default Image;