import React, { useState } from 'react';
import ReactDOM from 'react-dom'; // נדרש עבור Portal
import RouteEditor from './RouteEditor';
import DestinationEditor from './destinationEditor';
import EditorToolbar from './EditorToolbar';

const MapEditorManager = ({ destinations, onSaveSuccess }) => {
    const [mode, setMode] = useState('route');
    const [action, setAction] = useState('create');

    const renderToolbar = () => {
        const mountNode = document.querySelector('.map-viewport') || document.body;
        return ReactDOM.createPortal(
            <EditorToolbar 
                mode={mode} 
                setMode={setMode} 
                action={action} 
                setAction={setAction} 
            />,
            mountNode
        );
    };

    return (
        <>
            {renderToolbar()}
            
            <g className="editor-layers">
                {mode === 'route' ? (
                    <RouteEditor 
                        action={action} 
                        destinations={destinations} 
                        onSaveSuccess={onSaveSuccess} 
                    />
                ) : (
                    <DestinationEditor 
                        action={action} 
                        destinations={destinations} 
                        onSaveSuccess={onSaveSuccess} 
                    />
                )}
            </g>
        </>
    );
};

export default MapEditorManager;