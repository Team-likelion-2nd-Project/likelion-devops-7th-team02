import { useState } from 'react'
import ProjectContext from './ProjectContext'
import { projects } from '../mocks/projects'

function ProjectProvider({ children }) {
  const [projectList, setProjectList] = useState(projects)

  const createProject = ({ name, description }) => {
    const newProject = {
      id: Date.now(),
      name,
      description,
      memberCount: 0,
      taskCount: 0,
      updatedAt: '방금 전',
      members: [],
      tasks: [],
    }

    setProjectList((prevProjects) => [
      ...prevProjects,
      newProject,
    ])

    return newProject
  }

  return (
    <ProjectContext.Provider
      value={{
        projectList,
        createProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectProvider