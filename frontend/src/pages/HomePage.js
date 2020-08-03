import React from 'react'
import { ToastContainer } from 'react-toastify'
import { Link } from 'react-router-dom'

function HomePage() {
    return (
        <div>
            <ToastContainer closeButton={false} autoClose={5000} style={{marginTop: '54px'}}/>
            <Link to="/add">
                <button>Add</button>
            </Link>
            <h1>Hello</h1>
        </div>
    )
}

export default HomePage