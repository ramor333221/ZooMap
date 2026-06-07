package com.example.zoo.Controller;

import com.example.zoo.DTO.ChatMessageDTO;
import com.example.zoo.Service.AI.ChatAiService;
import com.example.zoo.Service.AI.ZooNavigationAssistant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
@RequiredArgsConstructor
public class PublicWebSocketController {

    private final ChatAiService chatAiService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void handleChatMessage(@Payload ChatMessageDTO message) {
        // 1. זה ה-ID האמיתי והנכון שהדפדפן שלח!
        String customSessionId = message.getChatSessionId();
        log.info("Received message with custom chatSessionId from React: {}", customSessionId);

        try {
            // 2. קבלת תשובה מה-AI
            ChatMessageDTO response = chatAiService.processChatMessage(customSessionId, message);

            // 3. התיקון הקריטי: מוודאים שה-ID המקורי נשמר ולא הולך לאיבוד
            response.setChatSessionId(customSessionId);

            // 4. שימוש ב-customSessionId המקורי בשביל בניית נתיב השליחה
            String dynamicDestination = "/topic/reply-" + customSessionId;
            messagingTemplate.convertAndSend(dynamicDestination, response);

            log.info("AI response successfully sent to the CORRECT destination: {}", dynamicDestination);

        } catch (Exception e) {
            log.error("Failed to process or send AI message: {}", e.getMessage());
        }
    }

}