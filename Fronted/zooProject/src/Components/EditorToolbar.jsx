import React from 'react';
import '../Scss/_editorToolbar.scss'; // Explicitly targeting the partial file

const EditorToolbar = ({ mode, setMode, action, setAction }) => {
    return (
        <div className="compact-editor-toolbar">
            
            {/* Mode Selectors (Routes vs Destinations) */}
            <div className="toolbar-section">
                <span className="section-label">Layer</span>
                <div className="button-group">
                    <button 
                        className={`toolbar-btn ${mode === 'route' ? 'active' : ''}`} 
                        onClick={() => setMode('route')}
                        title="Edit Paths and Routes"
                    >
                        <span className="btn-icon">🛣️</span>
                        <span className="btn-text">Routes</span>
                    </button>
                    <button 
                        className={`toolbar-btn ${mode === 'destination' ? 'active' : ''}`} 
                        onClick={() => setMode('destination')}
                        title="Edit Habitats and Destinations"
                    >
                        <span className="btn-icon">📍</span>
                        <span className="btn-text">Points</span>
                    </button>
                </div>
            </div>
             
            <div className="toolbar-divider" />

            {/* Action Selectors (Create vs Edit/Move) */}
            <div className="toolbar-section">
                <span className="section-label">Action</span>
                <div className="button-group">
                    <button 
                        className={`toolbar-btn ${action === 'create' ? 'active' : ''}`} 
                        onClick={() => setAction('create')}
                        title="Create New Element"
                    >
                        <span className="btn-icon">➕</span>
                        <span className="btn-text">Create</span>
                    </button>
                    <button 
                        className={`toolbar-btn ${action === 'update' ? 'active' : ''}`} 
                        onClick={() => setAction('update')}
                        title="Modify / Move Existing"
                    >
                        <span className="btn-icon">✏️</span>
                        <span className="btn-text">Modify</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditorToolbar;