package com.example.zoo.DTO;


import com.example.zoo.Entities.Point;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DestinationDTO {
    private String name;
    private String picUrl;
    private String description;
    private String category;
    private Point location;
}
