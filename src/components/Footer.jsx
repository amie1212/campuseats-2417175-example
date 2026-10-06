import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-meta">
          <p className="copyright">
            Copyright &copy; {new Date().getFullYear()} CampusEats Inc. All rights reserved. &middot; BICS 3301 Cross-Platform Development &bull; IIUM
          </p>
          <div className="footer-links">
            <Link to="/">Explore Stalls</Link>
            <span className="separator">|</span>
            <Link to="/orders">Order History</Link>
            <span className="separator">|</span>
            <Link to="/admin">Staff Kitchen</Link>
            <span className="separator">|</span>
            <Link to="/profile">Student Profile</Link>
          </div>
        </div>
        <p className="subtext">
          Designed with an Apple-inspired clean aesthetic for IIUM Mahallah cafeteria pre-ordering.
        </p>
      </div>
    </footer>
  )
}

export default Footer
