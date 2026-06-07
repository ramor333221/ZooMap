import React from 'react';
import ReactDOM from 'react-dom';
import '../../Scss/RouteUpdateForm.scss'; 

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
    const mountNode = document.querySelector('.app-sidebar') || document.body;

    return ReactDOM.createPortal(
        <div className="admin-route-form">
            <div className="form-header">
                <span className="header-icon">✏️</span>
                <h3 className="header-title">Update Route</h3>
            </div>
            
            {errorMessage && (
                <div className="alert-message --error">
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="alert-message --success">
                    {successMessage}
                </div>
            )}

            <div className="select-group">
                <label className="select-label">
                    Select Active Route
                </label>
                <select 
                    value={routeId || ''} 
                    onChange={(e) => {
                        const selected = localRoutes.find(r => r.id === parseInt(e.target.value));
                        loadRouteForEditing(selected);
                    }}
                    className="route-dropdown"
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
                <div className="active-route-panel">
                    <div className="route-card">
                        <div className="card-row">
                            <span className="label-text">Origin</span>
                            <span className="value-text">{getDestinationName(fromD)}</span>
                        </div>
                        <div className="card-row">
                            <span className="label-text">Destination</span>
                            <span className="value-text">{getDestinationName(toD)}</span>
                        </div>
                    </div>
                    <p className="map-hint">
                        Click on the map to redraw the path vector.
                    </p>
                    <div className="form-actions">
                        <button onClick={handleUpdate} className="save-btn">
                            Save Path
                        </button>
                        <button onClick={resetForm} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="empty-state">
                    <p>Please select a route from the list or click a route on the map to start editing.</p>
                </div>
            )}
        </div>,
        mountNode
    );
};

export default RouteUpdateForm;