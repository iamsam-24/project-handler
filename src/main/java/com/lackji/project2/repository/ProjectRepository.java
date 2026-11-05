package com.lackji.project2.repository;

import com.lackji.project2.entity.Project;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.List;
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

  public List<Project> getAllProject(){
        String sql ="SELECT * FROM project;";
        return entityManager.createNativeQuery(sql, Project.class).getResultList();
  }

    public List<Project> getProjectsByOrganisation(UUID organisationId) {
        return entityManager.createQuery(
                "SELECT p FROM Project p WHERE p.organisation.id = :organisationId",
                Project.class
        ).setParameter("organisationId", organisationId).getResultList();
    }

    public void remove(UUID id){
        Project project=entityManager.find(Project.class,id);
        if(project!=null){
            entityManager.remove(project);
        }
    }

    public Boolean projectExists(String name, UUID organisationId){
        Long count = entityManager.createQuery(
                "SELECT COUNT (p) FROM Project p WHERE p.name = :name AND p.organisation.id = :organisationId"
                        , Long.class
        ).setParameter("name",name)
                .setParameter("organisationId", organisationId)
                .getSingleResult();

        return count>0;

    }
}
