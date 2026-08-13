export const getCurrentProjectRole = (
  members,
  userId
) => {
  if (!members || !userId) {
    return null
  }

  const currentMember = members.find(
    (member) => member.userId === userId
  )

  return currentMember?.role ?? null
}