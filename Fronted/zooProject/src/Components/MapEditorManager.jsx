import React from 'react';
import RouteEditor from './RouteEditor';
import DestinationEditor from './destinationEditor';

const MapEditorManager = ({ mode, action, destinations, onSaveSuccess }) => {
    return (
        <g className="editor-layers">
            {mode === 'route' ? (
                <RouteEditor action={action} destinations={destinations} onSaveSuccess={onSaveSuccess} />
            ) : (
                <DestinationEditor action={action} destinations={destinations} onSaveSuccess={onSaveSuccess} />
            )}
        </g>
    );
};

export default MapEditorManager;