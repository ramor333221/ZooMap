package com.example.zoo.Service;

import com.example.zoo.DTO.ChatMessageDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class ChatAiService {

    private final Map<String, List<ChatMessageDTO>> chatHistories = new ConcurrentHashMap<>();

    public ChatMessageDTO processChatMessage(String sessionId, ChatMessageDTO userMessage) {
        List<ChatMessageDTO> history = chatHistories.computeIfAbsent(sessionId, k -> new ArrayList<>());
        history.add(userMessage);
        log.info("Session {}: Added user message. Total history size: {}", sessionId, history.size());

        // 3. כאן בשלב הבא תשלב את הקריאה האמיתית ל-AI (כמו OpenAI, Gemini SDK וכו')
        // לצורך הדוגמה, ה-AI מקבל את *כל ההיסטוריה* ומחזיר מענה מותאם:
        String aiResponseText = callAiModelWithHistory(history);

        // 4. בניית אובייקט תגובה של ה-AI
        ChatMessageDTO aiMessage = new ChatMessageDTO(
                "ai",
                aiResponseText,
                new java.text.SimpleDateFormat("HH:mm").format(new java.util.Date())
        );

        history.add(aiMessage);
        return aiMessage;
    }

    private String callAiModelWithHistory(List<ChatMessageDTO> history) {
        // כאן מתבצעת הלוגיקה מול מודל ה-AI.
        // כרגע נחזיר תשובה סימולטיבית המבוססת על ההודעה האחרונה:
        ChatMessageDTO lastMessage = history.get(history.size() - 1);
        return "קיבלתי את שאלתך על: '" + lastMessage.getText() + "'. הנה המידע מה-AI...";
    }

    // פונקציה לניקוי הזיכרון כאשר משתמש מתנתק (אופציונלי)
    public void clearSession(String sessionId) {
        chatHistories.remove(sessionId);
        log.info("Cleared chat history for disconnected session: {}", sessionId);
    }
}