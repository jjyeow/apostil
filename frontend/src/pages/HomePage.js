import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function HomePage() {
    return (
        <div>
            <ToastContainer closeButton={false} autoClose={5000} style={{marginTop: '54px'}}/>
            <h1>Hello</h1>
        </div>
    )
}

export default HomePage