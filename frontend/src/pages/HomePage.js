import React, { useState, useEffect } from 'react'
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ToastContainer } from 'react-toastify'
import { Link } from 'react-router-dom'
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import { blue } from '@material-ui/core/colors'
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import BottomNavBar from '../components/BottomNavBar'
import Loading from '../components/Loading'
import axios from 'axios';

const useStyles = makeStyles({
    root: {
        margin: '20px',
        border: 'solid 2px black'

    },
    title: {
        fontSize: 14
    },
    pos: {
        marginTop: 10,
        fontSize: '14px',
        fontFamily: 'Crete Round, serif',
        textTransform: 'none'
    },
    closePos: {
        position: 'absolute', 
        right: '-15px',
        top: '-2px'
    },

    // amountPos: {
    //     fontFamily: 'san-serif',
    //     fontSize: 10,
    //     position: 'absolute',
    //     right: '15px',
    //     top: '48px'
    // },

    paidPos: {
        position: 'absolute', 
        fontWeight: 'bold',
        padding: 3,
        right: '-10px',
        bottom: '-2px',
        fontFamily: 'Bree Serif, serif'
    },

    editPos: {
        position: 'absolute', 
        right: '30px',
        top: '-3px'
    },

    duePos: {
        width: '100%',
        position: 'absolute',
        fontWeight: 'bold',
        fontSize: '60px',
        opacity: '0.3',
        textAlign: 'center',
        padding: 3,
        fontFamily: 'Bree Serif, serif',
        top: '50%',
        left:'50%',
        transform: 'translate(-50%,-50%) rotate(-30deg)',
        color: 'red'
    }
});

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        width: '80vw'
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose,...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose} >
                    <CloseIcon style={{fill: 'black'}}/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

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


