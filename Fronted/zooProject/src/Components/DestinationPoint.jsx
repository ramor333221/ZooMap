import React, { useState } from 'react';
import '../Scss/DestinationPoint.scss'; 

const DestinationPoint = ({ destination, isEditorActive, isSelected, onClick }) => {
  const [showInfo, setShowInfo] = useState(false);

  // חילוץ קואורדינטות
  const posX = destination.location?.x ?? destination.x;
  const posY = destination.location?.y ?? destination.y;

  // בניית נתיב התמונה מתיקיית public
  // אם destination.picUrl הוא למשל "images/park.jpg", זה יחפש ב-public/images/park.jpg
  //const imageSrc = `${process.env.PUBLIC_URL}/${destination.picUrl}`;
  const imageSrc = `/${destination.picUrl}`;

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
           <img src={imageSrc} alt="" className="pin-destination-img" />
        </div>
        <span className={`radar-pulse ${isSelected ? 'active-pulse' : ''}`}></span>
      </div>

      {showInfo && !isEditorActive && (
        <div className="dest-tooltip-professional">
          <div className="tooltip-header">
            <img src={imageSrc} alt="" className="header-thumb" />
            <div className="header-text">
              <h3 className="dest-title">{destination.name}</h3>
              <span className="dest-category">{destination.category || "מיקום"}</span>
            </div>
          </div>
          <div className="dest-body">
            <p className="dest-description">
              {destination.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationPoint;