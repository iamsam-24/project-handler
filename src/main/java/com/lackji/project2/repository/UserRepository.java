package com.lackji.project2.repository;

import com.lackji.project2.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public class UserRepository {


    @PersistenceContext
    private EntityManager entityManager;

    public void save(User user){
        entityManager.persist(user);
    }


    public User findById(UUID id){
       return entityManager.find(User.class,id);


    }

    public void remove(UUID id){
        User user= entityManager.find(User.class,id);
        if (user!=null){
            entityManager.remove(user);
        }

    }

}
