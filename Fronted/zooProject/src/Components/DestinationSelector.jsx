import React from 'react';
import '../Scss/DestinationSelector.scss';

const DestinationSelector = ({ destinations, selectedTargets, onToggle, onCalculate, isCalculating }) => {
    return (
        <div className="target-sidebar">
            <h2>🗺️ תכנון מסלול</h2>
            <p>בחר את החיות שברצונך לבקר:</p>
            
            <div className="targets-list">
                {destinations.map(dest => (
                    <div 
                        key={dest.id} 
                        className={`target-item ${selectedTargets.includes(dest.id) ? 'selected' : ''}`}
                        onClick={() => onToggle(dest.id)}
                    >
                        <input 
                            type="checkbox" 
                            checked={selectedTargets.includes(dest.id)}
                            readOnly 
                        />
                        <span className="target-name">{dest.name}</span>
                    </div>
                ))}
            </div>

            <button 
                className="calculate-btn"
                disabled={selectedTargets.length < 2 || isCalculating}
                onClick={onCalculate}
            >
                {isCalculating ? "מחשב מסלול..." : "מצא את הדרך הקצרה ביותר"}
            </button>
        </div>
    );
};

export default DestinationSelector;