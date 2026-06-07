package com.example.zoo.Service.AI;

import com.example.zoo.DTO.ChatMessageDTO;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.service.AiServices;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatAiService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ZooDataTools zooDataTools;
    private ZooAINavigationAssistant assistant;

    private final Map<String, ChatMemory> memories = new ConcurrentHashMap<>();

    @Value("${gemini.api.key}")
    private String apiKey;

    @PostConstruct
    public void init() {
        try {
            if (apiKey == null || apiKey.isEmpty() || apiKey.contains("YOUR_KEY")) {
                log.error("❌ Gemini API Key is missing!");
                return;
            }

            GoogleAiGeminiChatModel model = GoogleAiGeminiChatModel.builder()
                    .apiKey(apiKey)
                    .modelName("gemini-3.5-flash")
                    .build();

            this.assistant = AiServices.builder(ZooAINavigationAssistant.class)
                    .chatLanguageModel(model)
                    .chatMemoryProvider(memoryId -> memories.computeIfAbsent(
                            memoryId.toString(),
                            id -> MessageWindowChatMemory.withMaxMessages(15)
                    ))
                    .tools(zooDataTools)
                    .build();
        } catch (Exception e) {
            log.error("❌ Failed to initialize AI Assistant: {}", e.getMessage());
        }
    }

    public ChatMessageDTO processChatMessage(String sessionId, ChatMessageDTO userMessage) {
        if (this.assistant == null) {
            return buildResponse("ai", "I'm currently offline.", sessionId);
        }

        try {
            // No more massive database payload serialization on every user message invocation!
            String aiResponseText = assistant.chatWithGuest(sessionId, userMessage.getText());

            return buildResponse("ai", aiResponseText, sessionId);
        } catch (Exception e) {
            log.error("Error in session {}: ", sessionId, e);
            return buildResponse("ai", "I'm sorry, I'm having trouble connecting.", sessionId);
        }
    }

    public void processAndBroadcast(String sessionId, ChatMessageDTO userMessage) {
        ChatMessageDTO response = processChatMessage(sessionId, userMessage);
        messagingTemplate.convertAndSend("/topic/reply-" + sessionId, response);
    }

    private ChatMessageDTO buildResponse(String sender, String text, String sessionId) {
        return ChatMessageDTO.builder()
                .sender(sender)
                .text(text)
                .timestamp(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
                .chatSessionId(sessionId)
                .build();
    }

    public void clearSession(String sessionId) {
        memories.remove(sessionId);
    }
}