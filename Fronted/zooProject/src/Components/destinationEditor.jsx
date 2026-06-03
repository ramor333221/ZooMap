import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import DestinationForm from './DestinationForm';
import { destinationService } from '../Api/destinationService';

const DestinationEditor = ({ destinations = [], action, onSaveSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    
    // רשימת הקטגוריות התואמת בדיוק ל-Enum ב-Java
    const categories = ["CAGES", "PICNIC_AREA", "AMENITIES", "TRAIL_SPLIT", "ENTRANCE", "EXIT", "PARKING"];

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        category: 'CAGES',
        description: '',
        picUrl: '', 
        x: 0,
        y: 0
    });

    const handleClose = () => {
        setFormData({ id: null, name: '', category: 'CAGES', description: '', picUrl: '', x: 0, y: 0 });
        setShowForm(false);
        setIsUpdating(false);
    };

    // איפוס הטופס והסגירה שלו במעבר בין Create ל-Update בטולבר
    useEffect(() => {
        handleClose();
    }, [action]);

    // 1. לחיצה על המפה הריקה - פעילה אך ורק במצב יצירה (create)
    const handleMapClick = (e) => {
        if (action !== 'create') return;

        const svg = e.currentTarget.closest('svg');
        const rect = svg.getBoundingClientRect();
        const xCoord = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
        const yCoord = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));

        setFormData({ id: null, name: '', category: 'CAGES', description: '', picUrl: '', x: xCoord, y: yCoord });
        setIsUpdating(false);
        setShowForm(true);
    };

    // 2. טעינת פרטי יעד נבחר לתוך הטופס (מהמפה או מרשימת הבחירה)
 const loadDestinationForEditing = (dest) => {
    if (!dest) return;
    
    setFormData({
        id: dest.id,
        name: dest.name || '',
        category: dest.category || 'CAGES',
        description: dest.description || '',
        picUrl: dest.picUrl || '', 
        x: dest.location?.x ?? dest.x,
        y: dest.location?.y ?? dest.y
    });
    
    setIsUpdating(true);
    setShowForm(true);
};

    const handlePointClick = (e, dest) => {
        e.stopPropagation(); // מניעת זליגת הקליק לרקע של המפה
        if (action === 'update') {
            loadDestinationForEditing(dest);
        }
    };

    const handleSelectListChange = (e) => {
        const selectedId = parseInt(e.target.value);
        const dest = destinations.find(d => d.id === selectedId);
        loadDestinationForEditing(dest);
    };

    // 3. שליחת הנתונים המעודכנים (כולל picUrl) לשרת ה-Java
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const payload = new FormData();

        // Ensure these match your DestinationDTO field names exactly
        const dto = {
            name: formData.name,
            category: formData.category,
            description: formData.description
        };

        // Explicitly log what we are sending
        console.log("Sending DTO:", dto);

        const jsonBlob = new Blob([JSON.stringify(dto)], {
            type: 'application/json'
        });

        // Use 'destination' as the key, matching @RequestPart("destination")
        payload.append('destination', jsonBlob);

        if (formData.imageFile) {
            payload.append('file', formData.imageFile);
        }

        if (isUpdating) {
            await destinationService.updateDestination(formData.id, payload);
        } else {
            await destinationService.addDestination(payload);
        }
        
        handleClose();
        if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
        console.error("Submission Error:", err);
        alert(err.message || "שגיאה בשמירת היעד.");
    } finally {
        setLoading(false);
    }
};
    const mountNode = document.querySelector('.app-sidebar') || document.body;

    return (
        <g className="destination-editor-layer">
            
            {/* ה-rect השקוף תופס קליקים אך ורק במצב יצירה, כדי לא לחסום את הנקודות במצב עדכון */}
            {action === 'create' && (
                <rect 
                    width="100" 
                    height="100" 
                    fill="transparent" 
                    onMouseDown={handleMapClick}
                    style={{ cursor: 'crosshair', pointerEvents: 'all' }}
                />
            )}

            {/* רינדור נקודות הלחיצה של היעדים הקיימים במצב Modify */}
            {action === 'update' && destinations.map(dest => {
                const nodeX = dest.location?.x ?? dest.x;
                const nodeY = dest.location?.y ?? dest.y;
                const isSelected = formData.id === dest.id;

                return (
                    <g key={dest.id} className="edit-anchor-group" style={{ cursor: 'pointer' }}>
                        {/* מעגל הרחבת שטח לחיצה שקוף (רדיוס 5) מסביב לנקודה כדי להקל על בחירה עם העכבר */}
                        <circle 
                            cx={nodeX} cy={nodeY} r="5" 
                            fill="transparent" 
                            onMouseDown={(e) => handlePointClick(e, dest)}
                        />
                        {/* טבעת סימון כחולה ליעד שנבחר כרגע לעריכה */}
                        {isSelected && (
                            <circle 
                                cx={nodeX} cy={nodeY} r="3.5" 
                                fill="none" stroke="#0ea5e9" strokeWidth="0.6" 
                            />
                        )}
                        {/* הנקודה הויזואלית עצמה על המפה */}
                        <circle
                            cx={nodeX}
                            cy={nodeY}
                            r="2.2"
                            fill={isSelected ? "#0ea5e9" : "#eab308"}
                            stroke="#ffffff"
                            strokeWidth="0.4"
                            onMouseDown={(e) => handlePointClick(e, dest)}
                        />
                    </g>
                );
            })}

            {/* הזרקת תפריט העריכה והבחירה הצידית לסיידבר באמצעות Portal */}
            {ReactDOM.createPortal(
                <div className="admin-dock-form-container" style={{ position: 'relative', top: '-20px', zIndex: 9999 }}>
                    
                    {/* תפריט בחירה מהיר מהרשימה: מוצג במצב עדכון כל עוד לא נלחץ או נבחר יעד מסוים */}
                    {action === 'update' && !showForm && (
                        <div style={{ padding: '15px', color: '#fff', background: '#1e293b', borderRadius: '8px', marginBottom: '10px' }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>✏️ עריכת יעד קיים</h3>
                            <label style={{ fontSize: '13px', color: '#38bdf8', display: 'block', marginBottom: '5px' }}>
                                בחר יעד מהרשימה (או לחץ על נקודה צהובה במפה):
                            </label>
                            <select 
                                value={formData.id || ''} 
                                onChange={handleSelectListChange}
                                style={{ width: '100%', padding: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }}
                            >
                                <option value="">-- בחר יעד מהרשימה --</option>
                                {destinations.map(d => (
                                    <option key={d.id} value={d.id}>{d.name || `יעד ללא שם (ID: ${d.id})`}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* הצגת טופס הנתונים המעודכן הכולל את שדה ה-picUrl החדש */}
                    {showForm && (
                        <DestinationForm 
                            formData={formData}
                            setFormData={setFormData}
                            categories={categories}
                            handleSubmit={handleSubmit}
                            loading={loading}
                            onCancel={handleClose}
                        />
                    )}
                </div>,
                mountNode
            )}
        </g>
    );
};

export default DestinationEditor;