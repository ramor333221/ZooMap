import React, { useState, useEffect } from 'react';
import { routeService } from '../Api/routeService';
import { destinationService } from '../Api/destinationService';
import { navigationService } from '../Api/navigationService';
import StatusDisplay from './ErrorDisplay/StatusDisplay';
import RoutePath from './MapDesign/RoutePath';
import DestinationPoint from './MapDesign/DestinationPoint';
import DestinationSelector from './MapDesign/DestinationSelector';
import MapEditorManager from './Editor/MapEditorManager';
import Login from './Login/Login';
import Map3DView from './3DView/Map3DView';
import ChatApp from './Chat/ChatApp';
import '../Scss/App.scss';
import '../Scss/LoginModal.scss';
import '../Scss/Route.scss';


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
    const [appStatus, setAppStatus] = useState(null);

    const toggleEditor = () => {
        if (!isEditorActive) {
            setSelectedTargets([]);
            setOptimizedRoute(null);
        }
        setIsEditorActive(!isEditorActive);
    };

    const toggleTarget = (id) => {
        if (optimizedRoute) setOptimizedRoute(null);
        setSelectedTargets(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleCalculateRoute = async () => {
        if (selectedTargets.length < 2) {
            setAppStatus({ type: 'warning', message: 'Please select at least 2 destinations.', isFatal: false });
            return;
        }
        setIsCalculating(true);
        setAppStatus(null);

        try {
            const selectedDestinationObjects = destinations.filter(d => selectedTargets.includes(d.id));
            const entranceNode = selectedDestinationObjects.find(d => d.name.toLowerCase().includes('entrance'));
            const exitNode = selectedDestinationObjects.find(d => d.name.toLowerCase().includes('exit'));

            const startId = entranceNode ? entranceNode.id : null;
            const endId = exitNode ? exitNode.id : null;
            const data = await navigationService.getOptimizedRoute(selectedTargets, startId, endId);

            setOptimizedRoute(data);
        } catch (err) {
            setAppStatus({ type: 'error', message: 'Unable to calculate route. Server unreachable.', isFatal: false });
        } finally {
            setIsCalculating(false);
        }
    };

    const fetchMapData = async () => {
        setLoading(true);
        setAppStatus(null);
        try {
            const [rData, dData] = await Promise.all([
                routeService.getAllRoutes(),
                destinationService.getAllDestinations()
            ]);
            setRoutes(rData);
            setDestinations(dData);
        } catch (err) {
            setAppStatus({ type: 'error', message: 'Failed to load map data. Server unreachable.', isFatal: true });
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

    if (loading && !appStatus) {
        return (
            <div className="map-loader-container" style={{ backgroundColor: 'black', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="futuristic-spinner"></div>
            </div>
        );
    }

    if (appStatus?.isFatal) {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
                <StatusDisplay type="error" message={appStatus.message} onRetry={fetchMapData} />
            </div>
        );
    }

    return (
        <>
            <div className={`zoo-app-layout ${isEditorActive ? 'admin-editor-active' : ''}`}>
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
                            <div className="admin-editor-sidebar-content">
                                <div id="editor-sidebar-portal-root"></div>
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
                                <button className={`btn-admin-panel ${isEditorActive ? 'active' : ''}`} onClick={toggleEditor}>
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

                <div className="center-viewport-container">
                    {appStatus && !appStatus.isFatal && (
                        <StatusDisplay type={appStatus.type} message={appStatus.message} onRetry={appStatus.type === 'error' ? fetchMapData : null} />
                    )}

                    <div className="view-mode-controls">
                        <button className={`btn-view ${viewMode === '2D' ? 'active' : ''}`} onClick={() => setViewMode('2D')}>🗺️ 2D Map</button>
                        <button className={`btn-view ${viewMode === '3D' ? 'active' : ''}`} onClick={() => setViewMode('3D')}>🧊 3D Simulation</button>
                    </div>

                    <main className="zoo-map-main-area">
                        {viewMode === '2D' ? (
                            <div className="map-viewport">
                                <div className="map-terrain-base"></div>
                                <div className="map-background-image"><img src="./mapBackground.png" alt="Map Design" /></div>
                                <div className="map-grid-overlay"></div>

                                <svg className="map-svg-layer" viewBox="0 0 100 100" preserveAspectRatio="none">                                    {routes.map(route => (
                                    <RoutePath key={`static-${route.id}`} route={route} isDimmed={!!optimizedRoute} />
                                ))}
                                    {optimizedRoute && optimizedRoute.pathEdges.map((edge, index) => (
                                        <RoutePath key={`opt-${index}-${edge.id || 'edge'}`} route={edge} isOptimized={true} />
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
                            <Map3DView routes={routes} destinations={destinations} optimizedRoute={optimizedRoute} />
                        )}
                    </main>
                </div>
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