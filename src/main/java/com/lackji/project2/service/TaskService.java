package com.lackji.project2.service;

import com.lackji.project2.entity.TaskEntity;
import com.lackji.project2.repository.TaskRepository;
import jakarta.transaction.Transactional;



public class TaskService {

    TaskRepository taskRepository;


    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }


    public void createTask(TaskEntity tasks){
        taskRepository.save(tasks);


    }
    public void getTask(Long id){
        taskRepository.findById(id);
    }

    public void updateTask(Long id, TaskEntity tasks){
        TaskEntity tasks1= taskRepository.findById(id);

        tasks1.setTitle(tasks.getTitle());
        tasks1.setPriority(tasks.getPriority());
        tasks1.setStatus(tasks.getStatus());
    }

    public void deleteTask(Long id) {
        taskRepository.deleteTask(id);

    }




}
