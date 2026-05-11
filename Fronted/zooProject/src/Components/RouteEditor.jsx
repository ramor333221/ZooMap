import React, { useState } from 'react';
import { routeService } from '../Api/routeService';

const RouteEditor = ({ destinations, action, onSaveSuccess }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState([]);
    const [fromId, setFromId] = useState(null);

    const handleCanvasClick = (e) => {
        if (!isDrawing || action !== 'create') return;

        const svg = e.currentTarget.closest('svg');
        const rect = svg.getBoundingClientRect();
        const x = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
        const y = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));

        setPoints(prev => [...prev, { x, y }]);
    };

    const handleNodeClick = (e, dest) => {
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

    const reset = () => {
        setIsDrawing(false);
        setPoints([]);
        setFromId(null);
    };

    // Styling definitions matching our dark tech/admin palette
    const activeRoutePreviewColor = "#38bdf8"; // Cyan blue for active vector drawing
    const sourceNodeActiveColor = "#10b981";    // Cyber emerald green for active starting node
    const destinationNodeColor = "rgba(244, 63, 94, 0.25)"; // Glowing subtle Admin Coral for connectable target points

    return (
        <g style={{ pointerEvents: 'all' }} className="route-editor-overlay"> 
            {/* Clickable vector canvas background capture area */}
            <rect 
                width="100" 
                height="100" 
                fill="transparent" 
                onMouseDown={handleCanvasClick} 
                style={{ pointerEvents: 'all', cursor: 'crosshair' }} 
            />

            {/* Dynamic line showing path vector construction in progress */}
            {isDrawing && (
                <polyline 
                    points={points.map(p => `${p.x},${p.y}`).join(' ')} 
                    fill="none" 
                    stroke={activeRoutePreviewColor} 
                    strokeWidth="1.2" 
                    strokeDasharray="1.5,1" 
                    style={{
                        filter: 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.45))',
                        transition: 'stroke 0.3s ease'
                    }}
                />
            )}

            {/* Editor Interactive Target Circles */}
            {destinations.map(d => {
                const nodeX = d.location?.x ?? d.x;
                const nodeY = d.location?.y ?? d.y;
                const isActiveSource = fromId === d.id;

                return (
                    <g key={d.id} className={`editor-node-anchor ${isActiveSource ? 'active-source' : ''}`}>
                        {/* Outer interactive helper ring on hover */}
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
                            className="anchor-outer-ring"
                        />
                        
                        {/* Core vector node marker */}
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
    );
};

export default RouteEditor;