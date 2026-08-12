import api from './axios'

export const getTasks = (projectId) =>
  api.get(`/projects/${projectId}/tasks`)

export const getTask = (projectId, taskId) =>
  api.get(`/projects/${projectId}/tasks/${taskId}`)

export const createTask = (projectId, data) =>
  api.post(`/projects/${projectId}/tasks`, data)

export const updateTaskStatus = (
  projectId,
  taskId,
  status
) =>
  api.patch(
    `/projects/${projectId}/tasks/${taskId}/status`,
    { status }
  )

export const updateTaskAssignee = (
  projectId,
  taskId,
  assigneeId
) =>
  api.patch(
    `/projects/${projectId}/tasks/${taskId}/assignee`,
    { assigneeId }
  )