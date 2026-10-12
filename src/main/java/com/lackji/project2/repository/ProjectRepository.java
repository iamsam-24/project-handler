package com.lackji.project2.repository;

import com.lackji.project2.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public interface ProjectRepository extends JpaRepository<Project,Long> {



}
