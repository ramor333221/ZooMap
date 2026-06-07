package com.example.zoo.Service.AI;

import com.example.zoo.Entities.Destination;
import com.example.zoo.Repositories.DestinationRepo;
import com.example.zoo.Service.NavigationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.agent.tool.Tool;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ZooDataTools {

    private final DestinationRepo destinationRepository;
    private final NavigationService navigationService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // A shared map to hold live group warnings between different users (Key: Location Name, Value: Issue description)
    private final Map<String, String> activeIssues = new ConcurrentHashMap<>();

    @Tool("Saves a new safety issue, dirt report, or closure reported by a guest for a specific location so the whole group knows.")
    public String reportLocationIssue(String locationName, String issueDescription) {
        log.info("AI Tool triggered: Reporting issue '{}' at '{}'", issueDescription, locationName);
        activeIssues.put(locationName.toLowerCase(), issueDescription);
        return "Successfully logged the issue: " + issueDescription + " at " + locationName;
    }

    @Tool("Retrieves all active issues, closures, or dirt warnings reported by guests across the zoo.")
    public String getActiveIssues() {
        if (activeIssues.isEmpty()) {
            return "No active issues reported. All paths are clean and clear!";
        }
        try {
            return objectMapper.writeValueAsString(activeIssues);
        } catch (Exception e) {
            return "Error fetching issues.";
        }
    }

    @Tool("Searches for a zoo destination or exhibit ID using its natural language name (e.g., 'Lions'). Returns matches with IDs.")
    public String searchDestinationIdByName(String name) {
        try {
            List<Destination> matches = destinationRepository.findByNameContainingIgnoreCase(name);
            return objectMapper.writeValueAsString(matches);
        } catch (Exception e) {
            return "Error looking up destination names.";
        }
    }

    @Tool("Calculates the best, shortest optimized route stopping by a list of target destination IDs.")
    public String calculateOptimizedRoute(List<Integer> targetIds, int startId, int endId) {
        try {
            var routeDto = navigationService.getOptimizedRoute(targetIds, startId, endId);
            List<String> stopNames = routeDto.getStops().stream()
                    .map(Destination::getName)
                    .collect(Collectors.toList());
            return "Route Found! Total Distance: " + routeDto.getTotalDistance() + " meters. Sequence: " + String.join(" -> ", stopNames);
        } catch (Exception e) {
            return "Could not calculate path: " + e.getMessage();
        }
    }

    @Tool("Retrieves all zoo destinations to see alternative options.")
    public String getAllZooDestinations() {
        try {
            return objectMapper.writeValueAsString(destinationRepository.findAll());
        } catch (Exception e) {
            return "Error.";
        }
    }
}