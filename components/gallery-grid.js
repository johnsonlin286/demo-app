import PropTypes from 'prop-types';

const propTypes = {};

const defaultProps = {};

const GalleryGrid = ({ children }) => {
  return (
    <div className="grid grid-cols-3 grid-flow-row gap-1">
      {
        children
      }
    </div>
  );
};

GalleryGrid.propTypes = propTypes;
GalleryGrid.defaultProps = defaultProps;

export default GalleryGrid;