function HomePage() {
    const classes = useStyles();
    const [userSubs, setUserSubs] = useState([])
    const jwt = localStorage.getItem('jwt')
    const [open, setOpen] = useState(false)
    const [modal, setModal] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [monthlyAmount, setMonthlyAmount] = useState(0)
    const [username, setUsername] = useState('')

    const handleOpen = (subs) => {
        setOpen(true)
        setModal(subs)
    }

    const handleClose = (sub) => {
        setOpen(false)
        setModal({})
    }

    const handleDelete = e => {
        const subsId = e.currentTarget.name
        axios({
            method: 'post',
            url: `https://apostil.herokuapp.com/api/v1/features/subs_delete/${subsId}`,
            headers: {
                Authorization: `Bearer ${jwt}`
            },
        })
        .then(result => {
            setIsLoading(true)
            setUserSubs(result.data.subscriptions)
            setIsLoading(false)
        })
        
        .catch(err => {
            console.log(err.response)
        })
    }

    const handlePaid = e => {
        const modalId = e.currentTarget.name
        axios({
            method: 'post',
            url: `https://apostil.herokuapp.com/api/v1/features/status/${modalId}`,
            headers: {
                Authorization: `Bearer ${jwt}`
            },
        })
        .then(result => {
            setOpen(false)
            setIsLoading(true)
            setUserSubs(result.data.subscriptions)
            setIsLoading(false)
        })
        .catch(err => {
            console.log(err.response)
        })
    }
    useEffect(() => {
        axios({
            method: 'get',
            url: 'https://apostil.herokuapp.com/api/v1/features/subscriptions',
            headers: {
                Authorization: `Bearer ${jwt}`
            },
        })
        .then(result => {
            setUserSubs(result.data.subscriptions)
            setMonthlyAmount(result.data.monthly_amount)
            setUsername(result.data.username)
            setIsLoading(false)
        })
        .catch(err => {
            console.log(err.response)
        })
    })

    
    if (isLoading) {
        return <Loading />
    }

    if (userSubs.length == 0) {
        return (
            <div>
                <div style={{display: 'flex', justifyContent:'space-between'}}>
                    <div style={{margin: '20px 20px 5px 20px', fontFamily: 'Merriweather, serif'}}>
                        <h4 style={{margin:'0'}}>Welcome back,</h4>
                        <h4 style={{margin:'2px auto 0px auto'}}>{username}</h4>
                    </div>
                    <div style={{margin: '20px 20px 5px 20px'}}>
                        <h5 style={{ margin: '0', fontFamily: 'Merriweather, serif', textAlign: 'right', color: 'gray'}}>Monthly</h5>
                        <h4 style={{ margin: '2px auto 0px auto', fontFamily: 'Merriweather, serif'}}>RM{(Math.round(monthlyAmount*100)/100).toFixed(2)}</h4>
                    </div>
                </div>
                <h1 style={{
                        fontFamily: 'Arvo, serif',
                        opacity: '0.4',
                        height: '70vh',
                        margin: '0, 20px, 0, 20px',
                        paddingTop: '30vh',
                        textAlign: 'center'
                    }}>No Subscriptions yet!</h1>
                
                <BottomNavBar addpath="/add" settingspath="/settings" />
            </div>
        )
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent:'space-between'}}>
                <div style={{margin: '20px 20px 5px 20px', fontFamily: 'Merriweather, serif'}}>
                    <h4 style={{margin:'0'}}>Welcome back,</h4>
                    <h4 style={{margin:'2px auto 0px auto'}}>{username}</h4>
                </div>
                <div style={{margin: '20px 20px 5px 20px'}}>
                    <h5 style={{ margin: '0', fontFamily: 'Merriweather, serif', textAlign: 'right', color: 'gray'}}>Monthly</h5>
                    <h4 style={{ margin: '2px auto 0px auto', fontFamily: 'Merriweather, serif'}}>RM{(Math.round(monthlyAmount*100)/100).toFixed(2)}</h4>
                </div>
            </div>
            {userSubs.map(subs => (
                <Card className={classes.root} >
                <CardActions style={{position: 'relative'}}>
                    <Button onClick={() => { handleOpen(subs)}} name={subs.id}>
                    {/* <Button onClick={() => { handleClickOpen(history) }} name={history.id} > */}
                        <CardContent style={{ width: "90vw", textAlign: "left" }}>
                            <Typography variant="h5" component="h2" style={     subs.name.toLowerCase() == "netflix" ? {color: '#E50914', fontFamily:'Arvo, serif'} : 
                                                                                subs.name.toLowerCase() == "spotify" ? {color: '#1DB954', fontFamily:'Arvo, serif'} : 
                                                                                subs.name.toLowerCase() == "water" ? {color: '#2bc2d9', fontFamily:'Arvo, serif'} : 
                                                                                subs.name.toLowerCase() == "electricity" || subs.name.toLowerCase() == "electric" ? {color: '#f2f222', fontFamily:'Arvo, serif'} : {fontFamily:'Arvo, serif'}}>
                                {subs.name}
                            </Typography>
                            <Typography className={classes.pos}>Next Payment: {subs.next_payment.toUpperCase()}</Typography>
                            <Typography className={classes.pos}>{subs.str_amount}</Typography>
                            {subs.due ? <Typography className={classes.duePos}>Due</Typography> : null}
                            {subs.paid ? <Typography className={classes.paidPos}>Paid</Typography> : null}
                        </CardContent>
                    </Button>
                    <Button className={classes.closePos} name={subs.id} onClick={handleDelete}>
                        <CloseIcon/>
                    </Button>
                    <Link to={{pathname: '/edit', state:{data: subs.id}}}>
                        <Button className={classes.editPos} name={subs.id}>
                            <EditRoundedIcon/>
                        </Button>
                    </Link>
                    {/* <Button onClick={handleDelete} name={history.id}>
                        <CloseIcon className={requestLoading == history.id ? 'spinning' : ''} />
                    </Button> */}
                </CardActions>
                </Card>
            ))}

        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}  >
            <DialogTitle id="customized-dialog-title" onClose={handleClose} style={ !open ? null : modal.name.toLowerCase() == "netflix" ? {backgroundColor: '#E50914', fontFamily: 'Arvo,serif'} : 
                                                                                    modal.name.toLowerCase() == "spotify" ? {backgroundColor: '#1DB954', fontFamily: 'Arvo,serif'} : 
                                                                                    modal.name.toLowerCase() == "water" ? {backgroundColor: '#2bc2d9', fontFamily: 'Arvo,serif'} : 
                                                                                    modal.name.toLowerCase() == "electricity" || modal.name.toLowerCase() == "electric" ? {backgroundColor: '#f2f222', fontFamily:'Arvo, serif'} : {fontFamily: 'Arvo,serif'}}>
                {modal.name}
            </DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    <table style={{margin: 'auto', fontFamily: 'Crete Round, serif'}} >
                        <tr>
                            <td style={{padding: '8px 10px 0 0'}}>Next Payment: </td>
                            <td style={{padding: '8px 0 0 0'}}>{modal.next_payment}</td>
                        </tr>
                        <tr>
                            <td style={{padding: '8px 10px 0 0'}}>Amount: </td>
                            <td style={{padding: '8px 0 0 0'}}>{modal.str_amount}</td>
                        </tr>
                        <tr>
                            <td style={{padding: '8px 10px 0 0'}}>Status: </td>
                            <td style={{padding: '8px 0 0 0'}}>{modal.paid ? "Paid": "Unpaid"}</td>
                        </tr>

                        <tr>
                            <td style={{padding: '8px 10px 0 0', verticalAlign: 'top'}}>Description: </td>
                            <td style={{padding: '8px 0 0 0'}}>{!modal.description ? "No description" : modal.description}</td>
                        </tr>
                    </table>
                </Typography>
            </DialogContent>
            <ColorButton type="submit" variant="contained" color="primary" onClick={handlePaid} name={modal.id} style={ !open ? null :  modal.name.toLowerCase() == "netflix" ? {backgroundColor: '#E50914', color: 'black'} :
                                                                                                                                        modal.name.toLowerCase() == "spotify" ? {backgroundColor: '#1DB954', color: 'black'} :
                                                                                                                                        modal.name.toLowerCase() == "water" ? {backgroundColor: '#2bc2d9', color: 'black'} :
                                                                                                                                        modal.name.toLowerCase() == "electricity" || modal.name.toLowerCase() == "electric" ? {backgroundColor: '#f2f222', color: 'black'} : {color: 'white'}}>
                {modal.paid ? "Unpaid" : "Paid" }
            </ColorButton>
        </Dialog>
        <div style={{display: 'block', height: '100px'}}></div>
        <BottomNavBar addpath="/add" settingspath="/settings" />     

        </div>
    )
}

export default HomePage