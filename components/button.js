import Link from 'next/link';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.oneOf(['button', 'link']),
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  color: PropTypes.oneOf(['primary', 'secondary']),
  outline: PropTypes.bool,
  route: PropTypes.string,
  children: PropTypes.node,
};

const defaultProps = {
  type: 'button',
  size: 'default',
  color: 'primary',
  outline: false,
};

const Button = ({ type, size, color, outline, route, children }) => {
  return (
    <>
      {
        type === 'button' ? (
          <button className={`${!outline ? color === 'primary' ? 'bg-sky-400' : color === 'secondary' ? 'bg-amber-300' : 'bg-white' : 'bg-white'} ${color === 'primary' ? 'border-sky-400' : color === 'secondary' ? 'border-amber-300' : ''} ${outline ? 'border' : ''}${size === 'sm' ? 'py-2 px-3' : size === 'lg' ? 'py-6 px-7' : 'py-4 px-5'} rounded-lg font-medium text-white`}>
            {
              children
            }
          </button>
        ) : (
          <Link href={route}>
            <a className="" role="button">
              {
                children
              }
            </a>
          </Link>
        )
      }
    </>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;