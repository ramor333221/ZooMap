package com.example.zoo.Repositories;

import com.example.zoo.Entities.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RouteRepo extends JpaRepository<Route, Integer> {
    @Query("SELECT t FROM Route t WHERE (t.fromD = :u AND t.toD = :v) OR (t.fromD = :v AND t.toD = :u)")
    Optional<Route> findEdgeBetween(@Param("u") Integer u, @Param("v") Integer v);
    long countByFromD(int fromD);
    long countByToD(int toD);
}
