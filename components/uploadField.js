import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  error: PropTypes.string,
  onChange: PropTypes.func,
};

const defaultProps = {
  error: '',
  onChange: () => null,
};

const UploadField = ({ error, onChange }) => {
  const ref = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [imgPreview, setImgPreview] = useState();
  const [errMsg, setErrMsg] = useState();

  useEffect(() => {
    const dropzone = ref.current;
    dropzone.addEventListener('dragover', onDragOverHandler);
    dropzone.addEventListener('dragleave', onDragLeaveHandler);
    dropzone.addEventListener('drop', onDropHandler);

    return () => {
      dropzone.removeEventListener('dragover', onDragOverHandler);
      dropzone.removeEventListener('dragleave', onDragLeaveHandler);
      dropzone.removeEventListener('drop', onDropHandler);
    }
  }, []);

  useEffect(() => {
    if (error) setErrMsg(error);
  }, [error]);
  
  const onDragOverHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }

  const onDragLeaveHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }

  const onDropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    setImgPreview();
    
    const files = e.dataTransfer.files;
    imageValidation(files);
  }

  const onChangeHandler = (e) => {
    setImgPreview();

    const files = e.target.files;
    imageValidation(files);
  }

  const imageValidation = (files) => {
    if (files.length < 1) return
    
    const file = files[0];
    
    // check file type
    const re = /(\.jpg|\.jpeg|\.png)$/i;
    if (!re.exec(file.name)) {
      setErrMsg('I ony accept .jpg, .jpeg, and .png file type.');
      return;
    };

    // check file size 1 Mb
    const fileSize = file.size / 1024;
    if (fileSize > 1024) {
      setErrMsg('I only accept maximum 1 Mb file size.');
      return;
    };

    const blobURL = window.URL.createObjectURL(file);
    setImgPreview(blobURL);
    
    onChange(file);
  }

  return (
    <div
      ref={ref}
      className={`flex justify-center items-center min-w-full h-[300px] border-2 border-dashed rounded-md overflow-hidden${dragOver ? ' border-sky-400' : ''}`}
    >
      {
        imgPreview ? <img src={imgPreview} className="h-full"/> : (
          <div>
            <p className="text-center">Drop image here or</p>
            <input type="file" onChange={onChangeHandler} accept="image/jpeg,image/png"/>
            {
              errMsg && <p className="text-xs text-center text-red-600">{errMsg}</p>
            }
          </div>
        )
      }
    </div>
  );
};

UploadField.propTypes = propTypes;
UploadField.defaultProps = defaultProps;

export default UploadField;