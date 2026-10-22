package com.lackji.project2.entity;

import jakarta.persistence.*;

@Entity
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "project_id")
    private Project project;
    private String title;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    protected TaskEntity(){

    }//this should be added to run the get response in the postman
    //this is because jpa needs a no argument constructor


    public TaskEntity(Long id, Project project, String title, TasksStatus status, TaskPriority priority) {
        this.id = id;
        this.project = project;
        this.title = title;
        this.status = status;
        this.priority = priority;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }



    public TasksStatus getStatus() {
        return status;
    }

    public void setStatus(TasksStatus status) {
        this.status = status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }



    @Enumerated(EnumType.STRING)
    private TasksStatus status;
    @Enumerated(EnumType.STRING)
    private TaskPriority priority;
}
