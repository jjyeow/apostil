import React, { useState } from 'react'; 
import { withStyles, makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'

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

    const handleInput = e => {
        const {name, value} = e.target

        setData({
            ...data,
            [name]: value
        })
    }

    const CssTextField = withStyles({
        root: {
          '& label.Mui-focused': {
            color: 'purple',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'purple',
          },
        },
      })(TextField);

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
            console.log("WRONG PASSWORD")
        } else {
            axios({
                method: 'POST',
                url: 'http://localhost:5000/api/v1/users/signup',
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
                console.log(response)
            })
            .catch(error => {
                console.log(error.response)
            })

        }
    }


    return (
        <div>
            {/* <form className={classes.root} onSubmit={handleSubmit}>
                <input onChange={handleInput} name="username" type="text" placeholder="Username" value={data.username}></input>
                <input onChange={handleInput} name="first_name" type="text" placeholder="First Name" value={data.first_name}></input>
                <input onChange={handleInput} name="last_name" type="text" placeholder="Last Name" value={data.last_name}></input>
                <input onChange={handleInput} name="email" type="text" placeholder="Email" value={data.email}></input>
                <input onChange={handleInput} name="hp_number" type="text" placeholder="Phone Number" value={data.hp_number}></input>
                <input onChange={handleInput} name="password" type="password" placeholder="Password" value={data.password}></input>
                <input onChange={handleInput} name="confirm_password" type="password" placeholder="Confirm Password" value={data.confirm_password}></input>
                <input type="submit" />
            </form> */}

            <form className={classes.root} noValidate onSubmit={handleSubmit}>
                <CssTextField type="text" className={classes.margin} id="custom-css-standard-input1" label="Username" name="username" onChange={handleInput} defaultValue={username}/>
                {console.log(username)}
                <CssTextField name="first_name" className={classes.margin} id="custom-css-standard-input2" label="First Name" value={first_name} onChange={handleInput}/>
                <CssTextField name="last_name" className={classes.margin} id="custom-css-standard-input3" label="Last Name" value={last_name} onChange={handleInput}/>
                <CssTextField name="email" className={classes.margin} id="custom-css-standard-input4" label="Email" value={email} onChange={handleInput}/>
                <CssTextField name="hp_number" className={classes.margin} id="custom-css-standard-input5" label="Phone Number" value={hp_number} onChange={handleInput}/>
                <CssTextField name="password" className={classes.margin} id="custom-css-standard-input6" type="password" label="Password" value={password} onChange={handleInput}/>
                <CssTextField name="confirm_password" className={classes.margin} id="custom-css-standard-input7" type="password" label="Confirm Password" value={confirm_password} onChange={handleInput}/>
                <input type="submit"/>

            </form>

        </div>
    )
}

export default SignUpPage;