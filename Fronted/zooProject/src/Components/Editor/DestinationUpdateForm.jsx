import React, { useRef } from 'react';

const DestinationUpdateForm = ({ formData, setFormData, categories, handleSubmit, loading, onCancel }) => {
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, imageFile: e.target.files[0] }));
        }
    };

    const triggerFileSelect = () => fileInputRef.current.click();

    return (
        <form onSubmit={handleSubmit} style={formContainerStyle}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', color: '#38bdf8' }}>
                {formData.id ? 'Edit Destination' : 'Create New Destination'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Coordinates Info */}
                <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>
                    <span>X: <strong>{formData.x}%</strong></span>
                    <span>Y: <strong>{formData.y}%</strong></span>
                </div>

                {/* Name */}
                <div>
                    <label style={labelStyle}>Name</label>
                    <input 
                        style={inputStyle}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Lion's Gate"
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label style={labelStyle}>Category</label>
                    <select style={inputStyle} name="category" value={formData.category} onChange={handleChange}>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label style={labelStyle}>Description</label>
                    <textarea 
                        style={{ ...inputStyle, minHeight: '45px', resize: 'vertical' }}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Short description..."
                    />
                </div>

                {/* Custom Image Upload */}
                <div style={{ marginTop: '2px' }}>
                    <label style={labelStyle}>Image</label>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <button 
                        type="button"
                        onClick={triggerFileSelect}
                        style={fileBtnStyle}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = '#475569'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = '#334155'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {formData.imageFile ? formData.imageFile.name : 'Choose folder...'}
                            </span>
                        </div>
                    </button>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button type="submit" disabled={loading} style={saveBtnStyle}>
                        {loading ? '...' : 'Save'}
                    </button>
                    <button type="button" onClick={onCancel} style={cancelBtnStyle}>
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

// --- Updated Styles for "Shorter" look ---

const formContainerStyle = {
    background: '#1e293b',
    padding: '14px 18px', // Reduced vertical padding
    borderRadius: '10px',
    border: '1px solid #334155',
    color: '#f8fafc',
    fontFamily: 'Inter, system-ui, sans-serif',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    marginBottom: '45px' // Requested margin
};

const labelStyle = { 
    display: 'block', 
    fontSize: '10px', // Smaller labels
    fontWeight: '700', 
    textTransform: 'uppercase', 
    color: '#64748b', 
    marginBottom: '3px', 
    letterSpacing: '0.025em' 
};

const inputStyle = { 
    width: '100%', 
    padding: '7px 10px', // Thinner inputs
    background: '#0f172a', 
    color: '#fff', 
    border: '1px solid #334155', 
    borderRadius: '5px', 
    outline: 'none', 
    fontSize: '13px' 
};

const fileBtnStyle = {
    width: '100%',
    padding: '6px 10px', // Thinner file button
    background: '#0f172a',
    color: '#94a3b8',
    border: '1px dashed #334155',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 0.2s'
};

const saveBtnStyle = {
    flex: 2, 
    background: '#0ea5e9', 
    color: 'white', 
    border: 'none',
    padding: '10px', 
    borderRadius: '5px', 
    fontWeight: '600', 
    cursor: 'pointer',
    fontSize: '13px'
};

const cancelBtnStyle = {
    flex: 1, 
    background: 'transparent', 
    color: '#f43f5e', 
    border: '1px solid #f43f5e',
    padding: '10px', 
    borderRadius: '5px', 
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px'
};

export default DestinationUpdateForm;