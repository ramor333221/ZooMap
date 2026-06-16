import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import RouteEditor from './RouteEditor';
import DestinationEditor from './destinationEditor';
import EditorToolbar from './EditorToolbar';

const MapEditorManager = ({ destinations, onSaveSuccess }) => {
    const [mode, setMode] = useState('route');
    const [action, setAction] = useState('create');

    const portalTarget =
        document.querySelector('.sidebar-scrollable-container') ||
        document.body;

    return (
        <>
            {ReactDOM.createPortal(
                <EditorToolbar
                    mode={mode}
                    setMode={setMode}
                    action={action}
                    setAction={setAction}
                />,
                portalTarget
            )}

            <g
                className={`editor-vector-layers active-mode-${mode} active-action-${action}`}
            >
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