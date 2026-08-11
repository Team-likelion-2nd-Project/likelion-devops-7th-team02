package com.devflow.project.service;

import com.devflow.global.exception.BusinessException;
import com.devflow.global.exception.ErrorCode;
import com.devflow.project.dto.ProjectCreateRequest;
import com.devflow.project.dto.ProjectListResponse;
import com.devflow.project.dto.ProjectResponse;
import com.devflow.project.entity.Project;
import com.devflow.project.repository.ProjectRepository;
import com.devflow.user.entity.User;
import com.devflow.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProjectResponse createProject(
            Long userId,
            ProjectCreateRequest request
    ) {

        User owner = userRepository.findById(userId)
                .orElseThrow(
                        () -> new BusinessException(ErrorCode.NOT_FOUND)
                );

        Project project = new Project(
                request.name(),
                request.description(),
                owner
        );

        Project savedProject = projectRepository.save(project);

        return ProjectResponse.from(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectListResponse> getMyProjects(Long userId) {

        return projectRepository
                .findAllByOwnerIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(ProjectListResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(
            Long userId,
            Long projectId
    ) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(
                        () -> new BusinessException(ErrorCode.NOT_FOUND)
                );

        if (!project.getOwner().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        return ProjectResponse.from(project);
    }
}