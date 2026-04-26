package com.example.zoo.Service;

import com.example.zoo.DTO.RouteResponseDTO;
import com.example.zoo.Entities.Destination;
import com.example.zoo.Entities.Route;
import com.example.zoo.Repositories.RouteRepo;
import com.example.zoo.Repositories.DestinationRepo;
import javax.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.jgrapht.Graph;
import org.jgrapht.GraphPath;
import org.jgrapht.alg.shortestpath.DijkstraShortestPath;
import org.jgrapht.alg.tour.TwoOptHeuristicTSP;
import org.jgrapht.graph.DefaultWeightedEdge;
import org.jgrapht.graph.SimpleWeightedGraph;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NavigationService {

    private final RouteService routeService;
    private final DestinationService destinationService;
    private final RouteRepo routeRepo;
    private final DestinationRepo destinationRepo;

    private DijkstraShortestPath<Integer, DefaultWeightedEdge> dijkstra;
    private Graph<Integer, DefaultWeightedEdge> currentGraph;

    @PostConstruct
    public void init() {
        refresh();
    }

    public synchronized void refresh() {
        this.currentGraph = routeService.buildGraph();
        this.dijkstra = new DijkstraShortestPath<>(currentGraph);
    }

    public RouteResponseDTO getOptimizedRoute(List<Integer> selectedTargetIds, Integer startId, Integer endId) {
        if (selectedTargetIds == null || selectedTargetIds.isEmpty()) return new RouteResponseDTO();

        Set<Integer> allNodesToVisit = new HashSet<>(selectedTargetIds);
        if (startId != null) allNodesToVisit.add(startId);
        if (endId != null) allNodesToVisit.add(endId);

        Graph<Integer, DefaultWeightedEdge> targetGraph = new SimpleWeightedGraph<>(DefaultWeightedEdge.class);
        allNodesToVisit.forEach(targetGraph::addVertex);

        List<Integer> nodeList = new ArrayList<>(allNodesToVisit);
        for (int i = 0; i < nodeList.size(); i++) {
            for (int j = i + 1; j < nodeList.size(); j++) {
                int u = nodeList.get(i);
                int v = nodeList.get(j);
                double weight = dijkstra.getPathWeight(u, v);
                if (weight < Double.MAX_VALUE) {
                    DefaultWeightedEdge e = targetGraph.addEdge(u, v);
                    if (e != null) targetGraph.setEdgeWeight(e, weight);
                }
            }
        }

        TwoOptHeuristicTSP<Integer, DefaultWeightedEdge> tspSolver = new TwoOptHeuristicTSP<>();
        List<Integer> tourIds = new ArrayList<>(tspSolver.getTour(targetGraph).getVertexList());
        List<Integer> orderedStopIds = processPath(tourIds, startId, endId);

        List<Integer> fullPathIds = new ArrayList<>();
        List<Route> pathEdges = new ArrayList<>();
        double totalDistance = 0;

        for (int i = 0; i < orderedStopIds.size() - 1; i++) {
            Integer u = orderedStopIds.get(i);
            Integer v = orderedStopIds.get(i + 1);
            GraphPath<Integer, DefaultWeightedEdge> path = dijkstra.getPath(u, v);

            if (path != null) {
                totalDistance += path.getWeight();
                List<Integer> segmentVertices = path.getVertexList();
                fullPathIds.addAll(segmentVertices.subList(0, segmentVertices.size() - 1));

                for (DefaultWeightedEdge edge : path.getEdgeList()) {
                    int s = currentGraph.getEdgeSource(edge);
                    int t = currentGraph.getEdgeTarget(edge);
                    routeRepo.findEdgeBetween(s, t).ifPresent(pathEdges::add);
                }
            }
        }
        fullPathIds.add(orderedStopIds.get(orderedStopIds.size() - 1));

        List<Destination> stops = fetchDestinationsInOrder(orderedStopIds);
        List<Destination> fullPathNodes = fetchDestinationsInOrder(fullPathIds);

        return new RouteResponseDTO(stops, fullPathNodes, pathEdges, totalDistance);
    }

    private List<Destination> fetchDestinationsInOrder(List<Integer> ids) {
        Map<Integer, Destination> destMap = destinationRepo.findAllById(ids)
                .stream().collect(Collectors.toMap(Destination::getId, d -> d));

        return ids.stream()
                .map(destMap::get)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private List<Integer> processPath(List<Integer> tour, Integer startId, Integer endId) {
        if (tour.size() <= 1) return tour;

        if (tour.get(0).equals(tour.get(tour.size() - 1))) {
            tour.remove(tour.size() - 1);
        }

        if (startId != null) {
            int startIndex = tour.indexOf(startId);
            if (startIndex != -1) Collections.rotate(tour, -startIndex);
        }

        if (endId != null && startId != null) {
            int endIndex = tour.indexOf(endId);
            if (endIndex < tour.size() / 2) {
                List<Integer> sub = tour.subList(1, tour.size());
                Collections.reverse(sub);
            }
        }
        return tour;
    }
}