package com.lackji.project2.controller;

import com.lackji.project2.entity.Project;
import com.lackji.project2.service.ProjectService;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lackji/project")

public class ProjectController {

    private ProjectService projectService;

    public  ProjectController(ProjectService projectService){
        this.projectService=projectService;

    }


    @PostMapping("/create")

    public ResponseEntity<Project> createProject(@RequestBody Project projectRequest) {
        Project project=projectService.createProject(projectRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(project);


    }

    @GetMapping("/get/{id}")

    public ResponseEntity<Project> getProject(@PathVariable Long id){
        Project projectResponse=projectService.getProject(id);

        return ResponseEntity.ok(projectResponse);

    }


}
