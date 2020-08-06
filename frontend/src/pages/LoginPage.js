import React, { useState } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { blue } from '@material-ui/core/colors'
import TopNavBar from '../components/TopNavBar'
import customToast from '../components/Toast'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import logo from '../logo.PNG'

function LoginPage() {
    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    })

    const { username, password } = loginData
    const history = useHistory()

    const handleInput = e => {
        const {name, value} = e.target

        setLoginData({
            ...loginData,
            [name]: value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        axios({
            method: 'POST',
            url: `https://apostil.herokuapp.com/api/v1/users/login`,
            data: {
                username: loginData.username,
                password: loginData.password
            }
        })
        .then(result => {
            localStorage.setItem('jwt', result.data.token)
            history.push(`/home`)
        })
        .catch(error => {
            console.log(error.response)
            customToast.error(error.response.data.message, {
                boxShadow: '2px 2px 20px 2px rgba(0,0,0,0.3)'
            })
        })
    }

    const ColorButton = withStyles((theme) => ({
        root: {
          color: theme.palette.getContrastText(blue[500]),
          backgroundColor: '#00004d',
          marginTop: '30px',

          '&:hover': {
            backgroundColor: '#00004d',
            transform: 'scale(1.1)',
          },
        },
      }))(Button);

    const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    }));

    const classes = useStyles();
    return (
        <div>
            <ToastContainer closeButton={false} autoClose={5000} style={{marginTop: '54px'}}/>
            <TopNavBar title="Login" backpath="/"/>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{width: '100vw', height: '60vh'}}>
                    <img style={{width: '200px', position: 'absolute', left: '50%', top: '30%', transform:'translate(-50%, -50%)'}}src={logo} />
                </div>
                <div id="login-container">
                    <form id="login" className={classes.root} noValidate onSubmit={handleSubmit}>
                        <TextField className={classes.margin} type="text" label="Username" name="username" onChange={handleInput} value={username}/>
                        <TextField className={classes.margin} type="password" label="Password" name="password" onChange={handleInput} value={password}/>
                        <ColorButton type="submit" variant="contained" color="primary">
                                    Login
                        </ColorButton>
                    </form>
                </div>
            </div>
            </div>
    )
}

export default LoginPage