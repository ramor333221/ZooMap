package com.example.zoo.Controllers;

import com.example.zoo.DTO.RouteResponseDTO;
import com.example.zoo.Entities.Destination;
import com.example.zoo.Entities.Route;
import com.example.zoo.Service.DestinationService;
import com.example.zoo.Service.NavigationService;
import com.example.zoo.Service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final DestinationService destinationService;
    private final NavigationService navigationService;
    private final RouteService routeService;

    // שליפת כל היעדים הפעילים להצגה על המפה
    @GetMapping("/destinations")
    public ResponseEntity<List<Destination>> getAllDestinations() {
        return ResponseEntity.ok(destinationService.getAll());
    }

    // חישוב המסלול האופטימלי בין נקודות שנבחרו
    @PostMapping("/bestRoute")
    public ResponseEntity<RouteResponseDTO> getBestRoute(
            @RequestBody List<Integer> selectedIds,
            @RequestParam(required = false) Integer startId,
            @RequestParam(required = false) Integer endId) {

        RouteResponseDTO route = navigationService.getOptimizedRoute(selectedIds, startId, endId);
        return ResponseEntity.ok(route);
    }

    @GetMapping("/routes")
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(routeService.getAll());
    }
}