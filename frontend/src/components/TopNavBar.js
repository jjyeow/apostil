import React from 'react' 
import { Link } from 'react-router-dom'
import { blue } from '@material-ui/core/colors'
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded'
import IconButton from '@material-ui/core/IconButton'

const navbar_style = {
    background: blue[300],
    width: '100vw',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'fixed',
    height: '54px',
    lineHeight: '54px'
    
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
                    <IconButton>
                        <ArrowBackRoundedIcon />
                    </IconButton>
                </Link>
                <b style={title_style}>{title}</b>
                <div style={empty_div}></div>
            </div>
        </div>
    )
}

export default TopNavBar