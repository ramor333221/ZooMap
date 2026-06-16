import React from 'react';
import '../../Scss/DestinationSelector.scss';


const DestinationSelector = ({ destinations, selectedTargets, onToggle, onCalculate, isCalculating }) => {
    return (
        <div className="target-sidebar">
            <div className="sidebar-header">
                <h2>🗺️ Route Planner</h2>
                <p>Select the exhibits and animal habitats you would like to visit:</p>
            </div>
            
            <div className="targets-list">
                {destinations.map(dest => {
                    const isChecked = selectedTargets.includes(dest.id);
                    return (
                        <div 
                            key={dest.id} 
                            className={`target-item ${isChecked ? 'selected' : ''}`}
                            onClick={() => onToggle(dest.id)}
                        >
                            <div className="checkbox-wrapper">
                                <input 
                                    type="checkbox" 
                                    checked={isChecked}
                                    readOnly 
                                />
                                <span className="custom-checkbox"></span>
                            </div>
                            <span className="target-name">{dest.name}</span>
                        </div>
                    );
                })}
            </div>

            <button 
                className="calculate-btn"
                disabled={selectedTargets.length < 2 || isCalculating}
                onClick={onCalculate}
            >
                {isCalculating ? (
                    <div className="btn-spinner-flex">
                        <span className="btn-spinner"></span>
                        <span>Calculating Route...</span>
                    </div>
                ) : (
                    "Find Shortest Route"
                )}
            </button>
        </div>
    );
};

export default DestinationSelector;