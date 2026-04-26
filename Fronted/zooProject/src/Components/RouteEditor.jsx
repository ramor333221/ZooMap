import React, { useState, useEffect } from 'react';
import { routeService } from '../Api/routeService';
import { destinationService } from '../Api/destinationService';

const RouteEditor = ({ onRouteSaved }) => {
  const [destinations, setDestinations] = useState([]);
  const [points, setPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [fromD, setFromD] = useState(null);

  // טעינת היעדים כדי להציג אותם על המפה
  useEffect(() => {
    destinationService.getAll().then(setDestinations).catch(console.error);
  }, []);

  const handleDestinationClick = (dest, e) => {
    e.stopPropagation(); // מונע מהלחיצה להפעיל את handleMapClick הכללי

    if (!isDrawing) {
      // התחלת מסלול חדש מהיעד הזה
      setIsDrawing(true);
      setFromD(dest.id);
      // הנקודה הראשונה במסלול היא המיקום של היעד
      setPoints([{ x: dest.x, y: dest.y }]);
    } else {
      // סיום מסלול ביעד הזה
      if (dest.id === fromD) {
        alert("לא ניתן לסיים מסלול באותו יעד בו התחלת");
        return;
      }
      
      const finalPoints = [...points, { x: dest.x, y: dest.y }];
      saveRoute(dest.id, finalPoints);
    }
  };

  const handleMapClick = (e) => {
    if (!isDrawing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPoints(prev => [...prev, { x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) }]);
  };

  const saveRoute = async (toDId, finalPoints) => {
    const routeDTO = {
      dist: 0, 
      fromD: fromD, 
      toD: toDId,
      bodyPoints: finalPoints
    };

    try {
      await routeService.addRoute(routeDTO);
      alert(`המסלול בין ${fromD} ל-${toDId} נשמר!`);
      resetEditor();
      if (onRouteSaved) onRouteSaved();
    } catch (err) {
      alert("שגיאה בשמירה: " + err.message);
    }
  };

  const resetEditor = () => {
    setPoints([]);
    setIsDrawing(false);
    setFromD(null);
  };

  return (
    <div className="editor-container" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <strong>סטטוס: </strong>
        {!isDrawing ? "לחץ על נקודת יעד כדי להתחיל" : `מצייר מסלול מנקודה ${fromD}... לחץ על יעד אחר לסיום`}
        {isDrawing && <button onClick={resetEditor} style={{ marginRight: '10px' }}>בטל</button>}
      </div>

      <div 
        className="map-viewport" 
        onClick={handleMapClick} 
        style={{ 
          position: 'relative', width: '100%', height: '500px', 
          border: '2px solid #333', backgroundColor: '#eee', overflow: 'hidden'
        }}
      >
        {/* שכבת הציור */}
        <svg 
          viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}
        >
          {points.length > 1 && (
            <polyline
              points={points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none" stroke="yellow" strokeWidth="0.8" strokeDasharray="2,1"
            />
          )}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="0.8" fill="red" />
          ))}
        </svg>

        {/* שכבת היעדים (Destinations) */}
        {destinations.map(dest => (
          <div
            key={dest.id}
            onClick={(e) => handleDestinationClick(dest, e)}
            style={{
              position: 'absolute',
              left: `${dest.x}%`,
              top: `${dest.y}%`,
              width: '20px',
              height: '20px',
              backgroundColor: fromD === dest.id ? '#4CAF50' : '#2196F3',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '10px',
              border: '2px solid white',
              boxShadow: '0 0 5px rgba(0,0,0,0.3)'
            }}
          >
            {dest.id}
          </div>
        ))}

        <div className="map-background" style={{ zIndex: 1, width: '100%', height: '100%' }}>
            {/* תמונת המפה כאן */}
        </div>
      </div>
    </div>
  );
};

export default RouteEditor;