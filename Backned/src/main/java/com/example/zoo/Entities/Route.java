package com.example.zoo.Entities;

import javax.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private int id;

    private double dist;
    private int fromD;
    private int toD;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "route_body_points",
            joinColumns = @JoinColumn(name = "route_id")
    )
    @OrderColumn(name = "point_order")
    @Builder.Default
    private List<Point> bodyPoints = new ArrayList<>();
}