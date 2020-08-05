import React from 'react' 
import Button from "@material-ui/core/Button";
import { useHistory } from 'react-router-dom'
import TopNavBar from '../components/TopNavBar'


function Settings () {
    const history = useHistory()

    const handleLogout = () => {
        localStorage.removeItem('jwt')
        history.push('/')
    }
    return (
        <div>
            <TopNavBar title="Settings" backpath="/home" /> 
            <Button style={{marginTop: '60px'}} onClick={handleLogout}>
                Logout
            </Button>
        </div>
    )
} 

export default Settings 