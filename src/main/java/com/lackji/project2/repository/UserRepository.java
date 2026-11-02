package com.lackji.project2.repository;

import com.lackji.project2.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    public Optional<User> findById(UUID userId);


    @EntityGraph(attributePaths = "roles")
    public Optional<User> findByUsername(String username);

    //at the find use the thing in get set and in near string use the actually given

}
