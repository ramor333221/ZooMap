import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { destinationService } from '../Api/destinationService';
import DestinationForm from './DestinationForm'; // Clear separate form component

const DestinationEditor = ({ destinations = [], action, onSaveSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', 
        picUrl: '', 
        description: '', 
        category: 'CAGES', 
        x: 0, 
        y: 0
    });

    const categories = [
        'CAGES', 
        'PICNIC_AREA', 
        'AMENITIES', 
        'CANCELED', 
        'TRAIL_SPLIT', 
        'ENTRANCE', 
        'EXIT', 
        'PARKING'
    ];

    const handleMapClick = (e) => {
        const svg = e.currentTarget.closest('svg');
        const rect = svg.getBoundingClientRect();
        
        // Calculate coordinates as percentages relative to the parent SVG
        const xCoord = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
        const yCoord = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));
    
        // Update state hooks with precise placement coordinates
        setFormData(prev => ({ 
            ...prev, 
            x: xCoord, 
            y: yCoord 
        }));
        
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const dataToSend = {
                ...formData,
            };
    
            await destinationService.addDestination(dataToSend); 
            setShowForm(false);
            if (onSaveSuccess) onSaveSuccess();
        } catch (err) {
            console.error("Save error:", err);
            alert("Error trying to save the landmark.");
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // PORTAL MOUNT TARGET CHANGE
    // Dynamically target the sidebar instead of map-controls
    // ==========================================
    const sidebarContainer = document.querySelector('.app-sidebar');

    return (
        <g className={`destination-editor-group ${showForm ? 'form-active' : ''}`}>
            {/* 1. Transparent interactive SVG vector layer to capture coordinates */}
            <rect 
                width="100" 
                height="100" 
                fill="transparent" 
                style={{ 
                    cursor: action === 'create' ? 'crosshair' : 'default', 
                    pointerEvents: 'all' 
                }}
                onMouseDown={handleMapClick} 
            />

            {/* 2. Portal injecting the form into the .app-sidebar element */}
            {showForm && sidebarContainer && ReactDOM.createPortal(
                <div className="sidebar-form-wrapper">
                    <DestinationForm 
                        formData={formData}
                        setFormData={setFormData}
                        categories={categories}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        onCancel={() => setShowForm(false)}
                    />
                </div>,
                sidebarContainer
            )}
        </g>
    );
};

export default DestinationEditor;