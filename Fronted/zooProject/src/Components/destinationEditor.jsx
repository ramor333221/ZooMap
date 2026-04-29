import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { destinationService } from '../Api/destinationService';

const DestinationEditor = ({ destinations = [], action, onSaveSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', picUrl: '', description: '', category: 'CAGES', x: 0, y: 0
    });

    const categories = ['CAGES', 'PICNIC_AREA', 'AMENITIES', 'CANCELED', 'TRAIL_SPLIT', 'ENTRANCE', 'EXIT', 'PARKING'];

    const handleMapClick = (e) => {
        const svg = e.currentTarget.closest('svg');
        const rect = svg.getBoundingClientRect();
        
        // חישוב המיקום באחוזים יחסית ל-SVG
        const xCoord = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
        const yCoord = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));
    
        // עדכון ה-State עם הקואורדינטות החדשות
        setFormData(prev => ({ 
            ...prev, 
            x: xCoord, 
            y: yCoord 
        }));
        
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // בניית האובייקט כך שיתאים ל-DestinationDTO ב-Java
            const dataToSend = {
                ...formData,
            };
    
            await destinationService.addDestination(dataToSend); 
            setShowForm(false);
            if (onSaveSuccess) onSaveSuccess();
        } catch (err) {
            console.error("Save error:", err);
            alert("שגיאה בשמירת הנקודה");
        } finally {
            setLoading(false);
        }
    };

    return (
        <g className="destination-editor-group">
            {/* 1. Clickable Area */}
            <rect 
                width="100" 
                height="100" 
                fill="transparent" 
                style={{ cursor: action === 'create' ? 'crosshair' : 'default', pointerEvents: 'all' }}
                onMouseDown={handleMapClick} 
            />

            {/* 2. Portal Form (renders outside the SVG) */}
            {showForm && ReactDOM.createPortal(
                <div className="side-editor-panel">
                    <form onSubmit={handleSubmit} className="side-form">
                        <h3>נקודה חדשה</h3>
                        <label>שם הנקודה:</label>
                        <input 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            required 
                        />
                        
                        <label>קטגוריה:</label>
                        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>

                        <label>תיאור:</label>
                        <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        />
                        
                        <div className="coord-info">X: {formData.x} | Y: {formData.y}</div>

                        <div className="button-group">
                            <button type="submit" className="save-btn" disabled={loading}>
                                {loading ? 'שומר...' : 'שמור'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>ביטול</button>
                        </div>
                    </form>
                </div>,
                document.body
            )}
        </g>
    );
};

export default DestinationEditor;