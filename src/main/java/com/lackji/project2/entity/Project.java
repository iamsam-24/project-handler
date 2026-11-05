package com.lackji.project2.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "org_id",nullable = false)
    private Organisation organisation;

    //using cascade.remove to help remove the project along with task building two way relation so that both can be deleted at the same timne
    //because when deleting task onlyy task should be deleted and when deleting project the all task related to that project
    //should be deleted

    //using list beacuse one project can have various task so in order to store it and get all at same time we are using
    //list

    @OneToMany(mappedBy = "project",cascade=CascadeType.REMOVE)
    @JsonIgnore
    private List<TaskEntity> tasks= new ArrayList<>();


    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Organisation getOrganisation() {
        return organisation;
    }

    public void setOrganisation(Organisation organisation) {
        this.organisation = organisation;
    }

    public Project(UUID id, String name, String description, Organisation organisation) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.organisation = organisation;
    }

    protected Project(){

    }



//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    public String getName() {
//        return name;
//    }
//
//    public List<TaskEntity> getTasks() {
//        return tasks;
//    }
//
//
//    //here these lines are used to add task to the project ...so that we can access the task through the projects
//    public void addTask(TaskEntity task){
//        tasks.add(task);
//        task.setProject(this);
//
//    }
//
//
//    @OneToMany(mappedBy = "project" )
//    @JsonIgnore
//    private List<TaskEntity> tasks =new ArrayList<>();
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
//    }
//
//    public Status getType() {
//        return type;
//    }
//    public void setType(Status type){
//        this.type=type;
//    }
//
//
//    public LocalDateTime getCreatedat() {
//        return createdat;
//    }
//
//    public void setCreatedat(LocalDateTime createdat) {
//        this.createdat = createdat;
//    }
//
//    private String name;
//    private String description;
//    public Status type;
//    private LocalDateTime createdat;
//    private Boolean deleted;
//
//    public void setDeleted(Boolean deleted) {
//        this.deleted=deleted;
//    }
//
//    public Boolean getDeleted(){
//        return deleted;
//    }
//
//    public enum Status{
//       Accepted,Pending,Completed,Failed
//   }







}
