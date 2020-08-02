import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../logo.png'

function CoverPage() {
    return (
        <div className="body">
            <img src={logo} />
            <Link to="/login">
                <button>Login</button>
            </Link>
            <Link to="/signup">
                <button>Sign Up</button>
            </Link>
        </div>
    )
}

export default CoverPage
