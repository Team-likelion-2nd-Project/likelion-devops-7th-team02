import { Link } from 'react-router-dom'
import './ProjectCard.css'

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="project-card"
    >
      <div className="project-card-header">
        <h2>{project.name}</h2>
        <span>{project.memberCount}명</span>
      </div>

      <p className="project-card-description">
        {project.description}
      </p>

      <div className="project-card-footer">
        <span>Task {project.taskCount}개</span>
        <span>{project.updatedAt}</span>
      </div>
    </Link>
  )
}

export default ProjectCard
