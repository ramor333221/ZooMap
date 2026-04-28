import React from 'react';

const EditorToolbar = ({ mode, setMode, action, setAction }) => {
    return (
        <div className="compact-editor-toolbar">
            <div className="toolbar-section">
                <button 
                    className={mode === 'route' ? 'active' : ''} 
                    onClick={() => setMode('route')}
                    title="נתיבים"
                >🛣️</button>
                <button 
                    className={mode === 'destination' ? 'active' : ''} 
                    onClick={() => setMode('destination')}
                    title="נקודות"
                >📍</button>
            </div>
            
            <div className="toolbar-divider" />

            <div className="toolbar-section">
                <button 
                    className={action === 'create' ? 'active' : ''} 
                    onClick={() => setAction('create')}
                    title="הוספה"
                >➕</button>
                <button 
                    className={action === 'update' ? 'active' : ''} 
                    onClick={() => setAction('update')}
                    title="עריכה"
                >✏️</button>
            </div>
        </div>
    );
};

export default EditorToolbar;