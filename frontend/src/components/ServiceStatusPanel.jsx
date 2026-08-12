function ServiceStatusPanel({
  isBackendHealthy,
  isHealthLoading,
}) {
  return (
    <section className="project-side-card">
      <h2>서비스 상태</h2>

      <div className="service-status-list">
        <div className="service-status-item">
          <span>Backend</span>

          <div className="service-status-value">
            <span
              className={`service-dot ${
                isBackendHealthy
                  ? 'healthy'
                  : ''
              }`}
            />

            {isHealthLoading
              ? '확인 중'
              : isBackendHealthy
                ? '정상'
                : '오류'}
          </div>
        </div>

        <div className="service-status-item">
          <span>Database</span>

          <div className="service-status-value">
            <span className="service-dot healthy" />
            정상
          </div>
        </div>

        <div className="service-status-item">
          <span>Frontend</span>

          <div className="service-status-value">
            <span className="service-dot healthy" />
            정상
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceStatusPanel