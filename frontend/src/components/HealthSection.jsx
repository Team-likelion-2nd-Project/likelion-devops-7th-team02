function HealthSection({
  healthStatus,
  healthHttpStatus,
  isHealthLoading,
  healthError,
}) {
  const isBackendHealthy =
    healthStatus === 'UP'

  return (
    <section className="project-section project-health">
      <div className="project-section-header">
        <div>
          <h2>Backend Health</h2>

          <p className="project-section-description">
            연결된 서비스 상태를 확인합니다.
          </p>
        </div>
      </div>

      <div className="health-summary">
        <div className="health-summary-item">
          <span>API Server</span>

          <div
            className={`health-status ${
              isBackendHealthy
                ? 'healthy'
                : ''
            }`}
          >
            <span className="health-dot" />

            {isHealthLoading
              ? '확인 중'
              : isBackendHealthy
                ? '정상'
                : '오류'}
          </div>
        </div>

        <div className="health-summary-item">
          <span>응답 상태</span>

          <strong>
            {isHealthLoading
              ? '확인 중'
              : healthHttpStatus
                ? `${healthHttpStatus} ${
                    healthHttpStatus === 200
                      ? 'OK'
                      : 'ERROR'
                  }`
                : '연결 실패'}
          </strong>
        </div>

        <div className="health-summary-item">
          <span>Environment</span>
          <strong>Development</strong>
        </div>
      </div>

      {healthError && (
        <p className="project-section-empty">
          {healthError}
        </p>
      )}
    </section>
  )
}

export default HealthSection