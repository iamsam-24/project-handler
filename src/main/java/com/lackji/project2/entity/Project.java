package com.lackji.project2.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Status getType() {
        return type;
    }
    public void setType(Status type){
        this.type=type;
    }


    public LocalDateTime getCreatedat() {
        return createdat;
    }

    public void setCreatedat(LocalDateTime createdat) {
        this.createdat = createdat;
    }

    private String name;
    private String description;
    public Status type;
    private LocalDateTime createdat;
    private Boolean deleted;

    public void setDeleted(Boolean deleted) {
        this.deleted=deleted;
    }

    public Boolean getDeleted(){
        return deleted;
    }

    public enum Status{
       Accepted,Pending,Completed,Failed
   }






}
