package com.example.zoo.Entities;

import javax.persistence.*;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
@Builder

@Entity
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String picUrl;
    private String description;
    private CategoryType category;
    private Point location;

    @Builder
    public Destination(String name, String picUrl, String description, CategoryType category, double x, double y) {
        this.name = name;
        this.picUrl = picUrl;
        this.description = description;
        this.category = category;
        this.location = new Point(x,y);
    }
}
