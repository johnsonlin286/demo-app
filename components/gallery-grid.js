import PropTypes from "prop-types";

const propTypes = {};

const defaultProps = {};

const GalleryGrid = ({ children }) => {
  return (
    <div className="grid w-full grid-flow-row grid-cols-3 gap-1">
      {children}
    </div>
  );
};

GalleryGrid.propTypes = propTypes;
GalleryGrid.defaultProps = defaultProps;

export default GalleryGrid;
