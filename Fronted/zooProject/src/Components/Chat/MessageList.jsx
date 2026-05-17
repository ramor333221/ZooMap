import React from 'react';

const MessageList = ({ messages }) => {
    return (
        <div style={{
            height: '400px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '15px',
            background: '#f9f9f9',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>
            {messages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                return (
                    <div key={index} style={{
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                        backgroundColor: isUser ? '#DCF8C6' : '#FFFFFF',
                        padding: '10px',
                        borderRadius: '8px',
                        maxWidth: '70%',
                        boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                        direction: 'rtl'
                    }}>
                        <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#555' }}>
                            {isUser ? 'אתה' : 'AI'}
                        </div>
                        <div style={{ marginTop: '4px' }}>{msg.text}</div>
                        <div style={{ fontSize: '10px', color: '#999', textAlign: 'left', marginTop: '4px' }}>
                            {msg.timestamp}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MessageList;