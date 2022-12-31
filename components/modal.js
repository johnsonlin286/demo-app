import { Children, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const propTypes = {
  show: PropTypes.bool,
  size: PropTypes.oneOf(['sm', '', 'lg']),
  onDismiss: PropTypes.func,
  clickOutside: PropTypes.bool,
};

const defaultProps = {
  show: false,
  size: '',
  onDismiss: () => null,
  clickOutside: true,
};

const Modal = ({ show, size, onDismiss, clickOutside, children }) => {
  const backdrop = useRef(null);
  const modal= useRef(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (show) {
      setShowModal(true);
    } else {
      if (backdrop.current && modal.current) {
        modal.current.classList.add('close');
        backdrop.current.classList.add('close');
        backdrop.current.addEventListener('animationend', () => setShowModal(false));
      }
    }
  }, [show]);

  useEffect(() => {
    if (showModal && clickOutside) backdrop.current.addEventListener('click', onDismiss);
  }, [showModal])

  return (
    <>
      {showModal && (
        <>
          <div ref={backdrop} className="backdrop fixed w-screen h-screen backdrop-blur-md bg-black/25 top-0 left-0 z-30" />
          <div
            ref={modal}
            className={`modal fixed bg-white rounded-md ${size === 'sm' ? 'w-[300px]' : size === 'lg' ? 'w-[800px]' : 'w-[500px]'} p-4 left-1/2 -translate-x-1/2 z-30`}
          >
            {children}
          </div>
        </>
      )}
    </>
  );
};

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
