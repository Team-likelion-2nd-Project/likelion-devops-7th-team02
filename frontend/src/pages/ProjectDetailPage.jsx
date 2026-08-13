import { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import ProjectContext from '../context/ProjectContext'

import TaskBoard from '../components/TaskBoard'
import HealthSection from '../components/HealthSection'
import ProjectInfoPanel from '../components/ProjectInfoPanel'
import MemberPanel from '../components/MemberPanel'
import ServiceStatusPanel from '../components/ServiceStatusPanel'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { useProjectDetailData } from '../hooks/useProjectDetailData'
import { normalizeTask } from '../utils/task'

import { addMember } from '../api/memberApi'
import {
  createTask,
  updateTaskStatus,
  updateTaskAssignee,
} from '../api/taskApi'

import { getCurrentProjectRole } from '../utils/projectRole'

import './ProjectDetailPage.css'


function ProjectDetailPage() {
  const { projectId } = useParams()

  return (
    <ProjectDetailContent
      key={projectId}
      projectId={projectId}
    />
  )
}

function ProjectDetailContent({ projectId }) {
  const {
    projectList,
    currentUser,
    isLoading: isProjectLoading,
    error: projectError,
  } = useContext(ProjectContext)

  const projectSummary = projectList.find(
    (project) =>
      project.id === Number(projectId)
  )

  const {
    projectDetail,
    isProjectDetailLoading,
    projectDetailError,

    memberList,
    setMemberList,
    isMemberLoading,
    memberError,

    taskList,
    setTaskList,
    isTaskLoading,
    taskError,

    healthStatus,
    healthHttpStatus,
    isHealthLoading,
    healthError,
  } = useProjectDetailData(projectId)

  const project =
    projectDetail ?? projectSummary

  // UI State
  const [isMemberCreateOpen, setIsMemberCreateOpen] =
    useState(false)

  const [isTaskCreateOpen, setIsTaskCreateOpen] =
    useState(false)

  const [openTaskMenuId, setOpenTaskMenuId] =
    useState(null)

  const isOwner =
    getCurrentProjectRole(
      memberList,
      currentUser?.userId
    ) === 'OWNER'

  const handleCreateMember = async ({ email }) => {
    const response = await addMember(
      projectId,
      { email }
    )

    const newMember = response.data.data

    setMemberList((prevMembers) => [
      ...prevMembers,
      newMember,
    ])

    return newMember
  }

  const handleCreateTask = async ({
    title,
    description,
    assigneeId,
  }) => {
    const response = await createTask(
      projectId,
      {
        title,
        description,
        assigneeId,
      }
    )

    const newTask = normalizeTask(
      response.data.data
    )

    setTaskList((prevTasks) => [
      ...prevTasks,
      newTask,
    ])

    return newTask
  }

  const handleTaskStatusChange = async (
    taskId,
    status
  ) => {
    const response = await updateTaskStatus(
      projectId,
      taskId,
      status
    )

    const updatedTask = normalizeTask(
      response.data.data
    )

    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? updatedTask
          : task
      )
    )

    return updatedTask
  }

  const handleTaskTitleChange = (taskId, title) => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, title }
          : task
      )
    )
  }

  const handleTaskAssigneeChange = async (
    taskId,
    assigneeId
  ) => {
    const response = await updateTaskAssignee(
      projectId,
      taskId,
      assigneeId
    )

    const updatedTask = normalizeTask(
      response.data.data
    )

    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? updatedTask
          : task
      )
    )

    return updatedTask
  }
  const handleDeleteTask = (taskId) => {
    setTaskList((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    )
  }

  if (isProjectLoading || isProjectDetailLoading) {
    return (
      <div className="project-detail-page">
        <Loading />
      </div>
    )
  }

  if (projectError || projectDetailError) {
    return (
      <div className="project-detail-page">
        <ErrorMessage
          message={projectError || projectDetailError}
        />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <p>프로젝트를 찾을 수 없습니다.</p>
        <Link to="/projects">
          프로젝트 목록으로 돌아가기
        </Link>
      </div>
    )
  }

    const isBackendHealthy =
      healthStatus === 'UP'

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

      <div className="project-detail-content">
        <div className="project-main-column">
          {/* Task Board */}
          <TaskBoard
            taskList={taskList}
            memberList={memberList}
            isTaskCreateOpen={isTaskCreateOpen}
            isTaskLoading={isTaskLoading}
            taskError={taskError}
            openTaskMenuId={openTaskMenuId}
            onOpenTaskCreate={() => setIsTaskCreateOpen(true)}
            onCloseTaskCreate={() => setIsTaskCreateOpen(false)}
            onCreateTask={handleCreateTask}
            onMenuToggle={(taskId) =>
              setOpenTaskMenuId((prevId) =>
                prevId === taskId ? null : taskId
              )
            }
            onMenuClose={() => setOpenTaskMenuId(null)}
            onTitleChange={handleTaskTitleChange}
            onStatusChange={handleTaskStatusChange}
            onAssigneeChange={handleTaskAssigneeChange}
            onDelete={handleDeleteTask}
          />

          {/* Backend Health */}
          <HealthSection
            healthStatus={healthStatus}
            healthHttpStatus={healthHttpStatus}
            isHealthLoading={isHealthLoading}
            healthError={healthError}
          />
        </div>

        {/* Right Panel */}
        <aside className="project-side-panel">
          {/* Project Info */}
          <ProjectInfoPanel
            project={project}
            memberCount={memberList.length}
            taskCount={taskList.length}
          />

          {/* Members */}
          <MemberPanel
            memberList={memberList}
            isOwner={isOwner}
            isMemberCreateOpen={isMemberCreateOpen}
            isMemberLoading={isMemberLoading}
            memberError={memberError}
            onOpenCreate={() => setIsMemberCreateOpen(true)}
            onCloseCreate={() => setIsMemberCreateOpen(false)}
            onCreateMember={handleCreateMember}
          />

          {/* Service Status */}
          <ServiceStatusPanel
            isBackendHealthy={isBackendHealthy}
            isHealthLoading={isHealthLoading}
          />
        </aside>
      </div>
    </div>
  )}

export default ProjectDetailPage