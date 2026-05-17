package com.example.zoo.Controllers;

import com.example.zoo.DTO.ChatMessageDTO;
import com.example.zoo.Service.ChatAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class PublicWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatAiService chatAiService;

    @MessageMapping("/chat")
    public void handleIncomingChat(@Payload ChatMessageDTO clientMessage, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        ChatMessageDTO aiResponse = chatAiService.processChatMessage(sessionId, clientMessage);
        messagingTemplate.convertAndSend("/queue/reply", aiResponse);
    }
}