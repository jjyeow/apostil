import React from 'react'
import { Link } from 'react-router-dom'
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';

function BottomNavBar(props) {

    const emptyDiv = {
        width: '48px'
    }
    const bottomStyle = {
        width: '100vw',
        height: '50px',
        position: 'fixed', 
        bottom: '0',
        zIndex: '1000',
        background: '#00004d',
        display: 'flex',
        justifyContent: 'space-between',
    }
    return (
        <div style={bottomStyle}>
            <div style={emptyDiv}>
            </div>
            <Link to={props.addpath}>
            <IconButton style={{backgroundColor:'white', position: 'absolute', bottom:'25px', right:'50%', transform: 'translate(50%, 0)', width: '48px', height: '48px', boxShadow: '0px 0px 0px 10px white'}}>
                <AddCircleOutlinedIcon style={{ fontSize: 60, fill: '#00004d', margin: 'auto', border:'solid 1px white', borderRadius:'50%'}}/>
            </IconButton>
            </Link>
            <Link to={props.settingspath}>
                <IconButton>
                    <SettingsIcon style={{color: 'white' }}/>
                </IconButton>
            </Link>      
        </div>
    )
}

export default BottomNavBar