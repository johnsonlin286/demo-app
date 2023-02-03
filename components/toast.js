import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../context';
import { Icon } from '@iconify/react';
import closeOutline from '@iconify/icons-ion/close-outline';
import PropTypes from 'prop-types';

const propTypes = {
  visible: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
  text: PropTypes.string,
  className: PropTypes.string,
  onDismiss: PropTypes.func,
};

const defaultProps = {
  color: 'primary',
  text: '',
};

const Toast = ({ visible, color, text, className }) => {
  const elm = useRef(null);
  const context = useContext(AppContext);
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (!visible) {
      if (elm.current) {
        elm.current.classList.add('close');
        elm.current.addEventListener('animationend', () => setShow(false));
      }
    } else {
      setShow(visible);
      setTimeout(() => {
        onDismiss();
      }, 5000);
    }
  }, [visible]);

  const onDismiss = () => {
    context.setToast({
      visible: false,
      color: color,
      text: '',
    });
  }

  return (
    <>
      {
        show && (
          <div ref={elm} className={`container toast toast-${color} flex justify-between items-center fixed top-4 left-1/2 -translate-x-1/2 z-[15] ${className ? ` ${className}` : ''}`}>
            <strong className="font-medium">
              {text}
            </strong>
            <button onClick={onDismiss}><Icon icon={closeOutline} width="20"/></button>
          </div>
        )
      }
    </>
  );
};

Toast.propTypes = propTypes;
Toast.defaultProps = defaultProps;

export default Toast;