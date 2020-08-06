import React, { useState } from 'react'; 
import { withStyles, makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { blue } from '@material-ui/core/colors'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import TopNavBar from '../components/TopNavBar'
import customToast from '../components/Toast'
import { ToastContainer } from 'react-toastify' 
import 'react-toastify/dist/ReactToastify.css';

function SignUpPage() {
    const [data, setData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        hp_number: "",
        password: "",
        confirm_password: "",
    })

    const history = useHistory()

    const handleInput = e => {
        const {name, value} = e.target

        setData({
            ...data,
            [name]: value
        })
    }

    const ColorButton = withStyles((theme) => ({
        root: {
          color: theme.palette.getContrastText(blue[500]),
          backgroundColor: '#00004d',
          marginTop: '10px',

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

    

    const { username, first_name, last_name, email, hp_number, password, confirm_password} = data

    const handleSubmit = e => {
        e.preventDefault()
        
        if (data.confirm_password !== data.password) {
            customToast.error('Confirm Password are different!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
              })
        } else {            
            axios({
                method: 'POST',
                url: `https://apostil.herokuapp.com/api/v1/users/signup`,
                data: {
                    username: data.username,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    hp_number: data.hp_number,
                    password: data.password
                }
            })
            .then(response => {
                setData({
                    username: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    hp_number: "",
                    password: "",
                    confirm_password: ""
                })
                history.push('/login')
                console.log(response.data.message)
                customToast.success(response.data.message, {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                  });
                console.log(response)
            })
            .catch(error => {
                error.response.data.message.forEach(msg => customToast.error(msg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                }))
            })

        }
    }


    return (
        <div>
            <ToastContainer closeButton={false} autoClose={5000} style={{marginTop: '54px'}} />
            <TopNavBar title="Sign Up" backpath="/"/>
            <div id="signup-container">
                <form id="signup" className={classes.root} noValidate onSubmit={handleSubmit}>
                    <TextField className={classes.margin} type="text" label="Username" name="username" onChange={handleInput} value={username}/>
                    <TextField className={classes.margin} type="text" label="First Name" name="first_name" onChange={handleInput} value={first_name}/>
                    <TextField className={classes.margin} type="text" label="Last Name" name="last_name" onChange={handleInput} value={last_name}/>
                    <TextField className={classes.margin} type="text" label="Email" name="email" onChange={handleInput} value={email}/>
                    <TextField className={classes.margin} type="text" label="Phone Number" name="hp_number" onChange={handleInput} value={hp_number}/>
                    <TextField className={classes.margin} type="password" label="Password" name="password" onChange={handleInput} value={password}
                               helperText="*Make sure your password is at least 6 letter long, with at least a capital letter, special character and number!"/>
                    <TextField className={classes.margin} type="password" label="Confirm Password" name="confirm_password" onChange={handleInput} value={confirm_password}/>
                    <ColorButton type="submit" variant="contained" color="primary">
                        Submit
                    </ColorButton>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage;