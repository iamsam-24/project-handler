package com.lackji.project2.controller;


import com.lackji.project2.entity.Project;
import com.lackji.project2.entity.TaskEntity;
import com.lackji.project2.service.ProjectService;
import jakarta.persistence.Table;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/project")

public class ProjectController {

    ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/{orgId}")
    public ResponseEntity<String> createProject(@RequestBody  Project project,@PathVariable UUID orgId){
        projectService.createProject(project,orgId);
        return ResponseEntity.ok("Done");

    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable UUID id){

       Project project= projectService.getProject(id);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Project>> getAllProjeect(){
        List<Project> projects= projectService.getAllProject();

        return ResponseEntity.ok(projects);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable UUID id){
        projectService.removeProject(id);
        return ResponseEntity.ok("Project and all related Tasks have been deleted ");
    }


    //    private ProjectService projectService;
//
//    public  ProjectController(ProjectService projectService){
//        this.projectService=projectService;
//
//    }
//
//
//    @PostMapping
//
//    public ResponseEntity<Responsedto> createProject(@RequestBody Requestdto projectRequest) {
//        Responsedto project=projectService.createProject(projectRequest);
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(project);
//
//
//    }
//
//
//    @PostMapping("/{id}/tasks")
//    public ResponseEntity<Project> addTask(@PathVariable Long id, @RequestBody TaskEntity tasks){
//        Project updatedProject= projectService.addTaskToProject(id,tasks);
//        return ResponseEntity.ok(updatedProject);
//
//    }
//
//    @GetMapping("/{id}")
//
//    public ResponseEntity getProject(@PathVariable Long id){
//        Project projectResponse=projectService.getProject(id);
//
//        return ResponseEntity.ok(projectResponse);
//
//    }
//
//    @GetMapping("/getAll")
//
//    public ResponseEntity<List<Project>> getAllProject(Project project){
//        List<Project> projectResponse=projectService.getAllProject();
//
//        return ResponseEntity.ok(projectResponse);
//
//    }
//
//
//    @DeleteMapping("/{id}")
//
//   public ResponseEntity<Boolean> deleteProject(@PathVariable Long id){
//        Boolean isDeleted= projectService.deleteProject(id);
//        if(isDeleted) {
//            return ResponseEntity.notFound().build();
//        }
//
//        return ResponseEntity.ok(isDeleted);
//    }

    ///soft delete means we actually delete it from just upper part ...but the data is still saved in the database

//    @PatchMapping("/delete-soft")
//    public ResponseEntity<Boolean> softDelete(@PathVariable Long id) {
//        Boolean isDeleted =projectService.softDelete(id);
//
//        if(isDeleted) {
//            return ResponseEntity.notFound().build();
//        }
//
//        return ResponseEntity.ok(true);
//    }

}
