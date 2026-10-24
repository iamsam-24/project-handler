package com.lackji.project2.repository;

import com.lackji.project2.entity.Project;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public class ProjectRepository  {


    private EntityManager entityManager;

    public ProjectRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public void save(Project project){
        entityManager.persist(project);
    }

    public Project getProjectById(UUID id){
        return entityManager.find(Project.class,id);
    }

    public void remove(UUID id){
        entityManager.remove(id);
    }
}
