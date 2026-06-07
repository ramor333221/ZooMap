package com.example.zoo.Service.AI;

import com.example.zoo.DTO.ChatMessageDTO;
import com.example.zoo.Exceptions.AppExceptions;
import com.example.zoo.Repositories.DestinationRepo;
import com.example.zoo.Repositories.RouteRepo;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.service.AiServices;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

    private final DestinationRepo destinationRepository;
    private final RouteRepo routeRepoRepository;
    private ZooNavigationAssistant assistant;

    private final Map<String, ChatMemory> memories = new ConcurrentHashMap<>();

    @Value("${gemini.api.key}")
    private String apiKey;

    @PostConstruct
    public void init() {
        try {
            if (apiKey == null || apiKey.isEmpty() || apiKey.contains("YOUR_KEY")) {
                log.error("❌ Gemini API Key is missing or invalid in application.properties!");
                return;
            }

            // הגדרת המודל
            GoogleAiGeminiChatModel model = GoogleAiGeminiChatModel.builder()
                    .apiKey(apiKey)
                    .modelName("gemini-3.5-flash")
                    .build();

            // בניית ה-Service באמצעות ה-Core המעודכן
            this.assistant = AiServices.builder(ZooNavigationAssistant.class)
                    .chatLanguageModel(model)
                    .chatMemoryProvider(memoryId -> memories.computeIfAbsent(
                            memoryId.toString(),
                            id -> MessageWindowChatMemory.withMaxMessages(15)
                    ))
                    .build();

            log.info("✅ ZooWise AI Assistant initialized successfully with Gemini 1.5 Flash.");
        } catch (Exception e) {
            log.error("❌ Failed to initialize AI Assistant: {}", e.getMessage());
        }
    }

    public ChatMessageDTO processChatMessage(String sessionId, ChatMessageDTO userMessage) {
        log.info("Processing message for session: {}", sessionId);

        if (this.assistant == null) {
            throw new AppExceptions.AiServiceException("AI Assistant is currently offline. Configuration issue.");
        }

        try {
            // 1. שליפת נתונים מה-DB
            String dbSnapshot = destinationRepository.findAll().toString();
            String currentRouteSnapshot = routeRepoRepository.findAll().toString();

            if (dbSnapshot.equals("[]")) {
                throw new AppExceptions.ResourceNotFound("No destinations found in the database to provide context.");
            }
            // 2. קריאה ל-AI
            String aiResponseText = assistant.chatWithGuest(
                    sessionId,
                    userMessage.getText(),
                    dbSnapshot,
                    currentRouteSnapshot
            );

            // 3. בניית ה-DTO עם שימור ה-chatSessionId מהלקוח
            return ChatMessageDTO.builder()
                    .sender("ai")
                    .text(aiResponseText)
                    .timestamp(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
                    .chatSessionId(userMessage.getChatSessionId())
                    .build();

        } catch (AppExceptions.ResourceNotFound e) {
            throw e;
        } catch (Exception e) {
            log.error("Detailed error for session {}: ", sessionId, e);
            // עטיפת שגיאות כלליות של ה-API/רשת בשגיאת המערכת שלנו
            throw new AppExceptions.AiServiceException("Failed to communicate with AI Assistant. Please try again later.", e);
        }
    }

    public void clearSession(String sessionId) {
        memories.remove(sessionId);
        log.info("Memory cleared for session: {}", sessionId);
    }
}
