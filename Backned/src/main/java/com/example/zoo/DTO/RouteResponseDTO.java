package com.example.zoo.DTO;

import com.example.zoo.Entities.Destination;
import com.example.zoo.Entities.Route;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import com.example.zoo.Entities.Destination;
import com.example.zoo.Entities.Route;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteResponseDTO {
    private List<Destination> stops;
    private List<Destination> fullPathNodes;
    private List<Route> pathEdges;
    private double totalDistance;
}
