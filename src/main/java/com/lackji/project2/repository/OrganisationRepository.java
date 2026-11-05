package com.lackji.project2.repository;

import com.lackji.project2.entity.Organisation;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.parser.Entity;
import java.util.List;
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

    public List<Organisation> getAllOrg(){

        String sql ="SELECT * FROM organiation";

        return entityManager.createNativeQuery(sql, Organisation.class).getResultList();

    }

    public void deleteOrg(UUID id){
       Organisation organisation= entityManager.find(Organisation.class,id);

       if(organisation !=null){
           entityManager.remove(organisation);
       }
    }


    //checking if name already exists exception

    public Boolean nameExists(String name){
        Long count = entityManager.createQuery(
                "SELECT COUNT (o) FROM Organisation o WHERE o.name = :name",
                Long.class
        ).setParameter("name",name)
                .getSingleResult();

        return count >0;
    }
}
