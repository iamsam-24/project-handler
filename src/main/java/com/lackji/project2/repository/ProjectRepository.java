package com.lackji.project2.repository;

import com.lackji.project2.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public interface ProjectRepository extends JpaRepository<Project,Long> {
    Optional<Project> findByIdAndDeletedIsFalse();

    List<Project> findByDeletedIsFalse();
//    Boolean nameExists(String name);



}
