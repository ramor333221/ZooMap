import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import ReactMarkdown from 'react-markdown';
import { WS_URL } from '../../Api/apiClient';

const ChatApp = () => {
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Welcome! Ask me anything about the park, animal habitats, or navigation routes.' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const stompClientRef = useRef(null); 

    const [chatSessionId] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('group') || 'default-group'; 
    });

    useEffect(() => {
        const client = new Client({
            brokerURL: WS_URL,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            
            onConnect: () => {
                console.log('✅ Chat Socket Connected! Session ID:', chatSessionId);
                setConnected(true);
                
                // רישום לערוץ הדינמי הפרטי של המשתמש הנוכחי
                client.subscribe('/user/queue/reply', (message) => {
                    console.log("📬 הודעה חדשה הגיעה מה-AI:", message.body);
                    try {
                        const serverMessage = JSON.parse(message.body);
                        setMessages((prev) => [...prev, {
                            id: Date.now(),
                            sender: 'ai',
                            text: serverMessage.text
                        }]);
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                    }
                });
            },
            onDisconnect: () => {
                console.log('❌ Chat Socket Disconnected');
                setConnected(false);
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame);
            }
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [chatSessionId]); 

    const handleSendChatMessage = () => {
        if (!inputMessage.trim()) return;

        const activeClient = stompClientRef.current;
        if (!activeClient || !activeClient.connected) {
            console.warn("Cannot send message, socket not connected.");
            return;
        }

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // בניית האובייקט כולל ה-chatSessionId הייחודי
        const userMessage = {
            sender: 'user',
            text: inputMessage,
            timestamp: currentTime,
            chatSessionId: chatSessionId
        };

        // עדכון מקומי מיידי במסך של המשתמש בשביל חווית שימוש מהירה
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: inputMessage }]);
        setInputMessage('');

        // שליחה ל-Controller של Spring Boot
        activeClient.publish({
            destination: '/app/chat',
            body: JSON.stringify(userMessage)
        });
    };

    return (
        <aside className="ai-chat-panel">
            <div className="chat-header">
                <div className="ai-badge">
                    <span className="pulse-dot" style={{ backgroundColor: connected ? '#4caf50' : '#f44336' }}></span>
                    <span>AI Assistant {connected ? '' : '(Connecting...)'}</span>
                </div>
            </div>
            
            <div className="chat-history">
                {messages.map(msg => (
                    <div key={msg.id} className={`chat-message ${msg.sender}`}>
                        <div className="msg-bubble">
                            {msg.sender === 'ai' ? (
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            ) : (
                                <p>{msg.text}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="chat-input-bar">
                <input 
                    type="text" 
                    placeholder={connected ? "Ask about animals..." : "Connecting to server..."} 
                    value={inputMessage} 
                    disabled={!connected} 
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()} 
                />
                <button 
                    className="btn-chat-send" 
                    onClick={handleSendChatMessage} 
                    disabled={!connected}
                >
                    ⚡
                </button>
            </div>
        </aside>
    );
};

export default ChatApp;