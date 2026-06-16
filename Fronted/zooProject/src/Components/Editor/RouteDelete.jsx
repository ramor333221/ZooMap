import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import DestinationForm from './DestinationUpdateForm';
import { useAddDestinationMutation, useUpdateDestinationMutation } from '../../Api/destinationApi';

const DestinationEditor = ({ destinations = [], action, onSaveSuccess }) => {
    const [showForm, setShowForm] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [addDestination, { isLoading: isAdding }] = useAddDestinationMutation();
    const [updateDestination, { isLoading: isUpdatingApi }] = useUpdateDestinationMutation();

    const loading = isAdding || isUpdatingApi;

    const categories = [
        "CAGES",
        "PICNIC_AREA",
        "AMENITIES",
        "TRAIL_SPLIT",
        "ENTRANCE",
        "EXIT",
        "PARKING"
    ];

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        category: 'CAGES',
        description: '',
        picUrl: '',
        x: 0,
        y: 0,
        imageFile: null
    });

    const handleClose = () => {
        setFormData({
            id: null,
            name: '',
            category: 'CAGES',
            description: '',
            picUrl: '',
            x: 0,
            y: 0,
            imageFile: null
        });
        setShowForm(false);
        setIsUpdating(false);
    };

    useEffect(() => {
        handleClose();
    }, [action]);

    const handleMapClick = (e) => {
        if (action !== 'create') return;

        const svg = e.currentTarget.closest('svg');
        const rect = svg.getBoundingClientRect();

        setFormData(prev => ({
            ...prev,
            id: null,
            x: parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(2)),
            y: parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(2))
        }));

        setIsUpdating(false);
        setShowForm(true);
    };

    const loadDestinationForEditing = (dest) => {
        if (!dest) return;

        setFormData({
            id: dest.id,
            name: dest.name || '',
            category: dest.category || 'CAGES',
            description: dest.description || '',
            picUrl: dest.picUrl || '',
            x: dest.location?.x ?? dest.x,
            y: dest.location?.y ?? dest.y
        });

        setIsUpdating(true);
        setShowForm(true);
    };

    const handleSubmit = async (data) => {
        try {
            const payload = new FormData();

            const dto = {
                name: data.name,
                category: data.category,
                description: data.description,
                x: parseFloat(data.x),
                y: parseFloat(data.y)
            };

            payload.append(
                'destination',
                new Blob([JSON.stringify(dto)], { type: 'application/json' })
            );

            if (data.imageFile) {
                payload.append('file', data.imageFile);
            }

            if (isUpdating) {
                await updateDestination({
                    id: data.id,
                    formData: payload
                }).unwrap();
            } else {
                await addDestination(payload).unwrap();
            }

            onSaveSuccess?.();
            handleClose();
        } catch (err) {
            alert(err?.data?.message || err.message);
        }
    };

    const mountNode = document.querySelector('.app-sidebar') || document.body;

    return (
        <g className="destination-editor-layer">

            {action === 'create' && (
                <rect
                    width="100"
                    height="100"
                    fill="transparent"
                    onMouseDown={handleMapClick}
                    style={{ cursor: 'crosshair' }}
                />
            )}

            {action === 'update' && destinations.map(dest => {
                const x = dest.location?.x ?? dest.x;
                const y = dest.location?.y ?? dest.y;

                return (
                    <g
                        key={dest.id}
                        onClick={() => loadDestinationForEditing(dest)}
                        style={{ cursor: 'pointer' }}
                    >
                        <circle cx={x} cy={y} r="5" fill="transparent" />
                        <circle cx={x} cy={y} r="2.2" fill="#eab308" stroke="#fff" strokeWidth="0.4" />
                    </g>
                );
            })}

            {ReactDOM.createPortal(
                <div>
                    {showForm && (
                        <DestinationForm
                            formData={formData}
                            setFormData={setFormData}
                            categories={categories}
                            handleSubmit={handleSubmit}
                            loading={loading}
                            onCancel={handleClose}
                        />
                    )}
                </div>,
                mountNode
            )}
        </g>
    );
};

export default DestinationEditor;