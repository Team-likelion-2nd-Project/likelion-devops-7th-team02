export const normalizeTask = (task) => ({
  ...task,
  assignee:
    task.assigneeName ?? '담당자 없음',
})