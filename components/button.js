import { Icon } from '@iconify/react';
import loadingIcon from '@iconify/icons-mdi/loading';

import Link from 'next/link';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.oneOf(['button', 'link']),
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  outline: PropTypes.bool,
  route: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

const defaultProps = {
  type: 'button',
  size: 'default',
  outline: false,
  onClick: () => null,
  disabled: false,
  loading: false,
};

const Button = ({ type, size, color, outline, route, onClick, disabled, loading, children }) => {
  return (
    <>
      {
        type === 'button' ? (
          <button className={`btn${outline ? ' btn-outline' : ''}${disabled ? ' disabled' : ''} ${size === 'sm' ? 'py-2 px-3' : size === 'lg' ? 'py-6 px-7' : 'py-4 px-5'} border rounded-lg font-medium`} disabled={disabled} onClick={onClick}>
            {
              loading ? <><Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> Processing...</> : children
            }
          </button>
        ) : (
          <Link href={route} className={`btn${outline ? ' btn-outline' : ''}${disabled ? ' disabled' : ''} ${size === 'sm' ? 'py-2 px-3' : size === 'lg' ? 'py-6 px-7' : 'py-4 px-5'} border rounded-lg font-medium`}>
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