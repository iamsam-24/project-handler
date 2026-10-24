package com.lackji.project2.repository;

import com.lackji.project2.entity.Project;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public class ProjectRepository  {


    private EntityManager entityManager;

    public ProjectRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public void save(Project project){
        entityManager.persist(project);
    }
}
