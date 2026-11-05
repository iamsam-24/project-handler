package com.lackji.project2.service;

import com.lackji.project2.entity.Project;
import com.lackji.project2.entity.TaskEntity;
import com.lackji.project2.repository.ProjectRepository;
import com.lackji.project2.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;


    public TaskService(TaskRepository taskRepository,ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository=projectRepository;
    }


    @Transactional
    public void createTask(UUID projectId, TaskEntity tasks){
        Project project= projectRepository.getProjectById(projectId);

        tasks.setProject(project);

        taskRepository.save(projectId,tasks);


    }


    @Transactional
    public TaskEntity getTask(Long id){
        TaskEntity tasks=taskRepository.findById(id);
        return tasks;

    }
    @Transactional
    public List<TaskEntity> getAllTask(){
        return taskRepository.getAllTask();
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
//    @Transactional()
//    public List<TaskEntity> findTaskByProjectId(Long projectId){
//        return taskRepository.findByProjectId(projectId);
//    }
//



}
