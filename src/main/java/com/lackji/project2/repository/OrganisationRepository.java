package com.lackji.project2.repository;

import com.lackji.project2.entity.Organisation;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.parser.Entity;
import java.util.UUID;

@Repository
public class OrganisationRepository {

    private EntityManager entityManager;

    public OrganisationRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public void save(Organisation organisation){
        entityManager.persist(organisation);
    }

    public Organisation getOrgById(UUID id){
        return entityManager.find(Organisation.class,id);
    }
}
