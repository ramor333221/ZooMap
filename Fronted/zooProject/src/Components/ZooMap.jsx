import React, { useState, useEffect } from 'react';
import { routeService } from '../Api/routeService';
import { destinationService } from '../Api/destinationService';
import RoutePath from './RoutePath';
import DestinationPoint from './DestinationPoint';
import RouteDrawingLayer from './RouteDrawingLayer';
import '../Css/ZooMap.css';

const ZooMap = () => {
    const [routes, setRoutes] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditorActive, setIsEditorActive] = useState(false);

    const fetchMapData = async () => {
        try {
            const [rData, dData] = await Promise.all([
                routeService.getAllRoutes(),
                destinationService.getAllDestinations()
            ]);
            setRoutes(rData);
            setDestinations(dData);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
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
            {isAdmin && (
                <div className="admin-toolbar">
                    <button 
                        className="admin-btn"
                        onClick={() => setIsEditorActive(!isEditorActive)}
                        style={{ backgroundColor: isEditorActive ? '#ff4d4d' : '#4CAF50' }}
                    >
                        {isEditorActive ? "סגור עורך" : "מצב עורך (הוספת מסלול)"}
                    </button>
                    {isEditorActive && <span className="status-badge">📍 מצב עריכה פעיל: לחץ על חיה להתחלה</span>}
                </div>
            )}
    
            <div className="map-viewport">
                {/* רקע המפה */}
                <div className="map-background"></div>

                {/* שכבת ה-SVG - עכשיו מקבלת אירועי עכבר בצורה מלאה */}
                <svg className="map-svg-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {routes.map(route => <RoutePath key={route.id} route={route} />)}
                    
                    {isAdmin && isEditorActive && (
                        <RouteDrawingLayer 
                            onSaveSuccess={() => {
                                fetchMapData();
                                setIsEditorActive(false);
                            }} 
                            destinations={destinations} 
                        />
                    )}
                </svg>
    
                {/* שכבת המרקרים - מעבירים את isEditorActive */}
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