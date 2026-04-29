
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
            alert("המסלול נשמר!");
            onSaveSuccess();
        } catch (err) { console.error(err); }
        reset();
    };

    const reset = () => {
        setIsDrawing(false);
        setPoints([]);
        setFromId(null);
    };

    return (
            <g style={{ pointerEvents: 'all' }}> 
    <rect 
        width="100" 
        height="100" 
        fill="transparent" 
        onMouseDown={handleCanvasClick} 
        style={{ pointerEvents: 'all', cursor: 'crosshair' }} // הוספת pointer-events
    />
            {isDrawing && (
                <polyline 
                    points={points.map(p => `${p.x},${p.y}`).join(' ')} 
                    fill="none" stroke="#FFD700" strokeWidth="1" strokeDasharray="2,1" 
                />
            )}
            {destinations.map(d => (
                <circle 
                    key={d.id} cx={d.location?.x ?? d.x} cy={d.location?.y ?? d.y} r="3" 
                    fill={fromId === d.id ? "green" : "rgba(255,0,0,0.2)"}
                    onMouseDown={(e) => handleNodeClick(e, d)}
                    style={{ cursor: 'pointer' }}
                />
            ))}
        </g>
    );
};

export default RouteEditor;

