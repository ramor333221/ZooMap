package com.example.zoo.Controller;

import com.example.zoo.DTO.ChatMessageDTO;
import com.example.zoo.Service.AI.ChatAiService;
import com.example.zoo.Service.AI.ZooAINavigationAssistant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@Slf4j
@RequiredArgsConstructor
public class PublicWebSocketController {

    private final ChatAiService chatAiService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void handleChatMessage(@Payload ChatMessageDTO message, Principal principal) {
        String sharedRoomId = message.getChatSessionId();
        String myUserId = principal.getName(); // The unique ID of the user who sent the message

        // AI processes the request using the SHARED group memory
        ChatMessageDTO aiResponse = chatAiService.processChatMessage(sharedRoomId, message);

        // Private delivery: Only the user who sent this specific message gets the reply
        messagingTemplate.convertAndSendToUser(myUserId, "/queue/reply", aiResponse);
    }
}