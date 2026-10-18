package com.lackji.project2.dto;

import com.lackji.project2.entity.Project;

public class Responsedto {

    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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


    private String name;
    private String description;
    public Project.Status type;

    public Project.Status getType(){
        return type;
    }

    public void setType(Project.Status type){
        this.type=type;
    }

}
