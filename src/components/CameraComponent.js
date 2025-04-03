import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // capture image from the webcam
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  return (
    <div className="camera-container">
      <h2>Capture Image</h2>

      {/* Webcam Stream */}
      {!capturedImage && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="webcam"
        />
      )}

      {/* Show Captured Image */}
      {capturedImage && (
        <div>
          <h3>Captured Image</h3>
          <img src={capturedImage} alt="Captured" className="captured-image" />
        </div>
      )}

      {/* Capture Button */}
      {!capturedImage && (
        <button onClick={captureImage} className="capture-btn">
          Capture Photo
        </button>
      )}

      {/* Reset Button */}
      {capturedImage && (
        <button onClick={() => setCapturedImage(null)} className="reset-btn">
          Retake Photo
        </button>
      )}
    </div>
  );
};

export default CameraComponent;
