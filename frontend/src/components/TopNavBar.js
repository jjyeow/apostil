import React from 'react' 
import { Link } from 'react-router-dom'
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded'
import IconButton from '@material-ui/core/IconButton'

const navbar_style = {
    background: '#00004d',
    color: 'white',
    width: '100vw',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'fixed',
    height: '54px',
    lineHeight: '54px',
    top: 0,
    left: 0,
    right: 0,
    fontFamily:'Arvo, serif'
    
}

const title_style = {
}

const empty_div = {
    width: '48px',
    height: '100%'
}
const TopNavBar = ({ title, backpath }) => {
    return (
        <div>
            <div style={navbar_style}>
                <Link to={backpath}>
                    <IconButton >
                        <ArrowBackRoundedIcon style={{fill: "white"}}/>
                    </IconButton>
                </Link>
                <b style={title_style}>{title}</b>
                <div style={empty_div}></div>
            </div>
        </div>
    )
}

export default TopNavBar