import ButtonLike from './button-like';
import PropTypes from 'prop-types';

const propTypes = {
  data: PropTypes.object,
};

const defaultProps = {};

const PhotoPreview = () => {
  return (
    <>
      <div className="relative rounded-lg overflow-hidden">
        <div className="absolute w-full flex items-center top-0 left-0 p-3">
          <div className="w-9 h-9 border-2 border-white rounded-full overflow-hidden">
            <img src="https://via.placeholder.com/100" alt="placeholder" className="max-w-full"/>
          </div>
          <p className="text-lg font-medium text-white ml-2">User Name</p>
        </div>
        <img src="https://via.placeholder.com/180" alt="placeholder" className="w-full"/>
      </div>
      <div className="flex w-full items-center py-2">
        <ButtonLike onClick={() => console.log('like button toggle')}/>
      </div>
      <p>
        lorem ipsum dolor sit amet.
      </p>
    </>
  );
};

PhotoPreview.propTypes = propTypes;
PhotoPreview.defaultProps = defaultProps;

export default PhotoPreview;