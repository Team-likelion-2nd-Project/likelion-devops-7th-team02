import { Link } from 'react-router-dom'
import {
  FolderKanban,
  ListTodo,
  Users,
} from 'lucide-react'
import './ProjectCard.css'

function ProjectCard({ project }) {
  const memberCount = project.members?.length ?? 0
  const taskCount = project.tasks?.length ?? 0

  return (
    <Link
      to={`/projects/${project.id}`}
      className="project-card"
    >
      <div className="project-card-top">
        <div className="project-card-icon">
          <FolderKanban size={18} />
        </div>

        <span className="project-card-updated">
          {project.updatedAt}
        </span>
      </div>

      <div className="project-card-header">
        <h2>{project.name}</h2>
      </div>

      <p className="project-card-description">
        {project.description || '프로젝트 설명이 없습니다.'}
      </p>

      <div className="project-card-footer">
        <div>
          <Users size={14} />
          <span>{memberCount}명</span>
        </div>

        <div>
          <ListTodo size={14} />
          <span>Task {taskCount}개</span>
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard