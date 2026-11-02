package com.lackji.project2.repository;

import com.lackji.project2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    public Optional<User> findById(UUID userId);

}
