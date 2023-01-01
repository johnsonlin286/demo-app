import { BottomSheet as ReactSpringBottomSheet } from 'react-spring-bottom-sheet';
import PropTypes from 'prop-types';

import 'react-spring-bottom-sheet/dist/style.css'

const propTypes = {
  open: PropTypes.bool,
  height: PropTypes.oneOf(['50', '80', '100', 'auto']),
  onDismiss: PropTypes.func,
};

const defaultProps = {
  open: false,
  height: 'auto',
  onDismiss: () => null,
};

const BottomSheet = ({ open, height, onDismiss, children }) => {
  return (
    <ReactSpringBottomSheet
      className="bottom-sheet-custom-style"
      open={open}
      onDismiss={onDismiss}
      snapPoints={({ minHeight, maxHeight }) => {
        if (height === '50') {
          return maxHeight / 2;
        } else if (height === '80') {
          return maxHeight * (80/100)
        } else if (height === '100') {
          return maxHeight;
        } else return minHeight;
      }}
    >
      <div className="p-4">
        {
          children
        }
      </div>
    </ReactSpringBottomSheet>
  )
};

BottomSheet.propTypes = propTypes;
BottomSheet.defaultProps = defaultProps;

export default BottomSheet;