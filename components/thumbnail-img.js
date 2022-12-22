import PropTypes from 'prop-types';

const propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {};

const ThumbnailImg = ({ src, alt, onClick }) => {
  return (
    <button className="flex justify-center items-center overflow-hidden" onClick={onClick}>
      <img src={src} alt={alt}/>
    </button>
  );
};

ThumbnailImg.propTypes = propTypes;
ThumbnailImg.defaultProps = defaultProps;

export default ThumbnailImg;