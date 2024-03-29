import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

const propTypes = {
  id: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'password']),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  focus: PropTypes.bool,
  onChange: PropTypes.func,
};

const defaultProps = {
  id: '',
  type: 'text',
  label: '',
  placeholder: '',
  value: '',
  disabled: false,
  error: '',
  className: '',
  focus: false,
  onChange: () => null,
};

const InputField = ({ id, type, label, placeholder, value, disabled, error, className, focus, onChange }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (focus) ref.current.focus();
  }, [focus]);
  return (
    <div className={`input-field ${className ? ` ${className}` : ''}`}>
      {
        label && <label htmlFor={id} className={`block mb-1${error ? ' text-red-600' : ''}`}>{label}</label>
      }
      <input ref={ref} id={id} type={type} placeholder={placeholder} value={value} disabled={disabled} onChange={(e) => onChange(e.currentTarget.value)} className={`form-input w-full rounded-md focus:border-sky-400 focus:ring-0${error ? ' border-red-600' : ''}`}/>
      {
        error && <span className="block text-red-600 text-xs">{error}</span>
      }
    </div>
  );
};

InputField.propTypes = propTypes;
InputField.defaultProps = defaultProps;

export default InputField;