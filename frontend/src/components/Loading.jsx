import { LoaderCircle } from 'lucide-react'
import './StateMessage.css'

function Loading() {
  return (
    <div className="state-message state-message-loading">
      <div className="state-message-icon">
        <LoaderCircle size={19} />
      </div>

      <p>데이터를 불러오는 중입니다.</p>
    </div>
  )
}

export default Loading