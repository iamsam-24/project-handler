package com.lackji.project2.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.scheduling.config.Task;
import org.springframework.stereotype.Repository;

@Repository
public class TaskRepository {

    private EntityManager entity;

    @PersistenceContext

    //create
    public void saveTask(Task tasks){
        entity.persist(tasks);
    }

    //read

    public Task getTask(Long id){

        return entity.find(Task.class ,id);
    }

    //delete
    public void deleteTask(Long id){
        entity.remove(id);
    }





}
