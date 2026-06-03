import React from 'react';
import '../Scss/DestinationForm.scss'; 
import { BASE_URL } from '../Api/apiClient';

const DestinationForm = ({ 
    formData, 
    setFormData, 
    categories, 
    handleSubmit, 
    loading, 
    onCancel 
}) => {

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Revoke old blob to avoid memory leaks
        if (formData.previewUrl && formData.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(formData.previewUrl);
        }

        setFormData({ 
            ...formData, 
            imageFile: file, 
            previewUrl: URL.createObjectURL(file) 
        });
    };

    const getImageSource = () => {
        // 1. Prioritize local preview (if user just picked a file)
        if (formData.previewUrl) return formData.previewUrl;

        // 2. Fallback to server image
        if (formData.picUrl) {
            // If it's already a full URL, use it
            if (formData.picUrl.startsWith('http')) return formData.picUrl;
            return `${BASE_URL}${formData.picUrl.startsWith('/') ? '' : '/'}${formData.picUrl}`;
        }
        return null;
    };

    const imageSrc = getImageSource();

    return (
        <div className="inline-map-controls-form">
            <form onSubmit={handleSubmit} className="controls-form-row">
                <div className="form-info-segment">
                    <span className="form-title">
                        {formData.id ? '✏️ Edit Landmark' : '📍 New Landmark'}
                    </span>
                </div>
                
                <div className="form-inputs-segment" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                        type="text"
                        placeholder="Point Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        required 
                        className="form-input"
                    />
                    
                    <select 
                        value={formData.category} 
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="form-select"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <input 
                        type="text"
                        placeholder="Description (Optional)"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                        className="form-input desc-input"
                    />

                    <div className="file-upload-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label htmlFor="destination-file-input" className="form-input" style={{ cursor: 'pointer' }}>
                            📁 {imageSrc ? 'Change Image' : 'Choose Image'}
                        </label>
                        <input 
                            id="destination-file-input"
                            type="file"
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }} 
                        />

                        {imageSrc && (
                            <img 
                                src={imageSrc} 
                                alt="Preview" 
                                style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} 
                            />
                        )}
                    </div>
                </div>

                <div className="button-group-row">
                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default DestinationForm;