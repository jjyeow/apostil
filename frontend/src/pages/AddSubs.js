import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import CurrencyFormat from 'react-currency-format';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import Button from '@material-ui/core/Button'
import axios from 'axios';
import TopNavBar from '../components/TopNavBar'
import { setYear } from 'date-fns';



const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));


function AddSubs() {
    
    const jwt = localStorage.getItem('jwt')
    const classes= useStyles()
    const history = useHistory()
    const [subsInfo, setSubsInfo] = useState({
        name:"",
        description: "",
        amount: "",
        payment_date: new Date(),
        subs_type: "",
        frequency: "",
    })

    

    const moneyInputStyle={
        width: '75vw',
        height: '20vh',
        textAlign: 'center',
        fontSize: '10vw',
        fontFamily: 'Crete Round, serif'
    }

    const handleInput = e => {
        const {name, value} = e.target

        setSubsInfo({
            ...subsInfo,
            [name]: value
        })
    }

    const handleChange = e => {
        setSubsInfo({
            ...subsInfo,
            subs_type: e.target.value
        })
    }

    const handleDateChange = (date) => {
        setSubsInfo({
            ...subsInfo,
            payment_date: date
        });
    };

    const handleSubmit = e => {
        e.preventDefault()
        let day = '' + subsInfo.payment_date.getDate()
        let month ='' + (subsInfo.payment_date.getMonth() + 1)
        let year = '' + subsInfo.payment_date.getFullYear()
        if (day.length == 1) {
            day = '0' + day
        }
        if (month.length == 1) {
            month = '0' + month
        }

        axios({
            method: 'POST',
            url: 'https://apostil.herokuapp.com/api/v1/features/',
            data: {
                name: subsInfo.name,
                amount: subsInfo.amount,
                payment_date: `${year}-${month}-${day}`,
                subs_type: subsInfo.subs_type,
                frequency: subsInfo.frequency,
                description: subsInfo.description
            },
            headers: {
                Authorization: `Bearer ${jwt}`,
            }
        })
        .then(response => {
            setSubsInfo({
                name:"",
                description: "",
                amount: "",
                payment_date: new Date(),
                subs_type: "",
                frequency: "",
            })
            history.push('/home')
        })
        .catch(error => {
            console.log(error.response)
        })
    }

    const ColorButton = withStyles((theme) => ({
        root: {
        color: theme.palette.getContrastText('#00004d'),
        backgroundColor: '#00004d',
        marginTop: '30px',

        '&:hover': {
            backgroundColor: '#00004d',
            transform: 'scale(1.1)',
        },
        },
    }))(Button);
    

    const enabled = subsInfo.name.length > 0  && subsInfo.frequency.length > 0 && subsInfo.subs_type.length > 0
    return(
        <div>
            <TopNavBar title="" backpath="/home" />
            <form noValidate onSubmit={handleSubmit}>
                <div style={{display: 'flex', 
                            position:"relative",
                            justifyContent: 'center',
                            margin: '70px 10px 10px 10px '}}>
                    
                    <CurrencyFormat value={subsInfo.amount} 
                                    displayType={'input'} 
                                    thousandSeparator={true} 
                                    
                                    onValueChange={(values)=>{
                                        const {formattedValue, value} = values;
                                        setSubsInfo({
                                            ...subsInfo,
                                            amount: value
                                        })
                                    }}
                                    placeholder="0.00"
                                    decimalScale = "2"
                                    style={moneyInputStyle}/>
                    <p style={{ position: "absolute", 
                                bottom: 0, 
                                fontSize: '2.5vw',
                                fontFamily: 'Recursive, sans-serif', 
                                color: 'lightgray',
                                width:'60vw',
                                textAlign: 'center'}}>Leave it empty if your subscription amount is inconsistent</p>
                    <p style={{position: "absolute", top: '3vw', fontFamily: 'Recursive, sans-serif'}}>RM</p>
                </div>  
                <div style={{   width: '75vw',
                                display: 'flex',
                                flexDirection: 'column',
                                margin: 'auto'}}>
                    <TextField
                        id="outlined-margin-none"
                        label="Name"
                        style={{ marginTop: 8 }}
                        placeholder="eg. Spotify"
                        // helperText="Full width!"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        name="name"
                        onChange={handleInput}
                        value={subsInfo.name}
                    />
                    <TextField
                        id="outlined-margin-none"
                        label="Description (Optional)"
                        style={{ marginTop: 8 }}
                        placeholder="eg. Family Plan"
                        // helperText="Full width!"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        name="description"
                        onChange={handleInput}
                        value={subsInfo.description}
                    />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <TextField
                            id="outlined-margin-none"
                            label="Every"
                            style={{ marginTop: 8 }}
                            placeholder="eg. 1, 2, 3"
                            // helperText="Full width!"
                            margin="normal"
                            fullWidth
                            className={classes}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            name="frequency"
                            onChange={handleInput}
                            value={subsInfo.frequency}
                        />
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Period</InputLabel>
                            <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={subsInfo.subs_type}
                            onChange={handleChange}
                            label="Period"
                            >
                                <MenuItem value={'daily'}>Day(s)</MenuItem>
                                <MenuItem value={'weekly'}>Week(s)</MenuItem>
                                <MenuItem value={'monthly'}>Month(s)</MenuItem>
                                <MenuItem value={'yearly'}>Year(s)</MenuItem>
                            </Select>
                        </FormControl>

                    </div>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">
                            <KeyboardDatePicker
                            margin="normal"
                            id="date-picker-dialog"
                            label="Billing Date"
                            style={{width: '100%'}}
                            format="yyyy/MM/dd"
                            value={subsInfo.payment_date}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>

                    <ColorButton type="submit" variant="contained" color="primary" disabled={!enabled} >
                        Submit
                    </ColorButton>
                </div>
                    
            </form>
        </div>
    )
}

export default AddSubs