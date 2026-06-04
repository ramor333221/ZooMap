import React, { useState } from 'react';
import { routeService } from '../../Api/routeService';
import RouteUpdate from './routeUpdate'; 
import RouteDelete from './RouteDelete'; // Added import for Delete component

const RouteEditor = ({ destinations, action, onSaveSuccess }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState([]);
    const [fromId, setFromId] = useState(null);

    // Common reset logic
    const reset = () => {
        setIsDrawing(false);
        setPoints([]);
        setFromId(null);
    };

    // Canvas click handling (Create mode only)
    const handleCanvasClick = (e) => {
        if (!isDrawing || action !== 'create') return;

        const svg = e.currentTarget.closest('svg');
        const rect = svg.getBoundingClientRect();
        const x = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
        const y = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));

        setPoints(prev => [...prev, { x, y }]);
    };

    // Node click handling (Create mode only)
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
            await routeService.addRoute({
                fromD: fromId,
                toD: toId,
                bodyPoints: finalPoints,
                dist: 0
            });
            alert("Route saved successfully!");
            onSaveSuccess();
        } catch (err) {
            console.error(err);
            alert("Error trying to save the route.");
        }
        reset();
    };

    // Styles
    const activeRoutePreviewColor = "#38bdf8";
    const sourceNodeActiveColor = "#10b981";
    const destinationNodeColor = "rgba(244, 63, 94, 0.25)";

    return (
        <g className="route-editor-container">
            
            {/* 1. Update/Modify Mode */}
            {action === 'update' && (
                <RouteUpdate 
                    destinations={destinations} 
                    onSaveSuccess={onSaveSuccess} 
                />
            )}

            {/* 2. Delete Mode - New Section */}
            {action === 'delete' && (
                <RouteDelete 
                    destinations={destinations} 
                    onDeletionSuccess={onSaveSuccess} 
                />
            )}

            {/* 3. Create Mode */}
            {action === 'create' && (
                <g style={{ pointerEvents: 'all' }} className="route-create-overlay">
                    <rect
                        width="100"
                        height="100"
                        fill="transparent"
                        onMouseDown={handleCanvasClick}
                        style={{ pointerEvents: 'all', cursor: 'crosshair' }}
                    />

                    {isDrawing && (
                        <polyline
                            points={points.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke={activeRoutePreviewColor}
                            className="editor-path-preview"
                            strokeDasharray="1.5,1"
                            style={{
                                filter: 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.45))',
                                transition: 'stroke 0.3s ease'
                            }}
                        />
                    )}

                    {destinations.map(d => {
                        const nodeX = d.location?.x ?? d.x;
                        const nodeY = d.location?.y ?? d.y;
                        const isActiveSource = fromId === d.id;

                        return (
                            <g key={d.id} className={`editor-node-anchor ${isActiveSource ? 'active-source' : ''}`}>
                                <circle
                                    cx={nodeX}
                                    cy={nodeY}
                                    r="4.5"
                                    fill="transparent"
                                    stroke={isActiveSource ? sourceNodeActiveColor : "rgba(244, 63, 94, 0.4)"}
                                    strokeWidth="0.5"
                                    opacity={isActiveSource ? 0.8 : 0}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        transformOrigin: `${nodeX}px ${nodeY}px`,
                                    }}
                                />
                                <circle
                                    cx={nodeX}
                                    cy={nodeY}
                                    r="2.5"
                                    fill={isActiveSource ? sourceNodeActiveColor : destinationNodeColor}
                                    onMouseDown={(e) => handleNodeClick(e, d)}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        filter: isActiveSource ? `drop-shadow(0 0 5px ${sourceNodeActiveColor})` : 'none'
                                    }}
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