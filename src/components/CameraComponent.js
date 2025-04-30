import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [storedImages, setStoredImages] = useState([]);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const uploadImage = async () => {
    if (!capturedImage) return;

    const blob = await fetch(capturedImage).then((res) => res.blob());
    const formData = new FormData();
    formData.append("image", blob, "captured.jpg");

    try {
      const res = await fetch("http://localhost:5000/camera/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setCapturedImage(null);
        fetchStoredImages();
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const fetchStoredImages = async () => {
    try {
      const res = await fetch("http://localhost:5000/camera/images");
      const data = await res.json();
      setStoredImages(data);
    } catch (err) {
      console.error("Fetch images failed", err);
    }
  };

  useEffect(() => {
    fetchStoredImages();
  }, []);

  return (
    <div className="camera-container">
      <h2>Capture Image</h2>

      <div className="image-container">
        {!capturedImage && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />
        )}

        {capturedImage && (
          <img src={capturedImage} alt="Captured" className="captured-image" />
        )}
      </div>

      {!capturedImage ? (
        <button onClick={captureImage} className="capture-btn">
          Capture Photo
        </button>
      ) : (
        <>
          <button onClick={uploadImage} className="capture-btn">
            Save Photo
          </button>
          <button onClick={() => setCapturedImage(null)} className="reset-btn">
            Retake
          </button>
        </>
      )}

      <h3>Previous Captures</h3>
      <div className="image-container">
        {storedImages.map((img, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <img
              src={`http://localhost:5000${img.url}`}
              alt={`Capture ${index}`}
              className="captured-image"
            />
            <p style={{ marginTop: "8px", fontSize: "0.9rem", color: "#555" }}>
              {new Date(img.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraComponent;