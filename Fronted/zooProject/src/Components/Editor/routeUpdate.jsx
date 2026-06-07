import React, { useState, useEffect } from 'react';
import { routeService } from '../../Api/routeService';
import RouteUpdateForm from './RouteUpdateForm';

const RouteUpdate = ({ destinations = [], onSaveSuccess }) => {
    const [localRoutes, setLocalRoutes] = useState([]);
    const [bodyPoints, setBodyPoints] = useState([]);
    const [fromD, setFromD] = useState('');
    const [toD, setToD] = useState('');
    const [routeId, setRouteId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchRoutesFromDB();
    }, []);

    const fetchRoutesFromDB = async () => {
        setIsLoading(true);
        try {
            const response = await routeService.getAllRoutes();
            const data = response.data || response;
            if (Array.isArray(data)) setLocalRoutes(data);
        } catch (err) {
            setErrorMessage("❌ Failed to load routes from server");
        } finally {
            setIsLoading(false);
        }
    };

    const getDestinationName = (id) => {
        const match = destinations.find(d => d.id === parseInt(id));
        return match ? match.name : `ID: ${id}`;
    };

    const loadRouteForEditing = (route) => {
        if (!route) return resetForm();
        const startDest = destinations.find(d => d.id === parseInt(route.fromD));
        const startPos = startDest ? (startDest.location || { x: startDest.x, y: startDest.y }) : null;

        setRouteId(route.id);
        setFromD(route.fromD);
        setToD(route.toD);
        setBodyPoints(startPos ? [startPos] : []); 
        setErrorMessage("");
        setSuccessMessage(`Editing: ${getDestinationName(route.fromD)} → ${getDestinationName(route.toD)}`);
    };

    const resetForm = () => {
        setRouteId(null);
        setFromD('');
        setToD('');
        setBodyPoints([]);
        setSuccessMessage("");
    };

    const handleMapClick = (e) => {
        if (!routeId) {
            setErrorMessage("⚠️ Please select a route before drawing.");
            return;
        }
        const svg = e.currentTarget.closest('svg');
        const rect = svg.getBoundingClientRect();
        const newPoint = {
            x: parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(2)),
            y: parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(2))
        };
        setErrorMessage("");
        setBodyPoints([...bodyPoints, newPoint]);
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        if (!routeId) return;

        const routeDTO = { fromD: parseInt(fromD), toD: parseInt(toD), bodyPoints };

        try {
            await routeService.updateRoute(routeId, routeDTO);
            setSuccessMessage("✅ Route updated successfully!");
            fetchRoutesFromDB(); 
            if (onSaveSuccess) onSaveSuccess();
        } catch (err) {
            setErrorMessage(`❌ Update error: ${err.message}`);
        }
    };

    return (
        <g className="route-update-layer">
            {localRoutes.map(route => {
                if (!route.bodyPoints || route.bodyPoints.length < 2) return null;
                const pathData = route.bodyPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const isCurrent = route.id === routeId;

                return (
                    <g key={`update-path-${route.id}`} onClick={() => loadRouteForEditing(route)} style={{ cursor: 'pointer' }}>
                        <path d={pathData} fill="none" stroke="transparent" strokeWidth="8" />
                        <path 
                            d={pathData} 
                            fill="none" 
                            stroke={isCurrent ? "#0ea5e9" : "#f43f5e"} 
                            strokeWidth={isCurrent ? "4" : "2"} 
                            strokeDasharray={isCurrent ? "none" : "3,3"}
                            opacity={routeId && !isCurrent ? "0.2" : "0.7"}
                        />
                    </g>
                );
            })}

            <rect 
                width="100" height="100" fill="transparent" 
                onMouseDown={handleMapClick}
                style={{ cursor: routeId ? 'crosshair' : 'default', pointerEvents: routeId ? 'all' : 'none' }} 
            />

            {bodyPoints.length > 0 && (
                <path 
                    d={bodyPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                    fill="none" stroke="#0ea5e9" strokeWidth="2.5" 
                />
            )}

            <RouteUpdateForm 
                routeId={routeId}
                localRoutes={localRoutes}
                fromD={fromD}
                toD={toD}
                errorMessage={errorMessage}
                successMessage={successMessage}
                getDestinationName={getDestinationName}
                loadRouteForEditing={loadRouteForEditing}
                handleUpdate={handleUpdate}
                resetForm={resetForm}
            />
        </g>
    );
};

export default RouteUpdate;