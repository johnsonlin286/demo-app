import PropTypes from 'prop-types';

const propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {};

const ThumbnailImg = ({ src, alt, onClick }) => {
  return (
    <div role="button" className="flex justify-center items-center overflow-hidden" onClick={onClick}>
      <img src={src} alt={alt} className="h-full"/>
    </div>
  );
};

ThumbnailImg.propTypes = propTypes;
ThumbnailImg.defaultProps = defaultProps;

export default ThumbnailImg;