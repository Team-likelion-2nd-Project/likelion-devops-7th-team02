import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
      <Link to="/projects">
        <strong>DevFlow</strong>
      </Link>

      <nav>
        <Link to="/projects">Projects</Link>
        <Link to="/health">Health</Link>
      </nav>
    </header>
  )
}

export default Header