package com.lackji.project2.controller;


import com.lackji.project2.entity.Tasks;
import com.lackji.project2.repository.ProjectRepository;
import com.lackji.project2.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.config.Task;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/lackji/task")
public class TaskController {

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    TaskService taskService;

    @PostMapping

    public ResponseEntity<String> createTask(@RequestBody Tasks tasks){
        taskService.createTask(tasks);
        return ResponseEntity.ok("Created");
    }

    @GetMapping{"/{id}"}

    public ResponseEntity<Task> getTask(@PathVariable Long id){
        Task tasks= taskService.getTask(id);
        return ResponseEntity.ok(tasks);

    }

    @PutMapping({"/id"})

    public ResponseEntity<String> updateTask(@PathVariable Long id, @RequestBody Task tasks){
        taskService.updateTask(id);
        return ResponseEntity.ok("Done");
    }

    @DeleteMapping("{/id}")

    public ResponseEntity<String> deleteTask(@PathVariable Long id){
        taskService.deleteTask(id);

        return ResponseEntity.ok("Done");
    }






}
