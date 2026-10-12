package com.lackji.project2.service;


import com.lackji.project2.entity.Project;
import com.lackji.project2.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProjectService {

    private ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository){
        this.projectRepository=projectRepository;
    }

    public Project createProject(Project projectRequest){
        return projectRepository.save(projectRequest);

    }

    public Project getProject(Long id){
        Optional<Project> projectResponse=projectRepository.findById(id);

     return projectResponse.get();
    }

}
