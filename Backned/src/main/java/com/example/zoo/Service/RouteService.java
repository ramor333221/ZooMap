package com.example.zoo.Service;

import com.example.zoo.DTO.RouteDTO;
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
        Route newRoute = routeRepo.save(Route.builder()
                .dist(dto.getDist())
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

        // וולידציה: מניעת מצב שבו עדכון משאיר יעד ללא מסלול יוצא
        if (existingRoute.getFromD() != dto.getFromD()) {
            if (routeRepo.countByFromD(existingRoute.getFromD()) <= 1) {
                throw new AppExceptions.BadRequest("Update rejected: Origin destination (" + existingRoute.getFromD() + ") would be left without an outgoing route!");
            }
        }

        // וולידציה: מניעת מצב שבו עדכון משאיר יעד ללא מסלול נכנס
        if (existingRoute.getToD() != dto.getToD()) {
            if (routeRepo.countByToD(existingRoute.getToD()) <= 1) {
                throw new AppExceptions.BadRequest("Update rejected: Target destination (" + existingRoute.getToD() + ") would be left without an incoming route!");
            }
        }

        existingRoute.setFromD(dto.getFromD());
        existingRoute.setToD(dto.getToD());
        existingRoute.setDist(dto.getDist());
        existingRoute.setBodyPoints(dto.getBodyPoints());

        Route updatedRoute = routeRepo.save(existingRoute);
        navigationService.refresh();
        return updatedRoute;
    }

    @Transactional
    public void deleteRoute(int id) {
        Route route = routeRepo.findById(id)
                .orElseThrow(() -> new AppExceptions.ResourceNotFound("Route not found with id: " + id));

        // וולידציה: בדיקה שהמחיקה לא יוצרת "אי" מבודד במפה
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