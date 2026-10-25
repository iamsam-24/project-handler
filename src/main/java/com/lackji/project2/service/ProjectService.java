package com.lackji.project2.service;



import com.lackji.project2.core.exception.DuplicateFoundException;
import com.lackji.project2.entity.Organisation;
import com.lackji.project2.entity.Project;
import com.lackji.project2.repository.OrganisationRepository;
import com.lackji.project2.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProjectService {

    ProjectRepository projectRepository;
    OrganisationRepository organisationRepository;

    public ProjectService(ProjectRepository projectRepository, OrganisationRepository organisationRepository) {
        this.projectRepository = projectRepository;
        this.organisationRepository = organisationRepository;
    }


    @Transactional
    public void createProject(Project project, UUID orgId){
        Organisation organisation=organisationRepository.getOrgById(orgId);


        project.setOrganisation(organisation);


        if(projectExists(project)){
            throw new DuplicateFoundException(
                    "This project with: "+project.getName()+"already exists"
            );
        }
        projectRepository.save(project);



    }

    @Transactional
    public Project getProject(UUID id){
        return projectRepository.getProjectById(id);
    }

    @Transactional
    public void removeProject(UUID id){
        projectRepository.remove(id);
    }

    //    private ProjectRepository projectRepository;
//
//    public ProjectService(ProjectRepository projectRepository){
//        this.projectRepository=projectRepository;
//    }
//
//    public Responsedto createProject(Requestdto projectRequest){
//        Project project= mapToEntity(projectRequest);
//
//        //adding creating time response ...like other backend responses like caching or other thing...this thing take time in reponse
//        try {
//            Thread.sleep(2000);
//        }
//        catch (Exception e) {}
//
////
////        if(nameExists(project)){
////            throw new DuplicateFoundException("Project with same name "+ project.getName() +" already exits");
////        }
//
//
//
//        Project projectResponse= projectRepository.save(project);
//
//        return mapToDto(projectResponse);
//
//
//
//
//    }
//
//    public Project getProject(Long id){
//        Optional<Project> projectResponse = Optional.of(projectRepository
//                .findById(id)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException("Student with id: " + id + " not found ")));
//
//        try {
//            Thread.sleep(2000);
//        }
//        catch (Exception e) {}
//
//     return projectResponse.get();
//    }
//
//
//    public List<Project> getAllProject(){
//        List<Project> projectResponse= projectRepository.findAll();
//
//        return projectResponse;
//    }
//
//    @Transactional
//    public Project addTaskToProject(Long projectId,TaskEntity tasks){
//        Project project= getProject(projectId);
//        project.addTask(tasks);
//        return projectRepository.save(project);
//
//    }
//
//    public Boolean deleteProject(Long id){
//        Boolean isProject = projectRepository.existsById(id);
//
//        if(!isProject) return false;
//
//       projectRepository.deleteById(id);
//       return true;
//    }


//    public Boolean softDelete(Long id){
//       Optional<Project> existingProject= projectRepository.findByIdAndDeletedIsFalse();
//
//
//       if(existingProject.isEmpty()){
//           return false;
//       }
//
//       Project projectToSave=existingProject.get();
//       projectToSave.setDeleted(true);
//       projectRepository.save(projectToSave);
//
//       return true;
//    }


//    private Project mapToEntity(Requestdto requestdto){
//
//
//        Project project = new Project();
//
//        project.setDescription(requestdto.getDescription());
//        project.setName(requestdto.getName());
//        project.setType(requestdto.getType());
//
//        return project;
//
//    }

//    private Responsedto mapToDto(Project project) {
//        Responsedto responsedto = new Responsedto();
//
//        responsedto.setId(project.getId());
//        responsedto.setDescription(project.getDescription());
//        responsedto.setName(project.getName());
//        responsedto.setType(project.getType());
//
//        return responsedto;


//    private Boolean nameExists(Project project){
//       return projectRepository.nameExists(project.getName());
//    }


        //adding extra time to give response to api or to load it ...like caching (redis things) actually it gives time for other backend processes to run

    public Boolean projectExists(Project project){
        return projectRepository.projectExists(project.getName());

    }

    }

