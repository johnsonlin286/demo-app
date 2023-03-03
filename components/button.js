import { Icon } from '@iconify/react';
import loadingIcon from '@iconify/icons-mdi/loading';

import Link from 'next/link';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.oneOf(['button', 'link']),
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  block: PropTypes.bool,
  outline: PropTypes.bool,
  route: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string
};

const defaultProps = {
  type: 'button',
  size: 'default',
  block: false,
  outline: false,
  onClick: () => null,
  disabled: false,
  loading: false,
  className: ''
};

const Button = ({ type, size, block, outline, route, onClick, disabled, loading, children }) => {
  return (
    <>
      {
        type === 'button' ? (
          <button
            className={`btn${outline ? ' btn-outline' : ''}${block ? ' w-full' : ''}${disabled ? ' disabled' : ''} ${size === 'sm' ? 'py-2 px-3' : size === 'lg' ? 'py-4 px-6' : 'py-3 px-5'} border rounded-lg font-medium ${className}`} disabled={disabled} onClick={onClick}>
            {
              loading ? <><Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> Processing...</> : children
            }
          </button>
        ) : (
          <Link href={route} className={`btn${outline ? ' btn-outline' : ''}${block ? ' w-full' : ''}${disabled ? ' disabled' : ''} ${size === 'sm' ? 'py-2 px-3' : size === 'lg' ? 'py-4 px-6' : 'py-3 px-5'} border rounded-lg font-medium`}>
            {
              loading ? <><Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> Processing...</> : children
            }
          </Link>
        )
      }
    </>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;