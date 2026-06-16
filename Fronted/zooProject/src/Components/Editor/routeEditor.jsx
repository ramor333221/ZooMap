import React, { useState } from 'react';
import { useAddRouteMutation } from '../../Api/routeApi';
import RouteUpdate from './RouteUpdate';
import RouteDelete from './RouteDelete';

const RouteEditor = ({ destinations, action, onSaveSuccess }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState([]);
    const [fromId, setFromId] = useState(null);

    const [addRoute] = useAddRouteMutation();

    const reset = () => {
        setIsDrawing(false);
        setPoints([]);
        setFromId(null);
    };

    const handleCanvasClick = (e) => {
        if (!isDrawing || action !== 'create') return;

        const svg = e.currentTarget.closest('svg');
        const rect = svg.getBoundingClientRect();

        const x = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
        const y = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));

        setPoints(prev => [...prev, { x, y }]);
    };

    const handleNodeClick = (e, dest) => {
        if (action !== 'create') return;
        e.stopPropagation();

        const x = dest.location?.x ?? dest.x;
        const y = dest.location?.y ?? dest.y;

        if (!isDrawing) {
            setIsDrawing(true);
            setFromId(dest.id);
            setPoints([{ x, y }]);
        } else {
            if (dest.id === fromId) return reset();
            saveRoute(dest.id, x, y);
        }
    };

    const saveRoute = async (toId, lastX, lastY) => {
        const finalPoints = [...points, { x: lastX, y: lastY }];

        try {
            await addRoute({
                fromD: fromId,
                toD: toId,
                bodyPoints: finalPoints,
                dist: 0
            }).unwrap();

            alert("Route saved successfully!");
            onSaveSuccess?.();
        } catch (err) {
            alert("Error trying to save the route: " + (err?.data?.message || err.message));
        }

        reset();
    };

    const activeRoutePreviewColor = "#38bdf8";
    const sourceNodeActiveColor = "#10b981";
    const destinationNodeColor = "rgba(244, 63, 94, 0.25)";

    return (
        <g className="route-editor-container">

            {action === 'update' && (
                <RouteUpdate
                    destinations={destinations}
                    onSaveSuccess={onSaveSuccess}
                />
            )}

            {action === 'delete' && (
                <RouteDelete
                    destinations={destinations}
                    onDeletionSuccess={onSaveSuccess}
                />
            )}

            {action === 'create' && (
                <g className="route-create-overlay" style={{ pointerEvents: 'all' }}>
                    <rect
                        width="100"
                        height="100"
                        fill="transparent"
                        onMouseDown={handleCanvasClick}
                        style={{ cursor: 'crosshair' }}
                    />

                    {isDrawing && (
                        <polyline
                            points={points.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke={activeRoutePreviewColor}
                            strokeDasharray="1.5,1"
                            style={{
                                filter: 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.45))'
                            }}
                        />
                    )}

                    {destinations.map(d => {
                        const nodeX = d.location?.x ?? d.x;
                        const nodeY = d.location?.y ?? d.y;
                        const isActiveSource = fromId === d.id;

                        return (
                            <g key={d.id}>
                                <circle
                                    cx={nodeX}
                                    cy={nodeY}
                                    r="4.5"
                                    fill="transparent"
                                    stroke={isActiveSource ? sourceNodeActiveColor : "rgba(244, 63, 94, 0.4)"}
                                    opacity={isActiveSource ? 0.8 : 0}
                                />

                                <circle
                                    cx={nodeX}
                                    cy={nodeY}
                                    r="2.5"
                                    fill={isActiveSource ? sourceNodeActiveColor : destinationNodeColor}
                                    onMouseDown={(e) => handleNodeClick(e, d)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </g>
                        );
                    })}
                </g>
            )}

        </g>
    );
};

export default RouteEditor;