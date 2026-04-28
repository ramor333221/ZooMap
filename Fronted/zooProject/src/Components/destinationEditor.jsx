import React from 'react';
import { destinationService } from '../Api/destinationService';

const DestinationEditor = ({ destinations, action, onSaveSuccess }) => {
    
    const handleMapClick = async (e) => {
        if (action !== 'create') return;

        const svg = e.currentTarget.closest('svg');
        const rect = svg.getBoundingClientRect();
        const x = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
        const y = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));

        const name = prompt("שם הנקודה החדשה:");
        if (name) {
            try {
                await destinationService.addDestination({ name, x, y });
                onSaveSuccess();
            } catch (err) { console.error(err); }
        }
    };

    const handleNodeClick = async (e, dest) => {
        e.stopPropagation();
        if (action === 'update') {
            const newName = prompt("ערוך שם נקודה:", dest.name);
            if (newName && newName !== dest.name) {
                await destinationService.updateDestination(dest.id, { ...dest, name: newName });
                onSaveSuccess();
            }
        }
    };

    return (
        <g>
            <rect width="100" height="100" fill="transparent" onMouseDown={handleMapClick} />
            {destinations.map(d => (
                <circle 
                    key={d.id} cx={d.x} cy={d.y} r="2.5" 
                    fill={action === 'update' ? "#FF9800" : "#2196F3"} 
                    onMouseDown={(e) => handleNodeClick(e, d)}
                    style={{ cursor: 'pointer' }}
                />
            ))}
        </g>
    );
};

export default DestinationEditor;