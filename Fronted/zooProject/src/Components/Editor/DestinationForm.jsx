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
        <div 
            className="inline-map-controls-form" 
            style={{ marginBottom: '35px' }} // Added requested margin
        >
            <form onSubmit={handleSubmit} className="controls-form-row">
                <div className="form-info-segment">
                    <span className="form-title" style={{ fontSize: '14px', fontWeight: '600', color: '#38bdf8' }}>
                        {formData.id ? '✏️ Edit Landmark' : '📍 New Landmark'}
                    </span>
                </div>
                
                <div className="form-inputs-segment" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                        type="text"
                        placeholder="Point Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        required 
                        className="form-input"
                        style={compactInputStyle}
                    />
                    
                    <select 
                        value={formData.category} 
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="form-select"
                        style={compactInputStyle}
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
                        className="form-input desc-input"
                        style={{ ...compactInputStyle, width: '150px' }}
                    />

                    <div className="file-upload-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label 
                            htmlFor="destination-file-input" 
                            className="form-input" 
                            style={{ ...compactInputStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <span>📁</span>
                            <span style={{ fontSize: '12px' }}>{imageSrc ? 'Change' : 'Image'}</span>
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
                                style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #334155' }} 
                            />
                        )}
                    </div>
                </div>

                <div className="button-group-row" style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        type="submit" 
                        className="save-btn" 
                        disabled={loading}
                        style={primaryBtnStyle}
                    >
                        {loading ? '...' : 'Save'}
                    </button>
                    <button 
                        type="button" 
                        className="cancel-btn" 
                        onClick={onCancel}
                        style={secondaryBtnStyle}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

// Inline styles to ensure the "compact" look
const compactInputStyle = {
    padding: '6px 10px',
    fontSize: '13px',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#fff',
    outline: 'none'
};

const primaryBtnStyle = {
    padding: '6px 15px',
    background: '#0ea5e9',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px'
};

const secondaryBtnStyle = {
    padding: '6px 12px',
    background: 'transparent',
    color: '#94a3b8',
    border: '1px solid #334155',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px'
};

export default DestinationForm;