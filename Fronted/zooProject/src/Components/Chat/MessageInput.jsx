import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, disabled }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() === '') return;

        onSendMessage(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '10px' }}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="הקלד הודעה..."
                disabled={disabled}
                style={{ flex: 1, padding: '10px', fontSize: '16px' }}
            />
            <button type="submit" disabled={disabled} style={{ padding: '10px 20px' }}>
                שלח
            </button>
        </form>
    );
};

export default MessageInput;