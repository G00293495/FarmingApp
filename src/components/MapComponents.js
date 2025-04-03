import React from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 53.5152,
  lng: -8.3478,
};

const fieldOneCoords = [
  { lat: 53.5151456, lng: -8.3471259 },
  { lat: 53.5143832, lng: -8.3490082 },
  { lat: 53.5114836, lng: -8.3452162 },
  { lat: 53.5121981, lng: -8.3441004 },
  { lat: 53.5130658, lng: -8.3456024 },
  { lat: 53.5136783, lng: -8.3452162 },
  { lat: 53.5151456, lng: -8.3471259 },
];

const fieldTwoCoords = [
  { lat: 53.5130116, lng: -8.3398042 },
  { lat: 53.5130499, lng: -8.3396754 },
  { lat: 53.5143896, lng: -8.3407912 },
  { lat: 53.5129133, lng: -8.3452759 },
  { lat: 53.5122243, lng: -8.343967 },
  { lat: 53.5114932, lng: -8.3432374 },
  { lat: 53.5108424, lng: -8.3416281 },
  { lat: 53.5130116, lng: -8.3398042 },
];

const fieldThreeCoords = [
  { lat: 53.5154278, lng: -8.3483698 },
  { lat: 53.5149781, lng: -8.3497699 },
  { lat: 53.5143832, lng: -8.3490082 },
  { lat: 53.5147452, lng: -8.3479219 },
  { lat: 53.5149749, lng: -8.3481526 },
  { lat: 53.5150833, lng: -8.3481821 },
  { lat: 53.5152173, lng: -8.3482223 },
  { lat: 53.5154278, lng: -8.3483698 },
];

const fieldFourCoords = [
  { lat: 53.5156313, lng: -8.3476751 },
  { lat: 53.5152278, lng: -8.3472058 },
  { lat: 53.5147796, lng: -8.3464896 },
  { lat: 53.5147605, lng: -8.3463153 },
  { lat: 53.5145388, lng: -8.3461114 },
  { lat: 53.5150252, lng: -8.3446442 },
  { lat: 53.5161788, lng: -8.3458956 },
  { lat: 53.5156313, lng: -8.3476751 },
];

const fieldFiveCoords = [
  { lat: 53.5145551, lng: -8.3460578 },
  { lat: 53.5143794, lng: -8.3459297 },
  { lat: 53.5142646, lng: -8.3458438 },
  { lat: 53.5140891, lng: -8.3457366 },
  { lat: 53.5139073, lng: -8.3455542 },
  { lat: 53.513767, lng: -8.345404 },
  { lat: 53.5136011, lng: -8.3452484 },
  { lat: 53.5135692, lng: -8.3451036 },
  { lat: 53.5138914, lng: -8.3441433 },
  { lat: 53.5141848, lng: -8.3432046 },
  { lat: 53.5148993, lng: -8.3410159 },
  { lat: 53.5153108, lng: -8.3412895 },
  { lat: 53.5158562, lng: -8.3419064 },
  { lat: 53.5158881, lng: -8.3419976 },
  { lat: 53.5158116, lng: -8.3423141 },
  { lat: 53.5155596, lng: -8.3430168 },
  { lat: 53.5153108, lng: -8.3437893 },
  { lat: 53.515038, lng: -8.3446013 },
  { lat: 53.5145551, lng: -8.3460578 },
];

const fieldSixCoords = [
  { lat: 53.5175091, lng: -8.3445249 },
  { lat: 53.5169733, lng: -8.3437953 },
  { lat: 53.5178408, lng: -8.3412418 },
  { lat: 53.5181343, lng: -8.3403621 },
  { lat: 53.5186573, lng: -8.3410058 },
  { lat: 53.5180449, lng: -8.3426366 },
  { lat: 53.5175091, lng: -8.3445249 },
];

const MapComponent = ({ navigate }) => {
  const handlePolygonClick = (fieldName) => {
    if (fieldName === "Field 1") {
      navigate("/field1");
    } else if (fieldName === "Field 2") {
      navigate("/field2");
    } else if (fieldName === "Field 3") {
      navigate("/field3");
    } else if (fieldName === "Field 4") {
      navigate("/field4");
    } else if (fieldName === "Field 5") {
      navigate("/field5");
    } else if (fieldName === "Field 6") {
      navigate("/field6");
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        mapTypeId="satellite"
      >
        <Polygon
          paths={fieldOneCoords}
          options={{
            strokeColor: "#4169e1",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#4169e1",
            fillOpacity: 0.35,
          }}
          onClick={() => handlePolygonClick("Field 1")}
        />
        <Polygon
          paths={fieldTwoCoords}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
          }}
          onClick={() => handlePolygonClick("Field 2")}
        />
        <Polygon
          paths={fieldThreeCoords}
          options={{
            strokeColor: "#00FF00",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#00FF00",
            fillOpacity: 0.35,
          }}
          onClick={() => handlePolygonClick("Field 3")}
        />
        <Polygon
          paths={fieldFourCoords}
          options={{
            strokeColor: "#FFFF00",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FFFF00",
            fillOpacity: 0.35,
          }}
          onClick={() => handlePolygonClick("Field 4")}
        />
        <Polygon
          paths={fieldFiveCoords}
          options={{
            strokeColor: "#8A2BE2",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#8A2BE2",
            fillOpacity: 0.35,
          }}
          onClick={() => handlePolygonClick("Field 5")}
        />
        <Polygon
          paths={fieldSixCoords}
          options={{
            strokeColor: "#FF6347", 
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF6347",
            fillOpacity: 0.35,
          }}
          onClick={() => handlePolygonClick("Field 6")}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;