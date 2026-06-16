import React, { useState } from 'react';
import '../../Scss/DestinationPoint.scss'; 
import StatusDisplay from '.././ErrorDisplay/StatusDisplay'; 
import { BASE_URL } from '../../Api/apiSlice';


const DestinationPoint = ({ destination, isEditorActive, isSelected, onClick }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!destination) {
    return <StatusDisplay type="error" message="Destination data unavailable." />;
  }

  const posX = destination.location?.x ?? destination.x;
  const posY = destination.location?.y ?? destination.y;

  const serverHost = BASE_URL.replace('/api', '');
  const imageSrc = `${serverHost}${destination.picUrl?.startsWith('/') ? '' : '/'}${destination.picUrl || ''}`;

  const pointStyle = {
    left: `${posX}%`,
    top: `${posY}%`,
    position: 'absolute',
    pointerEvents: isEditorActive ? 'none' : 'auto',
    zIndex: isSelected ? 100 : 30,
    transition: 'all 0.4s ease',
  };

  return (
    <div 
      className={`map-point-container ${isSelected ? 'selected' : ''}`} 
      style={pointStyle}
      onMouseEnter={() => !isEditorActive && setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
      onClick={onClick}
    >
      <div className="pin-wrapper">
        <div className="pin-image-frame">
           <img 
             src={imageSrc} 
             alt={destination.name || "Destination"} 
             className="pin-destination-img" 
             onError={() => setImageError(true)}
           />
        </div>
        <span className={`radar-pulse ${isSelected ? 'active-pulse' : ''}`}></span>
      </div>

      {showInfo && !isEditorActive && (
        <div className="dest-tooltip-professional">
          {imageError ? (
             <div style={{ padding: '10px', fontSize: '12px' }}>Image Unavailable</div>
          ) : (
            <div className="tooltip-header">
              <img src={imageSrc} alt={destination.name} className="header-thumb" />
              <div className="header-text">
                <h3 className="dest-title">{destination.name}</h3>
                <span className="dest-category">{destination.category || "מיקום"}</span>
              </div>
            </div>
          )}
          
          <div className="dest-body">
            <p className="dest-description">
              {destination.description || "No description available."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationPoint;