import React, { useState, useEffect } from 'react';
import { useGetAllRoutesQuery } from '../Api/routeApi';
import { useGetAllDestinationsQuery } from '../Api/destinationApi';
import { useGetOptimizedRouteMutation } from '../Api/navigationApi';

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
    const { 
        data: routes = [], 
        isLoading: isRoutesLoading, 
        error: routesError, 
        refetch: refetchRoutes 
    } = useGetAllRoutesQuery();

    const { 
        data: destinations = [], 
        isLoading: isDestinationsLoading, 
        error: destinationsError, 
        refetch: refetchDestinations 
    } = useGetAllDestinationsQuery();

    const [getOptimizedRoute, { isLoading: isCalculating }] = useGetOptimizedRouteMutation();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditorActive, setIsEditorActive] = useState(false);
    const [selectedTargets, setSelectedTargets] = useState([]);
    const [optimizedRoute, setOptimizedRoute] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [viewMode, setViewMode] = useState('2D');
    const [appStatus, setAppStatus] = useState(null);

    const loading = isRoutesLoading || isDestinationsLoading;
    const hasFetchError = routesError || destinationsError;

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
            setAppStatus({
                type: 'warning',
                message: 'Please select at least 2 destinations.',
                isFatal: false
            });
            return;
        }

        setAppStatus(null);

        try {
            const selectedDestinationObjects = destinations.filter(d =>
                selectedTargets.includes(d.id)
            );

            const entranceNode = selectedDestinationObjects.find(d =>
                d.name?.toLowerCase().includes('entrance')
            );

            const exitNode = selectedDestinationObjects.find(d =>
                d.name?.toLowerCase().includes('exit')
            );

            const startId = entranceNode ? entranceNode.id : null;
            const endId = exitNode ? exitNode.id : null;

            const data = await getOptimizedRoute({
                selectedIds: selectedTargets,
                startId,
                endId
            }).unwrap();

            setOptimizedRoute(data);
        } catch (err) {
            setAppStatus({
                type: 'error',
                message: 'Unable to calculate route. Server unreachable.',
                isFatal: false
            });
        }
    };

    const handleRetryFetch = () => {
        setAppStatus(null);
        refetchRoutes();
        refetchDestinations();
    };

    const checkAdminAuth = () => {
        const token =
            localStorage.getItem('token') ||
            localStorage.getItem('auth_token');

        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role === 'Admin') setIsAdmin(true);
        } catch {
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        checkAdminAuth();
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

    if (loading && !appStatus && !hasFetchError) {
        return (
            <div className="map-loader-container">
                <div className="futuristic-spinner" />
            </div>
        );
    }

    if (hasFetchError || appStatus?.isFatal) {
        return (
            <div className="fatal-error-screen">
                <StatusDisplay
                    type="error"
                    message={appStatus?.message || 'Failed to load map data'}
                    onRetry={handleRetryFetch}
                />
            </div>
        );
    }

    return (
        <>
            <div className={`zoo-app-layout ${isEditorActive ? 'admin-editor-active' : ''}`}>
                <aside className="app-sidebar">
                    <div className="sidebar-scrollable-container">

                        {!isEditorActive ? (
                            <DestinationSelector
                                destinations={destinations}
                                selectedTargets={selectedTargets}
                                onToggle={toggleTarget}
                                onCalculate={handleCalculateRoute}
                                isCalculating={isCalculating}
                            />
                        ) : (
                            <div className="admin-editor-sidebar-content" />
                        )}

                        {optimizedRoute && (
                            <div className="navigation-panel">
                                <h3>
                                    Route ({optimizedRoute.totalDistance?.toFixed(1)} m)
                                </h3>

                                {optimizedRoute.stops?.map((stop, i) => (
                                    <div key={i} className="step-item">
                                        <span>{i + 1}</span>
                                        <span>{stop.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="sidebar-footer">
                        {isAdmin ? (
                            <>
                                <button onClick={() => setIsEditorActive(v => !v)}>
                                    {isEditorActive ? 'Exit Editor' : 'Admin Panel'}
                                </button>
                                <button onClick={handleLogout}>Sign Out</button>
                            </>
                        ) : (
                            <button onClick={() => setShowLoginModal(true)}>
                                Admin Login
                            </button>
                        )}
                    </div>
                </aside>

                <div className="center-viewport-container">

                    <div className="view-mode-controls">
                        <button onClick={() => setViewMode('2D')}>2D</button>
                        <button onClick={() => setViewMode('3D')}>3D</button>
                    </div>

                    <main className="zoo-map-main-area">

                        {viewMode === '2D' ? (
                            <svg className="map-svg-layer" viewBox="0 0 100 100">

                                {routes.map(route => (
                                    <RoutePath key={route.id} route={route} />
                                ))}

                                {optimizedRoute?.pathEdges?.map((edge, i) => (
                                    <RoutePath key={i} route={edge} isOptimized />
                                ))}

                                {isAdmin && isEditorActive && (
                                    <MapEditorManager
                                        destinations={destinations}
                                        onSaveSuccess={handleRetryFetch}
                                    />
                                )}
                            </svg>
                        ) : (
                            <Map3DView
                                routes={routes}
                                destinations={destinations}
                                optimizedRoute={optimizedRoute}
                            />
                        )}

                        <div className="map-markers-layer">
                            {destinations.map(dest => (
                                <DestinationPoint
                                    key={dest.id}
                                    destination={dest}
                                    isSelected={selectedTargets.includes(dest.id)}
                                    onClick={() => toggleTarget(dest.id)}
                                />
                            ))}
                        </div>

                    </main>
                </div>

                <ChatApp />
            </div>

            {showLoginModal && (
                <div
                    className="login-modal-overlay"
                    onClick={() => setShowLoginModal(false)}
                >
                    <div onClick={e => e.stopPropagation()}>
                        <Login onLoginSuccess={handleLoginSuccess} />
                    </div>
                </div>
            )}
        </>
    );
};

export default ZooMap;