package com.lackji.project2.repository;

import com.lackji.project2.entity.TaskEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

@Repository
public class TaskRepository {

    private EntityManager entity;

    @PersistenceContext

    //create
    public void save(TaskEntity tasks){
        entity.persist(tasks);
    }

    //read

    public TaskEntity findById(Long id){

        return entity.find(TaskEntity.class ,id);
    }

    //delete
    public void deleteTask(Long id){
        entity.remove(id);
    }





}
