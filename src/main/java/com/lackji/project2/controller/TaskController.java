package com.lackji.project2.controller;


import com.lackji.project2.entity.TaskEntity;
import com.lackji.project2.repository.ProjectRepository;
import com.lackji.project2.service.TaskService;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/task")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @PostMapping("/{projectId}")

    public ResponseEntity<String> createTask(@PathVariable UUID projectId, @RequestBody TaskEntity tasks) {
        taskService.createTask(projectId,tasks);
        return ResponseEntity.ok("Created");
    }

    @GetMapping("/{id}")

    public ResponseEntity<TaskEntity> getTask(@PathVariable Long id) {
        TaskEntity tasks = taskService.getTask(id);
        return ResponseEntity.ok(tasks);

    }

    @GetMapping("/getAll")
    public ResponseEntity<List<TaskEntity>>  getAllTasks(){
        List<TaskEntity> taskEntityList= taskService.getAllTask();
        return ResponseEntity.ok(taskEntityList);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskEntity>> getTasksByProject(@PathVariable UUID projectId) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId));
    }

    @PutMapping("/{id}")

    public ResponseEntity<String> updateTask(@PathVariable Long id, @RequestBody TaskEntity tasks) {
        taskService.updateTask(id, tasks);
        return ResponseEntity.ok("Done");
    }

    @DeleteMapping("/{id}")

    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);

        return ResponseEntity.ok("Done");
    }

//    @GetMapping("/project/{projectId}/tasks")
//
//    public ResponseEntity<List<TaskEntity>> findTaskByProjectId(@PathVariable Long projectId) {
//
//        return ResponseEntity.ok(taskService.findTaskByProjectId(projectId));
//    }


}
