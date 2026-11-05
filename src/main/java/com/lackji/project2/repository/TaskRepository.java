package com.lackji.project2.repository;

import com.lackji.project2.entity.TaskEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


@Repository
public class TaskRepository  {

    @PersistenceContext
  private EntityManager entity;



    //create
    public void save(UUID projectId, TaskEntity tasks){
        entity.persist(tasks);
    }

    //read

    public TaskEntity findById(Long id){

        return entity.find(TaskEntity.class ,id);
    }

    public List<TaskEntity> getAllTask(){
        String sql = "SELECT * FROM task_entity";

        return entity.createNativeQuery(sql, TaskEntity.class).getResultList();

    }

    public List<TaskEntity> getTasksByProject(UUID projectId) {
        return entity.createQuery(
                "SELECT t FROM TaskEntity t WHERE t.project.id = :projectId",
                TaskEntity.class
        ).setParameter("projectId", projectId).getResultList();
    }

    //delete
    public void deleteTask(Long id){

        TaskEntity tasks=entity.find(TaskEntity.class,id);

        if(tasks!=null){
            entity.remove(tasks);
        }
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
