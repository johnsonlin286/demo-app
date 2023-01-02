import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';


const propTypes = {
  top: PropTypes.bool,
  menu: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.object,
    link: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
  }))
};

const defaultProps = {
  top: false,
};

const Dropdown = ({ top, menu, children }) => {
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
          <nav className={`dropdown-nav absolute ${top ? 'top bottom-full mb-3' : 'down top-full mt-3'}`}>
            <ol className="bg-white border border-gray-200 rounded-md overflow-hidden">
              {
                menu && menu.length > 0 ? menu.map((item, i) => (
                  <li key={i}>
                    {
                      item.link ? (
                        <Link href={item.link} className={`flex justify-end items-center hover:underline hover:bg-gray-200 text-right py-2 px-4 ${(i + 1) < menu.length ? 'border-b border-b-gray-200' : ''}${item.className ? ` ${item.className}` : ''}`} onClick={() => setShowNav(false)}>
                          {item.icon && <Icon icon={item.icon} className="mr-1" />}
                          {item.label}
                        </Link>
                      ) : (
                        <a role="button" className={`flex justify-end items-center hover:underline hover:bg-gray-200 text-right py-2 px-4 ${(i + 1) < menu.length ? 'border-b border-b-gray-200' : ''}${item.className ? ` ${item.className}` : ''}`} onClick={(e) => { e.preventDefault(); item.onClick(); setShowNav(false); }}>
                          {item.icon && <Icon icon={item.icon} className="mr-1" />}
                          {item.label}
                        </a>
                      )
                    }
                  </li>
                )) : (
                  <li className="py-2 px-4">
                    no option
                  </li>
                )
              }
            </ol>
          </nav>
        )
      }
    </div>
  );
};

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export default Dropdown;