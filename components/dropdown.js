import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const propTypes = {
  menu: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    router: PropTypes.string,
  }))
};

const defaultProps = {};

const Dropdown = ({ menu, children }) => {
  const ref = useRef(null);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    document.addEventListener('click', clickOutsideHandler);
    return () => {
      document.removeEventListener('click', clickOutsideHandler);
    }
  }, []);

  const clickOutsideHandler = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowNav(false);
    };
  };

  return (
    <div ref={ref} className="dropdown relative">
      <button className="dropdown-toggle" onClick={() => setShowNav(!showNav)}>
        {
          children
        }
      </button>
      {
        showNav && (
          <nav className="dropdown-nav absolute bottom-full mb-3">
            <ol className="bg-white shadow-lg rounded-md overflow-hidden">
              {
                menu && menu.length > 0 ? menu.map((item, i) => (
                  <li key={i}>
                    <Link href={item.router} className={`block text-sky-400 hover:underline hover:bg-gray-200 text-right py-2 px-4 ${(i + 1) < menu.length ? 'border-b border-b-gray-200' : ''}`} onClick={() => setShowNav(false)}>{item.label}</Link>
                  </li>
                )) : (
                  <li className="py-2 px-4">
                    no option
                  </li>
                )
              }
            </ol>
            <span className="dropdown-caret drop-shadow"/>
          </nav>
        )
      }
    </div>
  );
};

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export default Dropdown;