package com.example.zoo.Repositories;

import com.example.zoo.Entities.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DestinationRepo extends JpaRepository<Destination, Integer> {

}
