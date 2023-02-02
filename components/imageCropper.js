import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import PropTypes from 'prop-types';
import Button from "./button";

const propTypes = {
  imgUrl: PropTypes.string,
  onCropped: PropTypes.func,
}

const defaultProps = {
  onCropped: () => null,
};

const ImageCropper = ({ imgUrl, onCropped }) => {
  const [crop, setCrop] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const cropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="relative w-full h-full border-2 border-dashed rounded-md overflow-hidden">
        <Cropper
          image={imgUrl}
          aspect={4/3}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={cropComplete}
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex grow">
          <label className="mr-2">Zoom:</label>
          <input type="range" min="1" max="3" step="0.1" defaultValue="1" className="w-1/2" onChange={(e) => setZoom(e.currentTarget.value)}/>
        </div>
        <Button size="sm" onClick={() => onCropped(croppedArea)}>
          Save
        </Button>
      </div>
    </div>
  );
}

ImageCropper.propTypes = propTypes;
ImageCropper.defaultProps = defaultProps;

export default ImageCropper;