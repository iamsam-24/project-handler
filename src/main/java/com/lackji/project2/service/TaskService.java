package com.lackji.project2.service;

import com.lackji.project2.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.config.Task;

public class TaskService {

    TaskRepository taskRepository;


    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional
    public void createTask(Task tasks){
        taskRepository.saveTask(tasks);
    }

    @Transactional

    public Task getTask(Long id){
        return taskRepository.getTask(id);

    }

    @Transactional
    public Task updateTask(Task tasks,Long id){
        Task tasks1 = taskRepository.getTask(id);

        tasks1.

    }



}
