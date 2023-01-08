import Image from './image';
import PropTypes from 'prop-types';

const propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {};

const ThumbnailImg = ({ src, alt, onClick }) => {
  return (
    <a role="button" className="h-[130px] overflow-hidden" onClick={(e) => {e.preventDefault(); onClick();}}>
      <Image src={src} alt={alt} wrapperClassName="relative" imageClassName="absolute aspect-[4/3] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
    </a>
  );
};

ThumbnailImg.propTypes = propTypes;
ThumbnailImg.defaultProps = defaultProps;

export default ThumbnailImg;