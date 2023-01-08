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
    <a role="button" className="flex justify-center items-center h-[130px] overflow-hidden" onClick={(e) => {e.preventDefault(); onClick();}}>
      <Image src={src} alt={alt} imageClassName="h-full aspect-video"/>
    </a>
  );
};

ThumbnailImg.propTypes = propTypes;
ThumbnailImg.defaultProps = defaultProps;

export default ThumbnailImg;