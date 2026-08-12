import api from './axios'

export const getMembers = (projectId) =>
  api.get(`/projects/${projectId}/members`)

export const addMember = (projectId, data) =>
  api.post(`/projects/${projectId}/members`, data)