import React, { useState, useEffect} from 'react'
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

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

function EditSubs(props) {
    const jwt = localStorage.getItem('jwt')
    const classes= useStyles()
    const history = useHistory()
    const [initialSub, setInitialSub] = useState({
        name: '',
        amount: 0.00,
        description: '',
        frequency: '',
        payment_date: new Date()
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

        setInitialSub({
            ...initialSub,
            [name]: value
        })
    }

    const handleChange = e => {
        setInitialSub({
            ...initialSub,
            subs_type: e.target.value
        })
    }

    const handleDateChange = (date) => {
        setInitialSub({
            ...initialSub,
            payment_date: date
        });
    };

    const hanldeSubmit = e => {
        e.preventDefault()
        let day = '' + initialSub.payment_date.getDate()
        let month ='' + (initialSub.payment_date.getMonth() + 1)
        let year = '' + initialSub.payment_date.getFullYear()
        if (day.length == 1) {
            day = '0' + day
        }
        if (month.length == 1) {
            month = '0' + month
        }
        axios({
            method: 'post',
            url: `https://apostil.herokuapp.com/api/v1/features/edit/${props.location.state.data}`,
            data: {
                name: initialSub.name,
                amount: initialSub.amount,
                description: initialSub.description,
                frequency: initialSub.frequency,
                payment_date: `${year}-${month}-${day}`,
                subs_type: initialSub.subs_type
            },
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        .then(response => {
            setInitialSub({
                name: '',
                amount: 0.00,
                description: '',
                frequency: '',
                payment_date: new Date()
            })
            history.push('/home')
        })
        .catch(error => {
            console.log(error.response)
        })
    }
    

    const get_subs = () => {
        axios({
            method: 'get',
            url: `https://apostil.herokuapp.com/api/v1/features/sub_data/${props.location.state.data}`,
            headers: {
                Authorization: `Bearer ${jwt}`
            },
        })
        .then(result => {
            const {name, amount, description} = result.data.subscriptions
            setInitialSub({
                name: name,
                amount: amount,
                description: description, 
                frequency: '',
                subs_type: '',
                payment_date: new Date(),
            })
        })

        .catch(err => {
            console.log(err.response)
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
    const enabled = initialSub.name.length > 0  && initialSub.amount.length > 0 && initialSub.frequency.length > 0 && initialSub.subs_type.length > 0
    // get_subs()
    useEffect(get_subs,[])

    return (
        <div>
            <TopNavBar title="" backpath="/home" />
            <form noValidate onSubmit={hanldeSubmit}>
                <div style={{display: 'flex', 
                            position:"relative",
                            justifyContent: 'center',
                            margin: '70px 10px 10px 10px '}}>
                    
                    <CurrencyFormat value={initialSub.amount} 
                                    displayType={'input'} 
                                    thousandSeparator={true} 
                                    
                                    onValueChange={(values)=>{
                                        const {formattedValue, value} = values;
                                        setInitialSub({
                                            ...initialSub,
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
                                textAlign: 'center'}}>Put zero if your subscription is inconsistent</p>
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
                        value={initialSub.name}
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
                        value={initialSub.description}
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
                            value={initialSub.frequency}
                        />
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Period</InputLabel>
                            <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={initialSub.subs_type}
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
                            value={initialSub.payment_date}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>

                    <ColorButton type="submit" variant="contained" color="primary" disabled={!enabled} >
                        COMFIRM
                    </ColorButton>
                </div>
                    
            </form>
        </div>
    )
}

export default EditSubs