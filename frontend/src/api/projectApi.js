import api from './axios'

export const getProjects = () =>
  api.get('/projects')

export const getProject = (projectId) =>
  api.get(`/projects/${projectId}`)

export const createProject = (data) =>
  api.post('/projects', data)