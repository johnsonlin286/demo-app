// import ButtonLike from './button-like';
import PropTypes from 'prop-types';

const propTypes = {
  data: PropTypes.object,
};

const defaultProps = {};

const PhotoPreview = ({ data }) => {
  return (
    <>
      <div className="relative rounded-lg overflow-hidden">
        {
          data.user ? (
            <div className="absolute w-full flex items-center top-0 left-0 p-3 bg-gradient-to-r from-black">
              <div className="w-9 h-9 border-2 border-white rounded-full overflow-hidden">
                <img src="https://via.placeholder.com/100" alt="placeholder" className="max-w-full"/>
              </div>
              <p className="text-lg font-medium text-white ml-2">{data.user.name}</p>
            </div>
          ) : null
        }
        <img src={data.imageUrl} alt={data.caption} className="w-full"/>
      </div>
      <div className="flex w-full items-center py-2">
        {/* <ButtonLike onClick={() => console.log('like button toggle')}/> */}
      </div>
      <p className="pl-2 italic">
        {data.caption}
      </p>
    </>
  );
};

PhotoPreview.propTypes = propTypes;
PhotoPreview.defaultProps = defaultProps;

export default PhotoPreview;