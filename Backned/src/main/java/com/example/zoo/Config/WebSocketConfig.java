package com.example.zoo.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // מאפשר לשרת לשלוח הודעות בחזרה לנתיבים שמתחילים ב- /queue או /topic
        config.enableSimpleBroker("/topic", "/queue");

        // ה-Prefix של הבקשות שמגיעות מה-React ל-Controller
        config.setApplicationDestinationPrefixes("/app");

        // הגדרה קריטית! מורה ל-Spring לנתב הודעות פרטיות למשתמש דרך ה-Prefix הזה
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-endpoint")
                .setAllowedOriginPatterns("*")
                .setHandshakeHandler(new CustomHandshakeHandler());
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        registry.setMessageSizeLimit(128 * 1024); // הגדלת נפח הודעה (חשוב לתשובות AI ארוכות)
        registry.setSendTimeLimit(20 * 1000);
        registry.setSendBufferSizeLimit(512 * 1024);
    }
}