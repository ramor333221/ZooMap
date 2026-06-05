import React, { useState, useEffect } from 'react';
import { routeService } from '../../Api/routeService';
import RouteDeleteForm from './RouteDeleteForm';

const RouteDelete = ({ destinations = [], onDeletionSuccess }) => {
    const [localRoutes, setLocalRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadRoutes();
    }, []);

    const loadRoutes = async () => {
        try {
            const response = await routeService.getAllRoutes();
            const data = response.data || response;
            setLocalRoutes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error loading routes:", err);
            setLocalRoutes([]);
        }
    };

    const handleSelectRoute = (id) => {
        const found = localRoutes.find(r => r.id === parseInt(id));
        setSelectedRoute(found || null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedRoute?.id) return;
        
        setIsLoading(true);
        try {
            const response = await routeService.deleteRoute(selectedRoute.id);
            
            // Success case
            alert(response.message || "Route deleted successfully!");
            
            setSelectedRoute(null);
            await loadRoutes();
            if (onDeletionSuccess) onDeletionSuccess();
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to delete the route.";
            alert(errorMessage); 
        } finally {
            setIsLoading(false);
        }
    };

    const getDestinationName = (id) => {
        const match = destinations.find(d => d.id === parseInt(id));
        return match ? match.name : `ID: ${id}`;
    };

    return (
        <g className="route-delete-layer">
            {localRoutes.map(route => {
                if (!route.bodyPoints || route.bodyPoints.length < 2) return null;
                
                // Filter out any null or undefined points to prevent the runtime crash
                const validPoints = route.bodyPoints.filter(p => p && typeof p.x === 'number' && typeof p.y === 'number');
                
                // Ensure we still have at least 2 valid points to render a meaningful path
                if (validPoints.length < 2) return null;

                const pathData = validPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                
                return (
                    <g key={`del-${route.id}`} onClick={() => handleSelectRoute(route.id)} style={{ cursor: 'pointer' }}>
                        {/* Invisible thicker path to make clicking easier */}
                        <path d={pathData} fill="none" stroke="transparent" strokeWidth="10" />
                        {/* Visible styled path */}
                        <path d={pathData} fill="none" stroke={selectedRoute?.id === route.id ? "#ef4444" : "#94a3b8"} strokeWidth="2" />
                    </g>
                );
            })}

            <RouteDeleteForm 
                selectedRoute={selectedRoute}
                localRoutes={localRoutes}
                isLoading={isLoading}
                getDestinationName={getDestinationName}
                onSelectRoute={handleSelectRoute}
                onConfirmDelete={handleConfirmDelete}
                onCancel={() => setSelectedRoute(null)}
            />
        </g>
    );
};

export default RouteDelete;