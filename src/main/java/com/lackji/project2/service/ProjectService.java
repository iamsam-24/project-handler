package com.lackji.project2.service;


import com.lackji.project2.dto.Requestdto;
import com.lackji.project2.dto.Responsedto;
import com.lackji.project2.entity.Project;
import com.lackji.project2.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.ResourceBundle;

@Service
public class ProjectService {

    private ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository){
        this.projectRepository=projectRepository;
    }

    public Responsedto createProject(Requestdto projectRequest){
        Project project= mapToEntity(projectRequest);
        Project projectResponse= projectRepository.save(project);

        return mapToDto(projectResponse);



    }

    public Project getProject(Long id){
        Optional<Project> projectResponse=projectRepository.findById(id);

     return projectResponse.get();
    }

    public List<Project> getAllProject(){
        List<Project> projectResponse= projectRepository.findAll();

        return projectResponse;
    }

    public Boolean deleteProject(Long id){
        Boolean isStudent = projectRepository.existsById(id);

        if(!isStudent) return false;

       projectRepository.deleteById(id);
       return true;
    }

    private Project mapToEntity(Requestdto requestdto){

        System.out.println(requestdto.getName());
        System.out.println(requestdto.getDescription());
        System.out.println(requestdto.getStatus());
        Project project = new Project();

        project.setDescription(requestdto.getDescription());
        project.setName(requestdto.getName());
        project.setStatus(requestdto.getStatus());

        return project;

    }

    private Responsedto mapToDto(Project project){
        Responsedto responsedto=new Responsedto();

        responsedto.setId(project.getId());
        responsedto.setDescription(project.getDescription());
        responsedto.setName(project.getName());
        responsedto.setStatus(project.getStatus());

        return responsedto;

    }

}
