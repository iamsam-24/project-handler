package com.lackji.project2.entity;

import jakarta.persistence.*;

public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long project_id;
    private String title;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProject_id() {
        return project_id;
    }

    public void setProject_id(Long project_id) {
        this.project_id = project_id;
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

    public Tasks(Long id, Long project_id, String title, TasksStatus status, TaskPriority priority) {
        this.id = id;
        this.project_id = project_id;
        this.title = title;
        this.status = status;
        this.priority = priority;
    }

    @Enumerated(EnumType.STRING)
    private TasksStatus status;
    @Enumerated(EnumType.STRING)
    private TaskPriority priority;
}
