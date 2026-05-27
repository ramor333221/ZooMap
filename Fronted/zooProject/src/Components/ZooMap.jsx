import React, { useState, useEffect } from 'react';
import { routeService } from '../Api/routeService';
import { destinationService } from '../Api/destinationService';
import { navigationService } from '../Api/navigationService';
import RoutePath from './RoutePath';
import DestinationPoint from './DestinationPoint';
import DestinationSelector from './DestinationSelector';
import MapEditorManager from './MapEditorManager'; 
import Login from './Login'; 
import Map3DView from './3DView/Map3DView';
import ChatApp from './Chat/ChatApp'
import '../Scss/App.scss';
import '../Scss/LoginModal.scss';

const ZooMap = () => {
    const [routes, setRoutes] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditorActive, setIsEditorActive] = useState(false);
    const [selectedTargets, setSelectedTargets] = useState([]);
    const [optimizedRoute, setOptimizedRoute] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [viewMode, setViewMode] = useState('2D');

    // הסרנו מכאן את ה-useEffect הישן של ה-Client ואת ה-states של ה-chatMessages

    const toggleTarget = (id) => {
        if (optimizedRoute) setOptimizedRoute(null);
        setSelectedTargets(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleCalculateRoute = async () => {
        if (selectedTargets.length < 2) return;
        setIsCalculating(true);
        try {
            const data = await navigationService.getOptimizedRoute(selectedTargets);
            setOptimizedRoute(data);
        } catch (err) {
            alert("Unable to calculate route.");
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
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const checkAdminAuth = () => {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.role === 'Admin') setIsAdmin(true);
            } catch (e) { setIsAdmin(false); }
        }
    };

    useEffect(() => {
        checkAdminAuth();
        fetchMapData();
    }, []);

    const handleLoginSuccess = () => {
        checkAdminAuth();
        setIsEditorActive(true);
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
        setIsAdmin(false);
        setIsEditorActive(false);
    };

    if (loading) return <div className="map-loader-container"><div className="futuristic-spinner"></div></div>;

    return (
        <>
            <div className={`zoo-app-layout ${isEditorActive ? 'admin-editor-active' : ''}`}>
                
                {/* LEFT PANEL */}
                <aside className="app-sidebar">
                    <div className="sidebar-scrollable-container">
                        <div className="brand-header">
                            <span className="brand-logo">🦁</span>
                            <div className="brand-title">
                                <h2>ZooNavigator</h2>
                                <span>Interactive Mapping</span>
                            </div>
                        </div>

                        {!isEditorActive ? (
                            <DestinationSelector
                                destinations={destinations}
                                selectedTargets={selectedTargets}
                                onToggle={toggleTarget}
                                onCalculate={handleCalculateRoute}
                                isCalculating={isCalculating}
                            />
                        ) : (
                            <div className="editor-sidebar-notice">
                                <h3>Editor Panel</h3>
                                <p>Interact with map vectors to update configurations.</p>
                            </div>
                        )}

                        {optimizedRoute && (
                            <div className="navigation-panel">
                                <div className="panel-header">
                                    <span className="badge">FASTEST PATH</span>
                                    <h3>Route ({optimizedRoute.totalDistance.toFixed(1)} m)</h3>
                                </div>
                                <div className="steps-container">
                                    {optimizedRoute.stops.map((stop, index) => (
                                        <div key={index} className="step-item">
                                            <span className="step-badge">{index + 1}</span>
                                            <span className="step-name">{stop.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="sidebar-footer">
                        {isAdmin ? (
                            <div className="admin-controls-stack">
                                <button className={`btn-admin-panel ${isEditorActive ? 'active' : ''}`} onClick={() => setIsEditorActive(!isEditorActive)}>
                                    🛡️ {isEditorActive ? "Exit Editor" : "Admin Panel"}
                                </button>
                                <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
                            </div>
                        ) : (
                            <button className="btn-admin-login-trigger" onClick={() => setShowLoginModal(true)}>
                                🔑 Admin Login
                            </button>
                        )}
                    </div>
                </aside>

                {/* CENTER PANEL */}
                <div className="center-viewport-container">
                    <div className="view-mode-controls">
                        <button className={`btn-view ${viewMode === '2D' ? 'active' : ''}`} onClick={() => setViewMode('2D')}>
                            🗺️ 2D Map
                        </button>
                        <button className={`btn-view ${viewMode === '3D' ? 'active' : ''}`} onClick={() => setViewMode('3D')}>
                            🧊 3D Simulation
                        </button>
                    </div>

                    <main className="zoo-map-main-area">
                        {viewMode === '2D' ? (
                            <div className="map-viewport">
                                <div className="map-terrain-base"></div>
                                <div className="map-background-image">
                                    <img src="./mapBackground.png" alt="Map Design" />
                                </div>
                                <div className="map-grid-overlay"></div>

                                <svg className="map-svg-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {routes.map(route => (
                                        <RoutePath key={`static-${route.id}`} route={route} isDimmed={!!optimizedRoute} />
                                    ))}
                                    {/* שימוש באינדקס במידת הצורך למניעת התנגשות מפתחות */}
                                    {optimizedRoute && optimizedRoute.pathEdges.map((edge, index) => (
                                        <RoutePath key={`opt-${index}-${edge.id || 'edge'}`} route={edge} isHighlighted={true} />
                                    ))}
                                    {isAdmin && isEditorActive && (
                                        <MapEditorManager destinations={destinations} onSaveSuccess={fetchMapData} />
                                    )}
                                </svg>

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
                        ) : (
                            <Map3DView 
                            routes={routes} 
                            destinations={destinations} 
                            optimizedRoute={optimizedRoute} 
                        />
                        )}
                    </main>
                </div>

                {/* RIGHT PANEL - 2. קריאה ישירה לקומפוננטת הצ'אט החדשה והמתוקנת */}
                <ChatApp />

            </div>

            {showLoginModal && (
                <div className="login-modal-overlay" onClick={() => setShowLoginModal(false)}>
                    <div className="login-card" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setShowLoginModal(false)}>×</button>
                        <Login onLoginSuccess={handleLoginSuccess} onClose={() => setShowLoginModal(false)} />
                    </div>
                </div>
            )}
        </>
    );
};

export default ZooMap;