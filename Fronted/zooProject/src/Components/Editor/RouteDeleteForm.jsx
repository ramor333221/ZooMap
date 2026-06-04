import React from 'react';
import ReactDOM from 'react-dom';

const RouteDeleteForm = ({ 
    selectedRoute, 
    localRoutes, 
    isLoading, 
    getDestinationName, 
    onSelectRoute, 
    onConfirmDelete, 
    onCancel 
}) => {
    const mountNode = document.querySelector('.app-sidebar') || document.body;

    return ReactDOM.createPortal(
        <div className="admin-route-form" style={{ padding: '20px', background: '#0f172a', color: '#fff', borderRadius: '12px', marginBottom: '35px' }}>
            <h3 style={{ marginBottom: '15px' }}>Delete Route</h3>
            
            <select 
                value={selectedRoute?.id || ''} 
                onChange={(e) => onSelectRoute(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#1e293b', color: '#fff', borderRadius: '6px' }}
            >
                <option value="">-- Choose a route --</option>
                {localRoutes.map(route => (
                    <option key={route.id} value={route.id}>
                        {getDestinationName(route.fromD)} → {getDestinationName(route.toD)}
                    </option>
                ))}
            </select>

            {selectedRoute && (
                <div style={{ marginTop: '15px', padding: '10px', background: '#450a0a', borderRadius: '6px' }}>
                    <p style={{ fontSize: '12px', marginBottom: '10px' }}>Delete route #{selectedRoute.id}?</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={onConfirmDelete} disabled={isLoading} style={{ flex: 1, background: '#ef4444', color: 'white', padding: '8px', border: 'none', borderRadius: '4px' }}>
                            {isLoading ? "Deleting..." : "Confirm"}
                        </button>
                        <button onClick={onCancel} style={{ flex: 1, background: '#334155', color: 'white', padding: '8px', border: 'none', borderRadius: '4px' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>,
        mountNode
    );
};

export default RouteDeleteForm;