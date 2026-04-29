import React, { useState, useEffect } from 'react';
import { routeService } from '../Api/routeService';
import { destinationService } from '../Api/destinationService';
import {navigationService} from '../Api/navigationService';
import RoutePath from './RoutePath';
import DestinationPoint from './DestinationPoint';
import DestinationSelector from './DestinationSelector';
import RouteDrawingLayer from './RouteDrawingLayer';
import '../Scss/ZooMap.scss';

const ZooMap = () => {
    const [routes, setRoutes] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditorActive, setIsEditorActive] = useState(false);
    
    // States לניווט מבקרים
    const [selectedTargets, setSelectedTargets] = useState([]); 
    const [optimizedRoute, setOptimizedRoute] = useState(null); 
    const [isCalculating, setIsCalculating] = useState(false);

    const toggleTarget = (id) => {
        // אם כבר יש מסלול מחושב, לחיצה חדשה תאפס אותו כדי להתחיל בחירה מחדש
        if (optimizedRoute) setOptimizedRoute(null);
        
        setSelectedTargets(prev => 
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    // פונקציה לשליחת ה-IDs ל-Backend לחישוב TSP + Dijkstra
    const handleCalculateRoute = async () => {
    if (selectedTargets.length < 2) return;
    
    setIsCalculating(true);
    try {
        // שימוש ב-Service במקום ב-axios
        const data = await navigationService.getOptimizedRoute(selectedTargets);
        setOptimizedRoute(data);
    } catch (err) {
        console.error("Error calculating best route:", err);
        alert("לא ניתן לחשב מסלול. וודא שיש מסלולים מחברים בין כל הנקודות.");
    } finally {
        setIsCalculating(false);
    }
};

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
        <div className="zoo-app-layout">
            {/* 1. סרגל צד - בחירה מרשימה (מופיע רק למבקר) */}
            {!isEditorActive && (
                <DestinationSelector 
                    destinations={destinations}
                    selectedTargets={selectedTargets}
                    onToggle={toggleTarget}
                    onCalculate={handleCalculateRoute}
                    isCalculating={isCalculating}
                />
            )}

            {/* 2. האזור המרכזי - מפה ופקדים */}
            <div className={`zoo-map-main-area ${isEditorActive ? 'editor-active' : ''}`}>
                
                {/* פקדי ניהול (אדמין) */}
                <div className="map-controls">
                    {isAdmin && (
                        <button 
                            className="admin-btn"
                            onClick={() => setIsEditorActive(!isEditorActive)}
                            style={{ backgroundColor: isEditorActive ? '#ff4d4d' : '#4CAF50' }}
                        >
                            {isEditorActive ? "סגור עורך" : "מצב עורך (הוספת מסלול)"}
                        </button>
                    )}
                </div>

                <div className="map-viewport">
                    <div className="map-background"></div>

                    {/* שכבת ה-SVG: מסלולים */}
                    <svg className="map-svg-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {routes.map(route => (
                            <RoutePath 
                                key={route.id} 
                                route={route} 
                                isDimmed={!!optimizedRoute} 
                            />
                        ))}
                        
                        {optimizedRoute && optimizedRoute.pathEdges.map(edge => (
                            <RoutePath 
                                key={`opt-${edge.id}`} 
                                route={edge} 
                                isHighlighted={true} 
                            />
                        ))}
                        
                        {isAdmin && isEditorActive && (
                            <RouteDrawingLayer 
                                onSaveSuccess={() => { fetchMapData(); setIsEditorActive(false); }} 
                                destinations={destinations} 
                            />
                        )}
                    </svg>

                    {/* שכבת הנעצים: בחירה ויזואלית מהמפה */}
                    <div className="map-markers-layer">
                        {destinations.map(dest => (
                            <DestinationPoint 
                                key={dest.id} 
                                destination={dest} 
                                isEditorActive={isEditorActive}
                                isSelected={selectedTargets.includes(dest.id)}
                                onClick={() => !isEditorActive && toggleTarget(dest.id)} 
                            />
                        ))}
                    </div>
                </div>

                {/* הוראות הגעה (מופיע בתחתית המפה לאחר חישוב) */}
                {optimizedRoute && (
                    <div className="navigation-panel">
                        <h3>🚩 הוראות הגעה ({optimizedRoute.totalDistance.toFixed(1)} מ'):</h3>
                        <div className="steps-container">
                            {optimizedRoute.stops.map((stop, index) => (
                                <div key={index} className="step-item">
                                    <span className="step-number">{index + 1}</span>
                                    <span className="step-name">{stop.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ZooMap;