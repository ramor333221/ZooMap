import React, { useState, useEffect } from 'react';
import { routeService } from '../Api/routeService';
import { destinationService } from '../Api/destinationService';
import RoutePath from './RoutePath';
import DestinationPoint from './DestinationPoint';
import MapEditorManager from './MapEditorManager';
import EditorToolbar from './EditorToolbar'; // הקומפוננטה החדשה
import '../Css/ZooMap.css';

const ZooMap = () => {
    const [routes, setRoutes] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditorActive, setIsEditorActive] = useState(false);

    // ניהול הסטייט של העורך ברמת המפה
    const [editorMode, setEditorMode] = useState('route'); 
    const [editorAction, setEditorAction] = useState('create');

    const fetchMapData = async () => {
        try {
            const [rData, dData] = await Promise.all([
                routeService.getAllRoutes(),
                destinationService.getAllDestinations()
            ]);
            setRoutes(rData);
            setDestinations(dData);
        } catch (err) { 
            console.error("Fetch error:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.role === 'Admin') setIsAdmin(true);
            } catch (e) { setIsAdmin(false); }
        }
        fetchMapData();
    }, []);

    if (loading) return <div className="map-loader">טוען...</div>;

    return (
        <div className={`zoo-map-container ${isEditorActive ? 'editor-active' : ''}`}>
            
            {/* כפתור כניסה למצב עריכה - מחוץ למפה */}
            {isAdmin && (
                <div className="admin-toolbar">
                    <button 
                        className="admin-btn"
                        onClick={() => setIsEditorActive(!isEditorActive)}
                        style={{ backgroundColor: isEditorActive ? '#ff4d4d' : '#4CAF50' }}
                    >
                        {isEditorActive ? "סגור עורך" : "מצב עורך (ניהול מפה)"}
                    </button>
                </div>
            )}

            <div className="map-viewport">
                <div className="map-background"></div>

                {/* הקומפוננטה הנפרדת של הסרגל - HTML */}
                {isAdmin && isEditorActive && (
                    <EditorToolbar 
                        mode={editorMode} 
                        setMode={setEditorMode} 
                        action={editorAction} 
                        setAction={setEditorAction} 
                    />
                )}

                {/* שכבת הגרפיקה - SVG */}
                <svg className="map-svg-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {routes.map(route => <RoutePath key={route.id} route={route} />)}
                    
                    {isAdmin && isEditorActive && (
                        <MapEditorManager 
                            mode={editorMode}
                            action={editorAction}
                            destinations={destinations}
                            onSaveSuccess={() => {
                                fetchMapData();
                                setIsEditorActive(false);
                            }} 
                        />
                    )}
                </svg>
    
                {/* שכבת המרקרים - HTML */}
                <div className="map-markers-layer">
                    {destinations.map(dest => (
                        <DestinationPoint 
                            key={dest.id} 
                            destination={dest} 
                            isEditorActive={isEditorActive}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ZooMap;