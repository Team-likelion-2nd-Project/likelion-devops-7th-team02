package com.devflow.project.repository;

import com.devflow.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}