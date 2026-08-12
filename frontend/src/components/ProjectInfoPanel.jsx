function ProjectInfoPanel({
  project,
  memberCount,
  taskCount,
}) {
  return (
    <section className="project-side-card">
      <h2>프로젝트 정보</h2>

      <div className="project-info-list">
        <div className="project-info-row">
          <span>멤버</span>
          <strong>{memberCount}명</strong>
        </div>

        <div className="project-info-row">
          <span>Task</span>
          <strong>{taskCount}개</strong>
        </div>

        <div className="project-info-row">
          <span>최근 업데이트</span>
          <strong>{project.updatedAt}</strong>
        </div>
      </div>
    </section>
  )
}

export default ProjectInfoPanel