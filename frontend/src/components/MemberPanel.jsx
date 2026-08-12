import MemberCreateModal from './MemberCreateModal'

function MemberPanel({
  memberList,
  isOwner,
  isMemberCreateOpen,
  isMemberLoading,
  memberError,
  onOpenCreate,
  onCloseCreate,
  onCreateMember,
}) {
  return (
    <section className="project-side-card">
      <div className="project-side-card-header">
        <h2>멤버</h2>

        {isOwner && (
          <button
            type="button"
            className="project-member-add-button"
            onClick={onOpenCreate}
          >
            + 추가
          </button>
        )}
      </div>

      {isOwner && (
        <MemberCreateModal
          isOpen={isMemberCreateOpen}
          onCreate={onCreateMember}
          onClose={onCloseCreate}
        />
      )}

      {isMemberLoading ? (
        <p className="project-section-empty">
          멤버를 불러오는 중입니다.
        </p>
      ) : memberError ? (
        <p className="project-section-empty">
          {memberError}
        </p>
      ) : memberList.length === 0 ? (
        <p className="project-section-empty">
          등록된 멤버가 없습니다.
        </p>
      ) : (
        <div className="project-member-list">
          {memberList.map((member) => (
            <div
              key={member.userId}
              className="project-member-item"
            >
              <div className="project-member-avatar">
                {member.name.charAt(0)}
              </div>

              <div className="project-member-info">
                <strong>{member.name}</strong>
                <span>{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default MemberPanel