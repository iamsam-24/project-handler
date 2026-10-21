package com.lackji.project2.service;

import com.lackji.project2.entity.TaskEntity;
import com.lackji.project2.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;


@Service
public class TaskService {

    TaskRepository taskRepository;


    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }


    @Transactional
    public void createTask(TaskEntity tasks){
        taskRepository.save(tasks);


    }
    @Transactional
    public TaskEntity getTask(Long id){
        TaskEntity tasks=taskRepository.findById(id);
        return tasks;

    }


    @Transactional
    public void updateTask(Long id, TaskEntity tasks){
        TaskEntity tasks1= taskRepository.findById(id);

        tasks1.setTitle(tasks.getTitle());
        tasks1.setPriority(tasks.getPriority());
        tasks1.setStatus(tasks.getStatus());
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.deleteTask(id);

    }




}
