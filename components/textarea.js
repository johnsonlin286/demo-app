import PropTypes from 'prop-types';

const propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

const defaultProps = {
  id: '',
  label: '',
  placeholder: '',
  value: '',
  error: '',
  disabled: false,
  className: '',
  onChange: () => null,
};

const Textarea = ({ id, label, placeholder, value, error, disabled, className, onChange }) => {
  return (
    <div className={`textarea${className ? ` ${className}` : ''}`}>
      {
        label && <label htmlFor={id} className={`block mb-1${error ? ' text-red-600' : ''}`}>{label}</label>
      }
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.currentTarget.value)}
        className={`form-input w-full rounded-md focus:border-sky-400 focus:right-0${error ? ' border-red-600' : ''} disabled:bg-gray-200`}
        rows="5"
      />
      {
        error && <span className="block text-red-600 text-xs">{error}</span> 
      }
    </div>
  );
};

Textarea.propTypes = propTypes;
Textarea.defaultProps = defaultProps;

export default Textarea;