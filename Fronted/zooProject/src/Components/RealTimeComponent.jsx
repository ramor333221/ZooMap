import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const RealTimeComponent = () => {
    const [info, setInfo] = useState("");
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws-endpoint');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            setStompClient(client);
            // Subscribe to user-specific queue
            client.subscribe('/user/queue/info', (message) => {
                setInfo(message.body);
            });
        });

        return () => { if(client) client.disconnect(); };
    }, []);

    const requestData = () => {
        if (stompClient) {
            stompClient.send("/app/request-info", {}, "Request Details");
        }
    };

    return (
        <div>
            <button onClick={requestData}>Get Real-Time Info</button>
            <p>Server says: {info}</p>
        </div>
    );
};

export default RealTimeComponent;