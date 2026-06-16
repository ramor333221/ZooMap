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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = new FormData();

            const dto = {
                name: formData.name,
                category: formData.category,
                description: formData.description,
                x: parseFloat(formData.x),
                y: parseFloat(formData.y)
            };

            payload.append(
                'destination',
                new Blob([JSON.stringify(dto)], { type: 'application/json' })
            );

            if (formData.imageFile) {
                payload.append('file', formData.imageFile);
            }

            if (isUpdating) {
                await updateDestination({
                    id: formData.id,
                    formData: payload
                }).unwrap();
            } else {
                await addDestination(payload).unwrap();
            }

            if (onSaveSuccess) onSaveSuccess();
            handleClose();

        } catch (err) {
            alert("Error saving destination: " + (err?.data?.message || err.message));
        }
    };

    const mountNode =
        document.querySelector('.app-sidebar') || document.body;

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
                const nodeX = dest.location?.x ?? dest.x;
                const nodeY = dest.location?.y ?? dest.y;
                const isSelected = formData.id === dest.id;

                return (
                    <g
                        key={dest.id}
                        onClick={() => loadDestinationForEditing(dest)}
                        style={{ cursor: 'pointer' }}
                    >
                        <circle cx={nodeX} cy={nodeY} r="5" fill="transparent" />
                        {isSelected && (
                            <circle
                                cx={nodeX}
                                cy={nodeY}
                                r="3.5"
                                fill="none"
                                stroke="#0ea5e9"
                                strokeWidth="0.6"
                            />
                        )}
                        <circle
                            cx={nodeX}
                            cy={nodeY}
                            r="2.2"
                            fill={isSelected ? "#0ea5e9" : "#eab308"}
                            stroke="#fff"
                            strokeWidth="0.4"
                        />
                    </g>
                );
            })}

            {ReactDOM.createPortal(
                <div style={{ position: 'relative', top: '-10px', padding: '0 10px' }}>

                    {action === 'update' && !showForm && (
                        <div style={{
                            padding: '15px',
                            background: '#1e293b',
                            borderRadius: '12px',
                            border: '1px solid #334155',
                            marginBottom: '50px'
                        }}>
                            <h3 style={{ color: '#fff' }}>✏️ Edit Destination</h3>

                            <select
                                onChange={(e) =>
                                    loadDestinationForEditing(
                                        destinations.find(d => d.id === parseInt(e.target.value))
                                    )
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    background: '#0f172a',
                                    color: '#fff'
                                }}
                            >
                                <option value="">-- Select --</option>
                                {destinations.map(d => (
                                    <option key={d.id} value={d.id}>
                                        {d.name || `ID: ${d.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

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