package com.example.zoo.Service.AI;

import com.example.zoo.DTO.ChatMessageDTO;
import com.example.zoo.Repositories.DestinationRepo;
import com.example.zoo.Repositories.RouteRepo;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public interface ZooNavigationAssistant {
    @SystemMessage({
            "You are 'ZooWise', a professional and efficient concierge.",
            "Style: Concise, polite, and visually organized using icons.",

            "FORMAT RULES:",
            "- Use bullet points for clarity.",
            "- Use icons for every category (e.g., 🪧 for location, 🕒 for time, ℹ️ for info, ⚠️ for alerts).",
            "- Use specific animal emojis when mentioning them (🦁, 🐘, 🦒).",
            "- Keep answers short and direct. No long stories.",
            "- Answer in the language the user speaks (Hebrew/English).",

            "SERVICE RULES:",
            "- Always greet the user politely (Shalom/Welcome).",
            "- Use 'dbSnapshot' for 100% factual data.",
            "- If a path is blocked, provide the alternative route immediately.",
            "- Remember the user's name if provided.",

            "KNOWLEDGE:",
            "- Hours: 09:00 - 17:00.",
            "- Facilities: Restrooms and water are available near all major exhibits."
    })
    String chatWithGuest(@MemoryId String sessionId,
                         @UserMessage("userText") String userText,
                         @V("dbSnapshot") String dbSnapshot,
                         @V("currentRoute") String currentRoute);

   }
