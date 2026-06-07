import React from 'react';
import '../../Scss/MessageList.scss'; // Update path based on your folder tree design

const MessageList = ({ messages }) => {
    return (
        <div className="message-list-container">
            {messages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                
                return (
                    <div 
                        key={index} 
                        className={`message-bubble ${isUser ? '--user' : '--system'}`}
                    >
                        <div className="bubble-sender">
                            {isUser ? 'You' : 'AI'}
                        </div>
                        <div className="bubble-text">
                            {msg.text}
                        </div>
                        <div className="bubble-timestamp">
                            {msg.timestamp}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MessageList;