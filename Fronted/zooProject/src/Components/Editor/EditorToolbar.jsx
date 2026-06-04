import React from 'react';
import '../../Scss/_editorToolbar.scss'; 
import { FaRoute, FaTrashCan } from "react-icons/fa6"; // Added FaTrashCan
import { IoLocationSharp } from "react-icons/io5";

const EditorToolbar = ({ mode, setMode, action, setAction }) => {
    return (
        <div className="editor-sidebar-card">
            <div className="editor-header">
                <h3>Editor Panel</h3>
                <p>Use the tools below to modify map configurations.</p>
            </div>
            
            <div className="toolbar-section">
                <span className="section-label">Layer</span>
                <div className="button-group">
                    <button 
                        className={`toolbar-btn ${mode === 'route' ? 'active' : ''}`} 
                        onClick={() => setMode('route')}
                    >
                        <span className="btn-icon"><FaRoute /></span> Routes
                    </button>
                    <button 
                        className={`toolbar-btn ${mode === 'destination' ? 'active' : ''}`} 
                        onClick={() => setMode('destination')}
                    >
                        <span className="btn-icon"><IoLocationSharp /></span> Points
                    </button>
                </div>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-section">
                <span className="section-label">Action</span>
                <div className="button-group">
                    <button 
                        className={`toolbar-btn ${action === 'create' ? 'active' : ''}`} 
                        onClick={() => setAction('create')}
                    >
                        <span className="btn-icon">➕</span> Create
                    </button>
                    <button 
                        className={`toolbar-btn ${action === 'update' ? 'active' : ''}`} 
                        onClick={() => setAction('update')}
                    >
                        <span className="btn-icon">✏️</span> Modify
                    </button>
                    <button 
                        className={`toolbar-btn delete-btn ${action === 'delete' ? 'active' : ''}`} 
                        onClick={() => setAction('delete')}
                    >
                        <span className="btn-icon"><FaTrashCan /></span> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditorToolbar;