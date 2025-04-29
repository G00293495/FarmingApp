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

    const blob = await fetch(capturedImage).then(res => res.blob());
    const formData = new FormData();
    formData.append("image", blob, "captured.jpg");

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setCapturedImage(null);
        fetchStoredImages(); // refresh the gallery
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const fetchStoredImages = async () => {
    try {
      const res = await fetch("http://localhost:5000/images");
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

      {!capturedImage && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="webcam"
        />
      )}

      {capturedImage && (
        <div>
          <h3>Captured Image</h3>
          <img src={capturedImage} alt="Captured" className="captured-image" />
        </div>
      )}

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
      <div style={{ width: "100%" }}>
        {storedImages.map((img, index) => (
          <div key={index} style={{ marginBottom: "20px", textAlign: "center" }}>
            <img
              src={`http://localhost:5000/${img.filename}`}
              alt={`Capture ${index}`}
              style={{ width: "100%", maxWidth: "500px", borderRadius: "10px" }}
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
