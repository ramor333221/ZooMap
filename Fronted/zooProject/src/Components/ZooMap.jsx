import React, { useState, useEffect } from 'react';
import { routeService } from '../Api/routeService';
import { destinationService } from '../Api/destinationService';
import RoutePath from './RoutePath';
import DestinationPoint from './DestinationPoint';
import MapEditorManager from './MapEditorManager';
import '../Scss/main.scss';

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
        <div className="zoo-dashboard">
            <div className="map-main-content">
                
                {/* --- Admin Toggle Bar --- */}
                {isAdmin && (
                    <div className="admin-toolbar">
                        <span className="status-badge">
                            {isEditorActive ? "מצב עריכה" : "תצוגת מבקר"}
                        </span>
                        <button 
                            className={`admin-btn ${isEditorActive ? 'active' : ''}`}
                            onClick={() => setIsEditorActive(!isEditorActive)}
                        >
                            {isEditorActive ? "יציאה מעריכה" : "ניהול מפה"}
                        </button>
                    </div>
                )}

                <div className={`zoo-map-container ${isEditorActive ? 'editor-active' : ''}`}>
                    <div className="map-viewport">
                        {/* 1. שכבת רקע (תמונה/צבע) */}
                        <div className="map-background"></div>

                        {/* 2. שכבת ה-SVG (מסלולים ועורך) */}
                        <svg className="map-svg-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* תצוגת מבקר: מסלולים */}
                            {routes.map(route => (
                                <RoutePath key={route.id} route={route} />
                            ))}
                            
                            {/* ניהול מפה: טוען את המנהל רק אם העורך פעיל */}
                            {isAdmin && isEditorActive && (
                                <MapEditorManager 
                                    destinations={destinations}
                                    onSaveSuccess={fetchMapData} 
                                />
                            )}
                        </svg>

                        {/* 3. שכבת המרקרים (HTML/Divs) */}
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
            </div>
        </div>
    );
};

export default ZooMap;