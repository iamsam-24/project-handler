package com.lackji.project2.repository;

import com.lackji.project2.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    public Optional<User> findById(UUID userId);


    @EntityGraph(attributePaths = "roles")
    public Optional<User> findByUsername(String username);

    @Modifying
    @Query(value = "DELETE FROM user_roles WHERE users_id = :userId", nativeQuery = true)
    void deleteRolesByUserId(@Param("userId") UUID userId);

    //at the find use the thing in get set and in near string use the actually given

}
