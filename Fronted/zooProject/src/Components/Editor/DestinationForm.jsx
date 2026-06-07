import React from 'react';
import '../../Scss/DestinationForm.scss'; 
import { SERVER_IP } from '../../Api/apiClient';

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
        if (formData.previewUrl) return formData.previewUrl;
        if (formData.picUrl) {
            if (formData.picUrl.startsWith('http')) return formData.picUrl;
            const path = formData.picUrl.startsWith('/') ? formData.picUrl : `/${formData.picUrl}`;
            return `http://${SERVER_IP}${path}`;
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
                
                <div className="form-inputs-segment">
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
                            <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                        ))}
                    </select>

                    <input 
                        type="text"
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                        className="form-input"
                    />

                    <div className="file-upload-wrapper">
                        <label htmlFor="sidebar-file-input" className="form-input">
                            <span>📁</span>
                            <span>{imageSrc ? 'Change Image' : 'Upload Image'}</span>
                        </label>
                        <input 
                            id="sidebar-file-input"
                            type="file"
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }} 
                        />

                        {imageSrc && (
                            <img 
                                src={imageSrc} 
                                alt="Preview" 
                                className="image-preview-thumb" 
                            />
                        )}
                    </div>
                </div>

                <div className="button-group-row">
                    <button 
                        type="submit" 
                        className="save-btn" 
                        disabled={loading}
                    >
                        {loading ? '...' : 'Save'}
                    </button>
                    <button 
                        type="button" 
                        className="cancel-btn" 
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DestinationForm;