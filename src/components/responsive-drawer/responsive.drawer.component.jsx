import React,{useState, useContext} from 'react';
import { Link } from 'react-router-dom';

import CurrentUserContext from '../../contexts/current-user/current-user.context';
import {sortedList} from '../../helpers/helpers';
import { useListsValue } from '../../contexts/lists/index';
import {IndividualList} from '../individual-list/individual.list.component'
import {AddList} from '../individual-list/add.list.component'
import {RenderMobileMenu} from './renderMobileMenu.component'
import {SearchArea} from './search.area.component';

import { ReactComponent as Logo } from '../../assets/logo.svg';

//MUI
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme} from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';

//MUI ICON
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const drawerWidth = 270;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title:{
    margin:theme.spacing(1,0,1,2),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  divider:{
    margin:theme.spacing(0,8,0,1),
    backgroundColor:"#ff7a7a",
  },
  appBar: {
    backgroundColor:"#ffffff",
  },
  appBarShift: {
    [theme.breakpoints.up('sm')]:{width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    backgroundColor:"#ffffff",
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    })}
  },
  menuButtonMobile: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  menuButtonWeb: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  closeButtonWeb:{
    margin: theme.spacing(0,0,0,'auto'),
  },
  hide: {
    display: 'none',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  contentShift: {
    [theme.breakpoints.up('sm')]:{transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,}
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  marginRight:{
    margin: theme.spacing(0,0,0,'auto'),
  },
  otherButtonNoUser:{
    margin: theme.spacing(0,0,0,'auto'),
  },
}));


function ResponsiveDrawer(props) {
  
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();

  const currentUser = useContext(CurrentUserContext);
  const displayName = currentUser ? currentUser.displayName : '';
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  
  let { lists } = useListsValue();
   
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  let sortedLists = sortedList(lists);
  
  const drawer = (
    <div>
      {/* { (<div className={classes.toolbar} />)} */}
      <div className={classes.drawerHeader}>
        <Link className='logo-container' to='/'>
          <Logo/>
        </Link>
          <IconButton 
          className={clsx(classes.closeButtonWeb, !open && classes.hide)}
          onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton> 
      </div>
      <Divider />
        <Typography className={classes.title}variant="h6">
          My Favorite Things
        </Typography>

        <Divider className={classes.divider}/>

      {currentUser && (<> 
        <List>
          { sortedLists && (sortedLists.map((list) => (
            <div key={list.listId}><IndividualList list={list} /></div>
          )))
          }     
        </List>  
       
      <AddList/>
      </>)}
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      
      <AppBar elevation={0} position="fixed" 
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}>
        <Toolbar>

          {currentUser ? (<>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButtonMobile}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButtonWeb, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>

          {<SearchArea/>}

          <div className={classes.marginRight}>
            <RenderMobileMenu displayName={displayName}/>
          </div>
          </>)
          :
            (
              <>
              <Link className={'logo-container'} to='/'>
                <Logo/>
              </Link>
              <div className={classes.otherButtonNoUser}>
              <Button>
                <Link  to='/signup'>
                  SIGN UP
                </Link>
               </Button>
                <Button>
                  <Link  to='/signin'>
                    SIGN IN
                  </Link>
                </Button>
              </div></>
            )}
        </Toolbar>
      </AppBar>
      
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
        <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        
         {drawer}
      </Drawer>
        </Hidden>
      </nav>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
            
      </main>
    </div>
  );
}


export default ResponsiveDrawer;