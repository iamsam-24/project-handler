package com.lackji.project2.controller;


import com.lackji.project2.entity.TaskEntity;
import com.lackji.project2.repository.ProjectRepository;
import com.lackji.project2.service.TaskService;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lackji/task")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @PostMapping{"/project/{projectId}"}

    public ResponseEntity<String> createTask(@RequestBody TaskEntity tasks,@PathVariable Long projectId) {
        taskService.createTask(tasks);
        return ResponseEntity.ok("Created");
    }

    @GetMapping("/{id}")

    public ResponseEntity<TaskEntity> getTask(@PathVariable Long id) {
        TaskEntity tasks = taskService.getTask(id);
        return ResponseEntity.ok(tasks);

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

    @GetMapping("/project/{projectId}/tasks")

    public ResponseEntity<List<TaskEntity>> findTaskByProjectId(@PathVariable Long projectId) {

        return ResponseEntity.ok(taskService.findTaskByProjectId(projectId));
    }


}
