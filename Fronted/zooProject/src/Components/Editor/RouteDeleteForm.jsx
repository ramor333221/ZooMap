import React from 'react';
import ReactDOM from 'react-dom';

const RouteDeleteForm = ({
    selectedRoute,
    localRoutes = [],
    isLoading,
    getDestinationName = () => '',
    onSelectRoute,
    onConfirmDelete,
    onCancel
}) => {

    const mountNode =
        document.querySelector('.app-sidebar') || document.body;

    return ReactDOM.createPortal(
        <div className="admin-route-form">

            <h3 className="form-header">
                Delete Route
            </h3>

            <select
                value={selectedRoute?.id || ''}
                onChange={(e) => onSelectRoute?.(e.target.value)}
                className="route-dropdown"
            >
                <option value="">-- Choose a route --</option>

                {localRoutes.map(route => (
                    <option key={route.id} value={route.id}>
                        {getDestinationName(route.fromD)} → {getDestinationName(route.toD)}
                    </option>
                ))}
            </select>

            {selectedRoute && (
                <div className="alert-message --error" style={{ marginTop: '15px' }}>

                    <p style={{ fontSize: '12px', marginBottom: '10px' }}>
                        Delete route #{selectedRoute.id}?
                    </p>

                    <div style={{ display: 'flex', gap: '10px' }}>

                        <button
                            onClick={onConfirmDelete}
                            disabled={isLoading}
                            className="save-btn"
                            style={{ flex: 1, background: '#ef4444' }}
                        >
                            {isLoading ? 'Deleting...' : 'Confirm'}
                        </button>

                        <button
                            onClick={onCancel}
                            className="cancel-btn"
                            style={{ flex: 1 }}
                        >
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