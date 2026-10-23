package com.lackji.project2.repository;

import com.lackji.project2.entity.TaskEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public class TaskRepository  {

    @PersistenceContext
  private EntityManager entity;



    //create
    public void save(Long projectId,TaskEntity tasks){
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


    //getting task by project id ...

//    public List<TaskEntity> findByProjectId(Long projectId){
//        return entity.createQuery(
//                "SELECT t FROM TaskEntity t WHERE t.project.id = :projectId",
//                TaskEntity.class
//        )
//                .setParameter("projectId",projectId)
//
//                .getResultList();
//    }





}
