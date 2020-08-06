import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  },
});

const loadingPos = {
    position: 'absolute',
    left: '50%',
    top:'50%',
    transform: 'translate(-50%,-50%)'
}
function CircularIndeterminate(props) {
  const { classes } = props;
  return (
    <div style={loadingPos}>
      <CircularProgress className={classes.progress} />
    </div>
  );
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CircularIndeterminate);