import React from 'react'
import { Link } from 'react-router-dom'

function CoverPage() {
    return (
        <div>
            <Link to="/signup">
                <button className="ui button">Sign Up</button>
            </Link>
        </div>
    )
}

export default CoverPage
