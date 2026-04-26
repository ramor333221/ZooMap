package com.example.zoo.Service;

import com.example.zoo.DTO.RouteDTO;
import com.example.zoo.Entities.Route;
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
        if (list.isEmpty()) throw new RuntimeException("אין מסלולים במערכת");
        return list;
    }

    @Transactional
    public Route addRoute(RouteDTO dto) {
        // הוספת bodyPoints לבנייה של האובייקט
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
                .orElseThrow(() -> new RuntimeException("עדכון נכשל: מסלול לא נמצא"));

        if (existingRoute.getFromD() != dto.getFromD()) {
            if (routeRepo.countByFromD(existingRoute.getFromD()) <= 1) {
                throw new RuntimeException("לא ניתן לעדכן: יעד המקור (" + existingRoute.getFromD() + ") יישאר ללא מסלול יוצא!");
            }
        }
        if (existingRoute.getToD() != dto.getToD()) {
            if (routeRepo.countByToD(existingRoute.getToD()) <= 1) {
                throw new RuntimeException("לא ניתן לעדכן: יעד היעד (" + existingRoute.getToD() + ") יישאר ללא מסלול נכנס!");
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
                .orElseThrow(() -> new RuntimeException("מסלול לא נמצא"));

        if (routeRepo.countByFromD(route.getFromD()) <= 1 || routeRepo.countByToD(route.getToD()) <= 1) {
            throw new RuntimeException("מחיקה תגרום ליעד מבודד!");
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