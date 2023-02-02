import { useEffect, useRef, useState } from 'react';
import ImageCropper from './imageCropper';
import { Icon } from '@iconify/react';
import imageSharp from '@iconify/icons-ion/image-sharp';
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
  const [tempImage, setTempImage] = useState();
  const [imgPreview, setImgPreview] = useState();
  // const [cropImage, setCropImg] = useState(false);
  const [errMsg, setErrMsg] = useState();

  useEffect(() => {
    const dropzone = ref.current;
    if (dropzone) {
      dropzone.addEventListener('dragover', onDragOverHandler);
      dropzone.addEventListener('dragleave', onDragLeaveHandler);
      dropzone.addEventListener('drop', onDropHandler);
  
      return () => {
        dropzone.removeEventListener('dragover', onDragOverHandler);
        dropzone.removeEventListener('dragleave', onDragLeaveHandler);
        dropzone.removeEventListener('drop', onDropHandler);
      }
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
    setTempImage();
    setImgPreview();
    
    const files = e.dataTransfer.files;
    imageValidation(files);
  }

  const onChangeHandler = (e) => {
    setTempImage();
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
    setTempImage(blobURL);
    console.log(file);
    // setImgPreview(blobURL);
  }

  const saveCroppedImg = (croppedImageArea) => {
    const canvasElm = document.createElement('canvas');
    canvasElm.width = croppedImageArea.width;
    canvasElm.height = croppedImageArea.height;

    const context = canvasElm.getContext('2d');
    let imgObj = new Image();
    imgObj.src = tempImage;
    imgObj.onload = function () {
      context.drawImage(
        imgObj,
        croppedImageArea.x,
        croppedImageArea.y,
        croppedImageArea.width,
        croppedImageArea.height,
        0,
        0,
        croppedImageArea.width,
        croppedImageArea.height
      );
      const dataURL = canvasElm.toDataURL("image/jpeg");
      setImgPreview(dataURL);
      onChange(dataURL);
    };
  }

  return (
    <>
      {
        !tempImage ? (
          <div
            ref={ref}
            className={`flex flex-col justify-center items-center min-w-full h-[300px] border-2 border-dashed rounded-md overflow-hidden${dragOver ? ' border-sky-400' : ''}`}
          >
            <Icon icon={imageSharp} width="48" className="text-sky-400 mx-auto"/>
            <p className="text-center mb-3">Drop image here or</p>
            <label htmlFor="fileInput" className="block btn border rounded-lg text-center cursor-pointer py-2 px-3">
              Choose File
              <input id="fileInput" type="file" accept="image/jpeg,image/png" onChange={onChangeHandler} className="invisible w-0 h-0"/>
            </label>
            {
              errMsg && <p className="text-xs text-center text-red-600">{errMsg}</p>
            }
          </div>
        ) : imgPreview ? (
          <div className="flex justify-center items-center min-w-full h-[300px] border-2 border-dashed rounded-md overflow-hidden">
            <img src={imgPreview} className="h-full"/>
          </div>
        ) : (
          <div className="flex justify-center items-center min-w-full h-[300px]">
            <ImageCropper imgUrl={tempImage} onCropped={saveCroppedImg}/>
          </div>
        )
      }
    </>
  );
};

UploadField.propTypes = propTypes;
UploadField.defaultProps = defaultProps;

export default UploadField;