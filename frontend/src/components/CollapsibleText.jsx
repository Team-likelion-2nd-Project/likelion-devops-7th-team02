import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import './CollapsibleText.css'

function CollapsibleText({ text, threshold = 120 }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const content = text ?? ''

  if (content.trim() === '') {
    return null
  }

  if (content.length <= threshold) {
    return <p className="collapsible-text">{content}</p>
  }

  return (
    <div className="collapsible-text-area">
      <p
        className={`collapsible-text ${
          isExpanded ? '' : 'clamped'
        }`}
      >
        {content}
      </p>

      <button
        type="button"
        className="collapsible-text-toggle"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
      >
        {isExpanded ? '접기' : '더보기'}
        <ChevronDown
          size={14}
          className={isExpanded ? 'rotated' : ''}
        />
      </button>
    </div>
  )
}

export default CollapsibleText