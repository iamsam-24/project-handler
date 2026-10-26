package com.lackji.project2.repository;


import com.lackji.project2.entity.Membership;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public class MembershipRepository {

    public MembershipRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    EntityManager entityManager;

    public void save(Membership membership){
        entityManager.persist(membership);
    }

    public Membership getById(UUID id){
        return  entityManager.find(Membership.class,id);
    }

    public void delete(UUID id){
        Membership membership=entityManager.find(Membership.class,id);

        if(membership!=null){
            entityManager.remove(membership);
        }
    }



}
