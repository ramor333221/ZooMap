import React from 'react';
import ReactDOM from 'react-dom';

const RouteUpdateForm = ({ 
    routeId, 
    localRoutes, 
    fromD, 
    toD, 
    errorMessage, 
    successMessage, 
    getDestinationName, 
    loadRouteForEditing, 
    handleUpdate, 
    resetForm 
}) => {
    // Target the sidebar; fallback to body if not found
    const mountNode = document.querySelector('.app-sidebar') || document.body;

    return ReactDOM.createPortal(
        <div className="admin-route-form" style={{ 
            padding: '20px', color: '#f8fafc', background: '#0f172a', 
            border: '1px solid #1e293b', borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            fontFamily: 'Inter, system-ui, sans-serif',
            marginBottom:'35px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>✏️</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Update Route</h3>
            </div>
            
            {errorMessage && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '15px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '15px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    {successMessage}
                </div>
            )}

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                    Select Active Route
                </label>
                <select 
                    value={routeId || ''} 
                    onChange={(e) => {
                        const selected = localRoutes.find(r => r.id === parseInt(e.target.value));
                        loadRouteForEditing(selected);
                    }}
                    style={{ width: '100%', padding: '10px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px', outline: 'none' }}
                >
                    <option value="">-- Choose a route --</option>
                    {localRoutes.map(r => (
                        <option key={r.id} value={r.id}>
                            {getDestinationName(r.fromD)} → {getDestinationName(r.toD)}
                        </option>
                    ))}
                </select>
            </div>

            {routeId ? (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ background: '#1e293b', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #0ea5e9', marginBottom: '20px' }}>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Origin</span>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>{getDestinationName(fromD)}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Destination</span>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>{getDestinationName(toD)}</span>
                        </div>
                    </div>
                    <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', fontStyle: 'italic', marginBottom: '15px' }}>
                        Click on the map to redraw the path vector.
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleUpdate} style={{ flex: 2, background: '#0ea5e9', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                            Save Path
                        </button>
                        <button onClick={resetForm} style={{ flex: 1, background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '6px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#475569', border: '2px dashed #1e293b', borderRadius: '8px' }}>
                    <p style={{ fontSize: '12px' }}>Please select a route from the list or click a route on the map to start editing.</p>
                </div>
            )}
        </div>,
        mountNode
    );
};

export default RouteUpdateForm;