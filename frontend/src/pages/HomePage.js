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
        position: 'absolute',
        border: 'solid 1px black',
        padding: 3,
        right: '30px',
        bottom: '-2px'
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
            url: `http://localhost:5000/api/v1/features/subs_delete/${subsId}`,
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
            url: `http://localhost:5000/api/v1/features/status/${modalId}`,
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
            url: 'http://localhost:5000/api/v1/features/subscriptions',
            headers: {
                Authorization: `Bearer ${jwt}`
            },
        })
        .then(result => {
            setUserSubs(result.data.subscriptions)
            setMonthlyAmount(result.data.monthly_amount)
            setIsLoading(false)
        })
        .catch(err => {
            console.log(err.response)
        })
    })

    
    if (isLoading) {
        return <div><h1>LOADING</h1></div>
    }


    return (
        <div>
            <ToastContainer closeButton={false} autoClose={5000} style={{marginTop: '54px'}}/>
            <Link to="/add">
                <button>Add</button>
            </Link>
            <Link to="/settings">
                <button>Settings</button>
            </Link>
            <h1 style={{fontFamily: 'Merriweather, serif'}}>{(Math.round(monthlyAmount*100)/100).toFixed(2)}</h1>
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
                            {subs.paid ? <Typography className={classes.paidPos}>Paid</Typography> : null}
                            {subs.due ? <Typography className={classes.duePos}>Due</Typography> : null}
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
                    <table style={{margin: 'auto', fontFamily: 'Crete Round, serif' }} >
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
                            <td style={{padding: '8px 10px 0 0'}}>Description: </td>
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


        </div>
    )
}

export default HomePage