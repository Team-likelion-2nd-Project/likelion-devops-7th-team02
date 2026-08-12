import { CircleAlert } from 'lucide-react'
import './StateMessage.css'

function ErrorMessage({
  message = '오류가 발생했습니다.',
}) {
  return (
    <div className="state-message state-message-error">
      <div className="state-message-icon">
        <CircleAlert size={19} />
      </div>

      <p>{message}</p>
    </div>
  )
}

export default ErrorMessage