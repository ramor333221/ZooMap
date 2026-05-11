import React, { useState } from 'react';
import ReactDOM from 'react-dom'; // Required for Portal rendering
import RouteEditor from './RouteEditor';
import DestinationEditor from './destinationEditor';
import EditorToolbar from './EditorToolbar';

const MapEditorManager = ({ destinations, onSaveSuccess }) => {
    const [mode, setMode] = useState('route');
    const [action, setAction] = useState('create');

    // Renders the floating editor toolbar directly into the absolute control pane
    const renderToolbar = () => {
        const mountNode = document.querySelector('.app-sidebar') || document.body;
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
            
            {/* The active vector SVG layers being modified by the administrator */}
            <g className={`editor-vector-layers active-mode-${mode} active-action-${action}`}>
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