package com.example.zoo.Repositories;

import com.example.zoo.Entities.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepo extends JpaRepository<Destination, Integer> {
    List<Destination> findByNameContainingIgnoreCase(String name);
}
