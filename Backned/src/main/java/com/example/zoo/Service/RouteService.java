package com.example.zoo.Service;

import com.example.zoo.DTO.RouteDTO;
import com.example.zoo.Entities.Destination;
import com.example.zoo.Entities.Point;
import com.example.zoo.Entities.Route;
import com.example.zoo.Exceptions.AppExceptions; // ייבוא קובץ החריגות המרכזי
import com.example.zoo.Repositories.RouteRepo;
import com.example.zoo.Repositories.DestinationRepo;
import org.jgrapht.Graph;
import org.jgrapht.graph.DefaultWeightedEdge;
import org.jgrapht.graph.SimpleWeightedGraph;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class RouteService {

    private final RouteRepo routeRepo;
    private final DestinationRepo destinationRepo;
    private final NavigationService navigationService;

    public RouteService(RouteRepo routeRepo,
                        DestinationRepo destinationRepo,
                        @Lazy NavigationService navigationService) {
        this.routeRepo = routeRepo;
        this.destinationRepo = destinationRepo;
        this.navigationService = navigationService;
    }

    // --- מתודת עזר פרטית לחישוב המרחק הגיאומטרי האמיתי על המפה ---
    private double calculateRealDistance(int fromId, int toId, List<Point> bodyPoints) {
        Destination fromDest = destinationRepo.findById(fromId)
                .orElseThrow(() -> new AppExceptions.ResourceNotFound("Origin destination not found with id: " + fromId));
        Destination toDest = destinationRepo.findById(toId)
                .orElseThrow(() -> new AppExceptions.ResourceNotFound("Target destination not found with id: " + toId));

        // בניית רשימה זמנית שמחברת כרונולוגית את כל המסלול: מוצא -> נקודות פיתול -> יעד
        List<Point> allPoints = new ArrayList<>();

        if (fromDest.getLocation() != null) {
            allPoints.add(fromDest.getLocation());
        }
        if (bodyPoints != null) {
            allPoints.addAll(bodyPoints);
        }
        if (toDest.getLocation() != null) {
            allPoints.add(toDest.getLocation());
        }

        double totalDistance = 0;

        // לולאה שמחשבת את מרחק קטעי הקו המצטברים (נוסחת פיתגורס)
        for (int i = 0; i < allPoints.size() - 1; i++) {
            Point p1 = allPoints.get(i);
            Point p2 = allPoints.get(i + 1);

            if (p1 != null && p2 != null) {
                totalDistance += Math.sqrt(Math.pow(p2.getX() - p1.getX(), 2) + Math.pow(p2.getY() - p1.getY(), 2));
            }
        }

        // עיגול ל-2 ספרות אחרי הנקודה העשרונית לטובת סדר ודיוק ב-DB
        return Math.round(totalDistance * 100.0) / 100.0;
    }

    @Transactional(readOnly = true)
    public List<Route> getAll() {
        List<Route> list = routeRepo.findAll();
        if (list.isEmpty()) {
            throw new AppExceptions.ResourceNotFound("No routes found in the system");
        }
        return list;
    }

    @Transactional
    public Route addRoute(RouteDTO dto) {
        // חישוב המרחק האמיתי על סמך הנקודות
        double computedDist = calculateRealDistance(dto.getFromD(), dto.getToD(), dto.getBodyPoints());

        // תיקון: שימוש ב-computedDist במקום ב-dto.getDist()
        Route newRoute = routeRepo.save(Route.builder()
                .dist(computedDist)
                .fromD(dto.getFromD())
                .toD(dto.getToD())
                .bodyPoints(dto.getBodyPoints())
                .build());

        navigationService.refresh();
        return newRoute;
    }

    @Transactional
    public Route updateRoute(int id, RouteDTO dto) {
        Route existingRoute = routeRepo.findById(id)
                .orElseThrow(() -> new AppExceptions.ResourceNotFound("Update failed: Route not found with id: " + id));

        if (existingRoute.getFromD() != dto.getFromD()) {
            if (routeRepo.countByFromD(existingRoute.getFromD()) <= 1) {
                throw new AppExceptions.BadRequest("Update rejected: Origin destination (" + existingRoute.getFromD() + ") would be left without an outgoing route!");
            }
        }

        if (existingRoute.getToD() != dto.getToD()) {
            if (routeRepo.countByToD(existingRoute.getToD()) <= 1) {
                throw new AppExceptions.BadRequest("Update rejected: Target destination (" + existingRoute.getToD() + ") would be left without an incoming route!");
            }
        }

        // חישוב המרחק המעודכן על סמך הנקודות החדשות/המעודכנות
        double computedDist = calculateRealDistance(dto.getFromD(), dto.getToD(), dto.getBodyPoints());

        existingRoute.setFromD(dto.getFromD());
        existingRoute.setToD(dto.getToD());
        // תיקון: עדכון השדה לערך המחושב האמיתי
        existingRoute.setDist(computedDist);
        existingRoute.setBodyPoints(dto.getBodyPoints());

        Route updatedRoute = routeRepo.save(existingRoute);
        navigationService.refresh();
        return updatedRoute;
    }

    @Transactional
    public void deleteRoute(int id) {
        Route route = routeRepo.findById(id)
                .orElseThrow(() -> new AppExceptions.ResourceNotFound("Route not found with id: " + id));
      if (routeRepo.countByFromD(route.getFromD()) <= 1 || routeRepo.countByToD(route.getToD()) <= 1) {
            throw new AppExceptions.BadRequest("Deletion failed: This would cause a destination to be isolated!");
        }

        routeRepo.deleteById(id);
        navigationService.refresh();
    }

    public Graph<Integer, DefaultWeightedEdge> buildGraph() {
        Graph<Integer, DefaultWeightedEdge> graph = new SimpleWeightedGraph<>(DefaultWeightedEdge.class);
        destinationRepo.findAll().forEach(d -> graph.addVertex(d.getId()));
        routeRepo.findAll().forEach(t -> {
            DefaultWeightedEdge e = graph.addEdge(t.getFromD(), t.getToD());
            if (e != null) graph.setEdgeWeight(e, t.getDist());
        });
        return graph;
    }
}