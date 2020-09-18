import React, { useState } from 'react';
import { auth } from '../../firebase/firebase.utils';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
//MUI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
//mui Icon
import IconButton from '@material-ui/core/IconButton';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  sectionMobile: {
    margin: theme.spacing(0, 0, 0, 'auto'),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  mobileMenu: {
    padding: theme.spacing(0, 2, 0, 1),
  },
  mobileMenuIcon: {
    margin: theme.spacing(0, 1, 0, 0),
  },
  otherButton: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(0, 0, 0, 'auto'),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

export const RenderMobileMenu = ({ displayName }) => {
  const classes = useStyles();

  const [showConfirm, setShowConfirm] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const history = useHistory();
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const displayClose = () => {
    setShowConfirm(false);
  };

  const signedOut = () => {
    auth
      .signOut()
      .then(function () {
        history.push('/signout');
      })
      .catch(function (error) {
        // An error happened.
      });
  };
  const mobileMenuId = 'primary-search-account-menu-mobile';

  return (
    <div>
      <div className={classes.otherButton}>
        <Tooltip title="List">
          <IconButton onClick={() => history.push(`/users/${displayName}`)}>
            <ListAltIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Profile">
          <IconButton onClick={() => history.push('/profile')}>
            <AccountCircleIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="About">
          <IconButton onClick={() => history.push('/about')}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Sign out">
          <IconButton onClick={(event) => setShowConfirm(true)}>
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      </div>

      <IconButton
        className={classes.sectionMobile}
        aria-label="show more"
        aria-controls={mobileMenuId}
        aria-haspopup="true"
        onClick={handleMobileMenuOpen}
      >
        <MoreIcon />
      </IconButton>

      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem
          className={classes.mobileMenu}
          onClick={() => history.push(`/users/${displayName}`)}
        >
          <ListAltIcon className={classes.mobileMenuIcon} />

          <p>List</p>
        </MenuItem>
        <MenuItem
          className={classes.mobileMenu}
          onClick={() => history.push('/profile')}
        >
          <AccountCircleIcon className={classes.mobileMenuIcon} />

          <p>Profile</p>
        </MenuItem>
        <MenuItem
          className={classes.mobileMenu}
          onClick={() => history.push('/about')}
        >
          <InfoIcon className={classes.mobileMenuIcon} />

          <p>About</p>
        </MenuItem>
        <MenuItem
          className={classes.mobileMenu}
          onClick={(event) => setShowConfirm(true)}
        >
          <ExitToAppIcon className={classes.mobileMenuIcon} />

          <p>Sign out</p>
        </MenuItem>
      </Menu>
      {showConfirm && (
        <Dialog
          open={showConfirm}
          onClose={displayClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle>You want to sign out?</DialogTitle>

          <DialogActions>
            <Button
              variant="outlined"
              color="default"
              onClick={() => displayClose()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => signedOut()}
            >
              Sign out
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};
RenderMobileMenu.propTypes = {
  displayName: PropTypes.string,
};
export default RenderMobileMenu;
