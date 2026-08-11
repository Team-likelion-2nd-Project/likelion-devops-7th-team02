import { Inbox } from 'lucide-react'
import './StateMessage.css'

function EmptyState({
  message = '데이터가 없습니다.',
}) {
  return (
    <div className="state-message state-message-empty">
      <div className="state-message-icon">
        <Inbox size={19} />
      </div>

      <p>{message}</p>
    </div>
  )
}

export default EmptyState