package com.lackji.project2.controller;

import com.lackji.project2.dto.Requestdto;
import com.lackji.project2.dto.Responsedto;
import com.lackji.project2.entity.Project;
import com.lackji.project2.service.ProjectService;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lackji/project")

public class ProjectController {

    private ProjectService projectService;

    public  ProjectController(ProjectService projectService){
        this.projectService=projectService;

    }


    @PostMapping

    public ResponseEntity<Responsedto> createProject(@RequestBody Requestdto projectRequest) {
        Responsedto project=projectService.createProject(projectRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(project);


    }

    @GetMapping("/{id}")

    public ResponseEntity getProject(@PathVariable Long id){
        Project projectResponse=projectService.getProject(id);

        return ResponseEntity.ok(projectResponse);

    }

    @GetMapping("/getAll")

    public ResponseEntity<List<Project>> getAllProject(Project project){
        List<Project> projectResponse=projectService.getAllProject();

        return ResponseEntity.ok(projectResponse);

    }


    @DeleteMapping("/{id}")

   public ResponseEntity<Boolean> deleteProject(@PathVariable Long id){
        Boolean isDeleted= projectService.deleteProject(id);
        if(isDeleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(isDeleted);
    }

}
