import { Link, useParams } from 'react-router-dom'
import { projects } from '../mocks/projects'
import './ProjectDetailPage.css'

function ProjectDetailPage() {
  const { projectId } = useParams()

  const project = projects.find(
    (project) => project.id === Number(projectId)
  )

  if (!project) {
    return (
      <div className="project-detail-page">
        <p>프로젝트를 찾을 수 없습니다.</p>
        <Link to="/projects">프로젝트 목록으로 돌아가기</Link>
      </div>
    )
  }

  return (
    <div className="project-detail-page">
      <Link to="/projects" className="project-back-link">
        ← 프로젝트 목록
      </Link>

      <div className="project-detail-header">
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
      </div>

      <div className="project-summary">
        <div className="project-summary-card">
          <span>멤버</span>
          <strong>{project.memberCount}명</strong>
        </div>

        <div className="project-summary-card">
          <span>Task</span>
          <strong>{project.taskCount}개</strong>
        </div>

        <div className="project-summary-card">
          <span>최근 업데이트</span>
          <strong>{project.updatedAt}</strong>
        </div>
      </div>

      <div className="project-detail-content">
        <section className="project-section">
          <h2>작업</h2>
          <p>프로젝트 작업 목록이 표시될 영역입니다.</p>
        </section>

        <section className="project-section">
          <div className="project-section-header">
            <h2>멤버</h2>

            <button
              type="button"
              className="project-member-add-button"
            >
              + 멤버 추가
            </button>
          </div>

          {project.members.length === 0 ? (
            <p className="project-section-empty">
              등록된 멤버가 없습니다.
            </p>
          ) : (
            <div className="project-member-list">
              {project.members.map((member) => (
                <div
                  key={member.id}
                  className="project-member-item"
                >
                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="project-section">
          <h2>서비스 상태</h2>
          <p>Health 상태가 표시될 영역입니다.</p>
        </section>
      </div>
    </div>
  )
}

export default ProjectDetailPage