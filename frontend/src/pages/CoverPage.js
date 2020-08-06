import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../logo.PNG'
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { blue } from '@material-ui/core/colors'

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
function CoverPage() {
    const logoStyle = {
        width: '200px',
        height: 'auto',
        position: 'absolute',
        left: '50%',
        top: '30%',
        transform: 'translate(-50%,-50%)'
    }
    const logoContainer = {
        width: '100vw',
        height: '60vh',
    }

    const buttonContainer = {
        width: '100vw',
        height: '40vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'

    }

    const LinkStyle = {
        textAlign: 'center'
    }
    const buttonStyle = {
        width: '60vw',
        marginTop: '0px',
        borderBottomRightRadius: '50px',
        borderTopRightRadius: '50px',
        borderBottomLeftRadius: '50px',
        borderTopLeftRadius: '50px',
    }

    return (
        <div className="body">
            <div style={logoContainer}>
                <img src={logo} style={logoStyle} />
            </div>

            <div style={buttonContainer}>
            <Link to="/login" style={LinkStyle}>
                <ColorButton style={buttonStyle}>Login</ColorButton>
            </Link>
            <Link to="/signup" style={LinkStyle}>
                <ColorButton style={buttonStyle}>Sign Up</ColorButton>
            </Link>
            </div>
        </div>
    )
}

export default CoverPage
