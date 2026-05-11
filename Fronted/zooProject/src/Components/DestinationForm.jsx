import React from 'react';
import '../Scss/DestinationForm.scss'; // Link to modular horizontal admin-dock form styles

const DestinationForm = ({ 
    formData, 
    setFormData, 
    categories, 
    handleSubmit, 
    loading, 
    onCancel 
}) => {
    return (
        <div className="inline-map-controls-form">
            <form onSubmit={handleSubmit} className="controls-form-row">
                {/* Header Tag */}
                <div className="form-info-segment">
                    <span className="form-title">📍 New Landmark</span>
                </div>
                
                {/* Inputs & Dropdowns */}
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
                </div>
                
                {/* Coordinates Badge */}
                <div className="coord-badge">
                    <span className="coord-label">X:</span> <span className="coord-val">{formData.x}</span>
                    <span className="coord-divider">|</span>
                    <span className="coord-label">Y:</span> <span className="coord-val">{formData.y}</span>
                </div>

                {/* Submit & Cancel Actions */}
                <div className="button-group-row">
                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? (
                            <div className="loader-inner">
                                <span className="loader-spinner"></span>
                                <span>Saving...</span>
                            </div>
                        ) : 'Save'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DestinationForm;