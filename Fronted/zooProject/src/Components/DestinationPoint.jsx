import React, { useState } from 'react';

const DestinationPoint = ({ destination, isEditorActive }) => {
  const [showInfo, setShowInfo] = useState(false);

  // חילוץ המיקום (תמיכה בשני המבנים האפשריים)
  const posX = destination.location?.x ?? destination.x;
  const posY = destination.location?.y ?? destination.y;

  const pointStyle = {
    left: `${posX}%`,
    top: `${posY}%`,
    position: 'absolute',
    // במצב עורך: המיכל עצמו "שקוף" ללחיצות (מעביר אותן ל-SVG שמתחת)
    // במצב רגיל: הוא לחיץ כדי להראות Tooltip
    pointerEvents: isEditorActive ? 'none' : 'auto',
    zIndex: isEditorActive ? 5 : 20,
  };

  return (
    <div 
      className={`map-point-container ${isEditorActive ? 'editor-mode' : ''}`} 
      style={pointStyle}
      onMouseEnter={() => !isEditorActive && setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      {/* הנעץ עצמו - חייב להישאר לחיץ תמיד כדי להתחיל/לסיים מסלול */}
      <div className="pin" style={{ pointerEvents: 'auto' }}>📍</div>

      {/* הבועה מוצגת רק אם אנחנו לא בעורך */}
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