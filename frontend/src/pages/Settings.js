import React from 'react' 
import Button from "@material-ui/core/Button";
import { useHistory } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors'
import TopNavBar from '../components/TopNavBar'

const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(blue[500]),
      backgroundColor: '#00004d',
      margin: '10px 30px 10px 30px',

      '&:hover': {
        backgroundColor: '#00004d',
        transform: 'scale(1.1)',
      },
    },
  }))(Button);

function Settings () {
    const history = useHistory()

    const handleLogout = () => {
        localStorage.removeItem('jwt')
        history.push('/')
    }
    return (
        <div>
            <TopNavBar title="Settings" backpath="/home" /> 
            <div style={{width: '100vw', height: '100vh', display: 'flex'}}>
            <ColorButton style={{margin: 'auto', width:'50vw', backgroundColor: '#800000'}} onClick={handleLogout}>
                Logout
            </ColorButton>
            </div>
        </div>
    )
} 

export default Settings 