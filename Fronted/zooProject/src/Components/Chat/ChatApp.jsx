import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import MessageList from '../MessageList';
import MessageInput from '../MessageInput';

const ChatApp = () => {
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws-endpoint',
            webSocketFactory: () => new WebSocket('ws://localhost:8080/ws-endpoint'),
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: (frame) => {
                console.log('Connected!');
                setConnected(true);
                setStompClient(client);

                client.subscribe('/queue/reply', (message) => {
                    const serverMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, serverMessage]);
                });
            },
            onDisconnect: () => {
                setConnected(false);
            }
        });

        client.activate();

        return () => {
            if (client) client.deactivate();
        };
    }, []);

    const handleSendMessage = (text) => {
        if (!stompClient || !connected) return;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const userMessage = {
            sender: 'user',
            text: text,
            timestamp: currentTime
        };

        setMessages((prev) => [...prev, userMessage]);

        stompClient.publish({
            destination: '/app/chat',
            body: JSON.stringify(userMessage)
        });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '350px',       // רוחב הפאנל הימני
            height: '100vh',      // גובה מלא של המסך
            backgroundColor: '#ffffff',
            boxShadow: '-2px 0 5px rgba(0,0,0,0.1)', // צל שיוצר הפרדה מהמסך הראשי
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'sans-serif',
            boxSizing: 'border-box',
            zIndex: 1000,         // מוודא שהפאנל מעל אלמנטים אחרים
            borderLeft: '1px solid #e0e0e0',
            direction: 'rtl'      // כיוון הממשק מימין לשמאל
        }}>
            {/* כותרת הפאנל */}
            <div style={{ padding: '15px', borderBottom: '1px solid #eee', backgroundColor: '#f8f9fa' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>צ'אט AI</h3>
                <span style={{ fontSize: '12px', color: connected ? 'green' : 'red' }}>
                    ● {connected ? 'מחובר' : 'מנותק'}
                </span>
            </div>
            
            {/* אזור ההודעות - גמיש ותופס את רוב הגובה */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                <MessageList messages={messages} />
            </div>
            
            {/* אזור קלט קבוע בתחתית הפאנל */}
            <div style={{ padding: '10px', borderTop: '1px solid #eee', backgroundColor: '#f8f9fa' }}>
                <MessageInput onSendMessage={handleSendMessage} disabled={!connected} />
            </div>
        </div>
    );
};

export default ChatApp;