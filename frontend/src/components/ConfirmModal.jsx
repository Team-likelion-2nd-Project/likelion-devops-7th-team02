function ConfirmModal({
  isOpen,
  message = '정말 진행하시겠습니까?',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  return (
    <div>
      <p>{message}</p>
      <button onClick={onConfirm}>확인</button>
      <button onClick={onCancel}>취소</button>
    </div>
  )
}

export default ConfirmModal