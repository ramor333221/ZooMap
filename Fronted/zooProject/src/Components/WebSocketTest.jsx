import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

const WebSocketTest = () => {
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [serverResponse, setServerResponse] = useState("No response yet");

    useEffect(() => {
        const client = new Client({
            // שינוי ל-localhost שלעיתים קרובות פותר חסימות דפדפן פנימיות
            brokerURL: 'ws://localhost:8080/ws-endpoint',
            
            // תיקון קריטי: מאלץ את הספרייה להשתמש ב-WebSocket הנייטיבי של הדפדפן
            webSocketFactory: () => new WebSocket('ws://localhost:8080/ws-endpoint'),
            
            // הגדרת זמני מעקב לבדיקה שהחיבור חי וקיים
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: (frame) => {
                console.log('Connected natively! ' + frame);
                setConnected(true);
                setStompClient(client);

                // רישום לתור הפרטי של המשתמש לקבלת תשובה מהשרת
                client.subscribe('/queue/hello-reply', (message) => {
                    setServerResponse(message.body);
                });
            },
            onDisconnect: () => {
                console.log('Disconnected');
                setConnected(false);
            },
            onStompError: (frame) => {
                console.error('Broker error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onWebSocketClose: (closeEvent) => {
                console.log('WebSocket connection closed', closeEvent);
                setConnected(false);
            }
        });

        client.activate();

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, []);

    const sendHello = () => {
        if (stompClient && connected) {
            // שליחת הודעה פשוטה לשרת
            stompClient.publish({
                destination: '/app/hello',
                body: 'Hello from React!'
            });
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>WebSocket Hello World</h2>
            <p>Status: <strong style={{ color: connected ? 'green' : 'red' }}>{connected ? 'CONNECTED' : 'DISCONNECTED'}</strong></p>
            
            <button onClick={sendHello} disabled={!connected}>
                Say Hello to Server
            </button>

            <h4>Server Reply:</h4>
            <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px' }}>
                {serverResponse}
            </div>
        </div>
    );
};

export default WebSocketTest;