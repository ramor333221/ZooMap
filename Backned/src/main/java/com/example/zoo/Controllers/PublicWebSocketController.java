package com.example.zoo.Controllers;

import com.example.zoo.DTO.RouteResponseDTO;
import com.example.zoo.Entities.Destination;
import com.example.zoo.Entities.Route;
import com.example.zoo.Service.DestinationService;
import com.example.zoo.Service.NavigationService;
import com.example.zoo.Service.RouteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // תוספת עבור הלוגים
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j // אנוטציה שמייצרת את האובייקט log אוטומטית
public class PublicWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/hello")
    public void sayHello(String clientMessage, SimpMessageHeaderAccessor headerAccessor) {
        // לוג שמראה שההודעה התקבלה בהצלחה בשרת
        log.info("=== WebSocket Message Received ===");
        log.info("Destination endpoint: /hello");
        log.info("Client raw message: {}", clientMessage);

        String reply = "Hello client! You sent: " + clientMessage;

        // Target response back to the specific session ID
        String sessionId = headerAccessor.getSessionId();
        log.info("Extracted Session ID: {}", sessionId);

        // לוג לפני שליחת התשובה חזרה ללקוח
        log.info("Sending reply to user queue [/queue/hello-reply]. Reply content: {}", reply);

        // שליחה לערוץ כללי שכולם יכולים להקשיב לו
        messagingTemplate.convertAndSend("/queue/hello-reply", reply);

        log.info("=== Finished processing /hello ===");
    }
}