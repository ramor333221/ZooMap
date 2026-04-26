package com.example.zoo.DTO;

import com.example.zoo.Entities.Point;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteDTO {
    private double dist;
    private int fromD;
    private int toD;
    private List<Point> bodyPoints;
}