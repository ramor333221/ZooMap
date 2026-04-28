// import React, { useState, useEffect } from 'react';
// import { routeService } from '../Api/routeService';

// const RouteEditor = ({ destinations, onSaveSuccess }) => {
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [points, setPoints] = useState([]);
//     const [fromId, setFromId] = useState(null);

//     useEffect(() => {
//         console.log("Editor State:", { isDrawing, pointsCount: points.length, fromId });
//     }, [isDrawing, points, fromId]);

//     const handleCanvasClick = (e) => {
//         if (!isDrawing) {
//             console.log("Click ignored - start by clicking an animal first");
//             return;
//         }

//         // חישוב מיקום מדויק בתוך ה-SVG (0-100)
//         const svg = e.currentTarget.closest('svg');
//         const rect = svg.getBoundingClientRect();
//         const x = ((e.clientX - rect.left) / rect.width) * 100;
//         const y = ((e.clientY - rect.top) / rect.height) * 100;

//         console.log("Canvas Point Added:", { x, y });
//         setPoints(prev => [...prev, { x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) }]);
//     };

//     const handleNodeClick = (e, dest) => {
//         e.stopPropagation();
//         e.preventDefault();

//         const x = dest.location?.x ?? dest.x;
//         const y = dest.location?.y ?? dest.y;

//         if (!isDrawing) {
//             console.log("Starting Route from:", dest.name);
//             setIsDrawing(true);
//             setFromId(dest.id);
//             setPoints([{ x, y }]);
//         } else {
//             setIsDrawing(false);
//             console.log("Ending Route at:", dest.name);
//             saveRoute(dest.id,x, y);
//         }
//     };

//     const saveRoute = async (toId,lastX, lastY) => {
//         const finalPoints = [...points, { x: lastX, y: lastY }];
//         try {
//             await routeService.addRoute({
//                 fromD: fromId,
//                 toD: toId,
//                 bodyPoints: finalPoints,
//                 dist: 0
//             });
//             alert("המסלול נשמר בהצלחה!");
//             onSaveSuccess();
//         } catch (err) {
//             console.error("Save Error:", err);
//             alert("שגיאה בשמירה");
//         }
//         reset();
//     };

//     const reset = () => {
//         setIsDrawing(false);
//         setPoints([]);
//         setFromId(null);
//     };

//     return (
//         <g className="drawing-layer-group">
//             {/* 1. שטח לכידה שקוף - חייב להיות ראשון בתוך ה-G */}
//             <rect 
//                 width="100" 
//                 height="100" 
//                 fill="rgba(0,0,0,0)" 
//                 style={{ cursor: isDrawing ? 'crosshair' : 'pointer', pointerEvents: 'all' }}
//                 onMouseDown={handleCanvasClick}
//             />

//             {/* 2. הקו המצויר בזמן אמת */}
//             {isDrawing && points.length > 0 && (
//                 <polyline
//                     points={points.map(p => `${p.x},${p.y}`).join(' ')}
//                     fill="none"
//                     stroke="#FFD700"
//                     strokeWidth="1.2"
//                     strokeDasharray="2,1"
//                     strokeLinecap="round"
//                     style={{ pointerEvents: 'none' }}
//                 />
//             )}

//             {/* 3. נקודות ציור (החרוזים על החוט) */}
//             {isDrawing && points.map((p, i) => (
//                 <circle 
//                     key={`pt-${i}`} 
//                     cx={p.x} 
//                     cy={p.y} 
//                     r="0.7" 
//                     fill="red" 
//                     style={{ pointerEvents: 'none' }} 
//                 />
//             ))}

//             {/* 4. אזורי לחיצה על החיות (Hotspots) - חייבים להיות אחרונים כדי שיהיו מעל הכל */}
//             {destinations.map(d => (
//                 <circle 
//                     key={`node-${d.id}`} 
//                     cx={d.location?.x ?? d.x} 
//                     cy={d.location?.y ?? d.y} 
//                     r="3" // אזור לחיצה גדול ונוח
//                     fill={fromId === d.id ? "rgba(76, 175, 80, 0.4)" : "rgba(255, 0, 0, 0.15)"} 
//                     stroke={fromId === d.id ? "#4CAF50" : "none"}
//                     strokeWidth="0.5"
//                     style={{ cursor: 'pointer', pointerEvents: 'all' }}
//                     onMouseDown={(e) => handleNodeClick(e, d)}
//                 />
//             ))}
//         </g>
//     );
// };

// export default RouteEditor;


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
        <g>
            <rect width="100" height="100" fill="transparent" onMouseDown={handleCanvasClick} />
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

