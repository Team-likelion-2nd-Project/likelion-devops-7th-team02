import { useEffect, useState } from 'react'

import { getProject } from '../api/projectApi'
import { getMembers } from '../api/memberApi'
import { getTasks } from '../api/taskApi'
import { getHealth } from '../api/healthApi'
import { normalizeTask } from '../utils/task'

export function useProjectDetailData(projectId) {
  // Project
  const [projectDetail, setProjectDetail] =
    useState(null)

  const [
    isProjectDetailLoading,
    setIsProjectDetailLoading,
  ] = useState(true)

  const [
    projectDetailError,
    setProjectDetailError,
  ] = useState('')

  // Member
  const [memberList, setMemberList] =
    useState([])

  const [isMemberLoading, setIsMemberLoading] =
    useState(true)

  const [memberError, setMemberError] =
    useState('')

  // Task
  const [taskList, setTaskList] =
    useState([])

  const [isTaskLoading, setIsTaskLoading] =
    useState(true)

  const [taskError, setTaskError] =
    useState('')

  // Health
  const [healthStatus, setHealthStatus] =
    useState(null)

  const [
    healthHttpStatus,
    setHealthHttpStatus,
  ] = useState(null)

  const [
    isHealthLoading,
    setIsHealthLoading,
  ] = useState(true)

  const [healthError, setHealthError] =
    useState('')

  useEffect(() => {
    let cancelled = false

    getProject(projectId)
      .then((response) => {
        if (cancelled) return

        setProjectDetail(
          response.data.data ?? null
        )
        setProjectDetailError('')
      })
      .catch((error) => {
        if (cancelled) return

        setProjectDetailError(
          error.response?.data?.message ??
            '프로젝트 상세 정보를 불러오지 못했습니다.'
        )
      })
      .finally(() => {
        if (!cancelled) {
          setIsProjectDetailLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [projectId])

  useEffect(() => {
    let cancelled = false

    getMembers(projectId)
      .then((response) => {
        if (cancelled) return

        setMemberList(
          response.data.data ?? []
        )
        setMemberError('')
      })
      .catch((error) => {
        if (cancelled) return

        setMemberError(
          error.response?.data?.message ??
            '프로젝트 멤버를 불러오지 못했습니다.'
        )
      })
      .finally(() => {
        if (!cancelled) {
          setIsMemberLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [projectId])

  useEffect(() => {
    let cancelled = false

    getTasks(projectId)
      .then((response) => {
        if (cancelled) return

        const tasks =
          response.data.data ?? []

        setTaskList(
          tasks.map(normalizeTask)
        )
        setTaskError('')
      })
      .catch((error) => {
        if (cancelled) return

        setTaskError(
          error.response?.data?.message ??
            '작업 목록을 불러오지 못했습니다.'
        )
      })
      .finally(() => {
        if (!cancelled) {
          setIsTaskLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [projectId])

  useEffect(() => {
    let cancelled = false

    getHealth()
      .then((response) => {
        if (cancelled) return

        setHealthStatus(
          response.data?.status ?? 'UNKNOWN'
        )
        setHealthHttpStatus(response.status)
        setHealthError('')
      })
      .catch((error) => {
        if (cancelled) return

        setHealthStatus('DOWN')
        setHealthHttpStatus(
          error.response?.status ?? null
        )
        setHealthError(
          'Backend Health Check에 실패했습니다.'
        )
      })
      .finally(() => {
        if (!cancelled) {
          setIsHealthLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return {
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
  }
}