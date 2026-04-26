package com.example.zoo.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.zoo.Entities.Users;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer> {
    Users findByUsername(String name);

}
