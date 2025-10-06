import React, { useState, useEffect, useRef } from 'react';
import { Viewer, Entity, ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMjE4MmMxNy1kMDQ2LTQ4ODAtOGYzYy00ZWY1YmMyNGI2NjYiLCJpZCI6MzQ1MjUxLCJpYXQiOjE3NTk1MDcwMjd9.nJSVQE2O46RCaYf7OU-Wd6b0ELd2a2N6-rZEwZabWB0";

window.CESIUM_BASE_URL = "/cesium/";

function Globe() {
  const [pinLocation, setPinLocation] = useState(null);
  const [sarImageUrl, setSarImageUrl] = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [sceneName, setSceneName] = useState(null);
  const [imageTags, setImageTags] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!pinLocation) return;

    const fetchSarData = async () => {
      setIsLoading(true);
      setError(null);
      setSarImageUrl(null);
      setAiExplanation(null);
      setSceneName(null);
      setImageTags([]);
      setMetadata(null);

      try {
        const response = await fetch("https://localhost:5000/api/get-sar-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pinLocation),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSarImageUrl(data.imageUrl);
        setAiExplanation(data.explanation);
        setSceneName(data.sceneName);
        setImageTags(data.imageTags || []);
        setMetadata(data.metadata || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSarData();
  }, [pinLocation]);

  const handleGlobeClick = (movement) => {
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewer) return;

    const cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
    if (cartesian) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      setPinLocation({ latitude, longitude });
    }
  };

  return (
    <>
      <Viewer
        ref={viewerRef}
        className="globe-viewer"
        imageryProvider={new Cesium.OpenStreetMapImageryProvider({
          url: "https://a.tile.openstreetmap.org/",
        })}
        geocoder={false}
        timeline={false}
        animation={false}
      >
        <ScreenSpaceEventHandler>
          <ScreenSpaceEvent
            action={handleGlobeClick}
            type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
          />
        </ScreenSpaceEventHandler>

        {pinLocation && (
          <Entity
            position={Cesium.Cartesian3.fromDegrees(pinLocation.longitude, pinLocation.latitude)}
            name="Pinned Location"
            billboard={{
              image: './pin.png',
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              scale: 0.02,
            }}
          />
        )}
      </Viewer>

      {pinLocation && (
        <div className="image-panel animate-in">
          <h3 className="image-viewer-title">WE GOT YOUR SAR DATA</h3>
          {isLoading && <div className="loader"></div>}
          {error && <p style={{ color: 'red' }} className="error">Error: {error}</p>}

          {sarImageUrl && !isLoading && (
            <div>
              <p className="display">see what we extracted:</p>
              <a href={sarImageUrl} target="_blank" rel="noopener noreferrer">
                <img src={sarImageUrl} alt="SAR" className="sar-image" />
              </a>

              <div className="ai-box">
                <h4>📡 Scene Name:</h4>
                <p>{sceneName}</p>

                {imageTags.length > 0 && (
                  <>
                    <h4>🧠 Imagga Identified Features:</h4>
                    <ul>
                      {imageTags.map((tag, index) => (
                        <li key={index}>{tag}</li>
                      ))}
                    </ul>
                  </>
                )}

                

                {aiExplanation && (
                  <>
                    <h4>AI’s Interpretation:</h4>
                    <p className="ai-explanation-text">{aiExplanation}</p>
                  </>
                )}
              </div>

              <button
                className="refresh-btn"
                onClick={() => window.location.reload()}
              >
                Select Another Location
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Globe;
