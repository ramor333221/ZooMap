import React, { useState } from 'react';

// הוספנו כאן את isSelected ו-onClick לרשימת ה-Props
const DestinationPoint = ({ destination, isEditorActive, isSelected, onClick }) => {
  const [showInfo, setShowInfo] = useState(false);

  // חילוץ המיקום
  const posX = destination.location?.x ?? destination.x;
  const posY = destination.location?.y ?? destination.y;

  const pointStyle = {
    left: `${posX}%`,
    top: `${posY}%`,
    position: 'absolute',
    pointerEvents: isEditorActive ? 'none' : 'auto',
    zIndex: isEditorActive ? 5 : 30, // העלינו את ה-Z-Index כדי שיהיה מעל הכל
    transition: 'all 0.3s ease', // אנימציה חלקה למעבר
  };

  return (
    <div 
      // הוספת מחלקה 'selected' אם היעד נבחר
      className={`map-point-container ${isEditorActive ? 'editor-mode' : ''} ${isSelected ? 'selected' : ''}`} 
      style={pointStyle}
      onMouseEnter={() => !isEditorActive && setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
      // הפעלת פונקציית הבחירה בלחיצה
      onClick={onClick}
    >
      {/* הנעץ עצמו - משנה צבע או גודל אם הוא נבחר */}
      <div 
        className="pin" 
        style={{ 
            pointerEvents: 'auto',
            transform: isSelected ? 'scale(1.5)' : 'scale(1)',
            filter: isSelected ? 'drop-shadow(0 0 8px #007AFF)' : 'none',
            fontSize: isSelected ? '1.5rem' : '1.2rem'
        }}
      >
        {isSelected ? '📍' : '📌'} 
      </div>

      {/* בועת המידע */}
      {showInfo && !isEditorActive && (
        <div className="dest-tooltip">
          <div className="dest-image-container">
            <img src={destination.picUrl} alt={destination.name} className="dest-image" />
          </div>
          <div className="dest-content">
            <h3 className="dest-title">{destination.name}</h3>
            <p className="dest-description">{destination.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationPoint;