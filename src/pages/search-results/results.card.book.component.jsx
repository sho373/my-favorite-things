import React,{useContext,useState} from 'react';
import clsx from 'clsx';
import CurrentUserContext from '../../contexts/current-user/current-user.context';
import {  useListsValue } from '../../contexts/lists/index';
import {sortedList} from '../../helpers/helpers';

import 'firebase/firestore';
import 'firebase/auth';
import { firestore } from '../../firebase/firebase.utils'

//MUI
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    root: {
        display: 'flex',
        width: 400,
        margin:theme.spacing(1,'auto'),
        padding:theme.spacing(0,1),
        
        [theme.breakpoints.down('sm')]:{
          width:370
        },
       
      },
      divider:{
          
          margin:theme.spacing(1,'auto')
      },
      details: {
        display: 'flex',
        flexDirection: 'column',
      },
      content: {
        flex: '1 0 auto',
      },
      button: {
        margin: theme.spacing('auto',1,1,'auto'),
      
      },
      boxMusic:{
        maxWidth:140,
        maxHeight:140,
        minWidth:140,
        minHeight:140,
        margin: theme.spacing(1,0),
      },
      boxManga:{
        maxWidth:120,
        maxHeight:190,
        minWidth:120,
        minHeight:190,
        margin: theme.spacing(1,0),
      },
      box:{
         maxWidth:140,
        maxHeight:200,
        minWidth:140,
        minHeight:200,
        margin: theme.spacing(1,0),
      },
      image:{
         width:'100%',
           height:'100%',
        objectFit:'cover'
      },
      cover: {
        
        width:180,
        objectFit:'cover'
      },
      controls: {
        margin: theme.spacing('auto',1,1,'auto'),
      },
      paper:{
          margin:theme.spacing(1,0),
      },
      container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      formControl: {
        margin: theme.spacing(1),
        minWidth: 220,
      },
}))

export const ResultsCardBook = (props) => {
    const classes = useStyles();
    

    const [open,setOpen] = useState({
        pullDown:false,
        doneMes:false,
        errorMes:false,
        hasErrorPull:false
    });
    
    const {pullDown,doneMes,
        errorMes,hasErrorPull} = open;

    const [pickedList,setPickedList] = useState('');
    const [pickedListId,setPickedListId] = useState('');

    const currentUser = useContext(CurrentUserContext);
    const currentUserId = currentUser ? currentUser.id : ''
    let { lists } = useListsValue();
    let sortedLists = sortedList(lists);
   
    

    const handleChange = (event) => {
        //let title = getTitle(lists,event.target.value).name
        setPickedList();
        console.log("pickedlist",pickedList)
        console.log("pickedlistID",pickedListId)
        //console.log(getTitle(lists,event.target.value).name)
        setPickedListId(event.target.value)
    };
    const handleClickOpen = () => {
        setOpen({pullDown:true});
    };
    
    const handleClose = () => {
        setOpen({pullDown:false});
        setPickedList('')
    };

    const handleDoneClose = () => {
        setOpen({doneMes:false});
    }
   
    const handleErrorClose = () => {
        setOpen({errorMes:false})
        setOpen({hasErrorPull:false})
    }
    
    const findLength = () => {

        return (
          firestore
          .collection('items')
          .where("listId","==",pickedListId)
          .get()
          .then(res =>{
            const size = (res.size) ;
            
            return size;
          }) 
        )  
    }
    const addWork = (props) =>{
        firestore
        .collection('items')
        .add({
            src:props.image,
            title: props.title ? props.title : 'None',
            author:props.author ? props.author : 'None',
            itemUrl:props.itemUrl ? props.itemUrl:'None',
            listId:pickedListId,
            userid: currentUserId,
            genreName: props.genreName,
        })
        .then(() => {
            handleClose();
           setOpen({doneMes:true})
        });
   
    }
   
        
    return (
       
        <div>
           
           <Card elevation={0} className={classes.root}>
           <div  className={clsx({
                [classes.boxManga] : props.genreName === 'manga',
                [classes.box] : (props.genreName !== 'music') && props.genreName !== 'manga', 
                [classes.boxMusic] : props.genreName === 'music' //only when open === true
            })}>
           <img className={classes.image} src={props.image} alt=""/>
           </div>
           
            
            <div className={classes.details}>
                <CardContent className={classes.content}>
                <Typography  variant="subtitle1">
                    {props.title}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                   {props.author}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                   {props.publisherName}
                </Typography>
                </CardContent>
               
            </div>
            
            {currentUser && (
                <Tooltip title="Add to list">
                <IconButton
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleClickOpen}
                >
                    <AddCircleIcon />
                </IconButton>
                </Tooltip>)
            }
                {pullDown && (<Dialog 
                    disableBackdropClick disableEscapeKeyDown
                    open={pullDown} onClose={handleClose}
                    error={hasErrorPull}>
                    <DialogTitle>Pick list to add</DialogTitle>
                    <DialogContent>
                    <form className={classes.container}>
                        <FormControl 
                            className={classes.formControl}
                            >
                        <InputLabel htmlFor="demo-dialog-native">List</InputLabel>
                        <Select
                            
                            native
                            value={pickedList}
                            onChange={handleChange}
                            input={<Input id="demo-dialog-native" />}
                        >
                            <option aria-label="Select list" value='' />
                            {sortedLists.map((item,index) => {
                                return <option key={item.listId}  value={item.listId}>
                                {item.name}</option>
                            })}
                            
                        </Select>
                       
                        </FormControl>
                        
                    </form>
                    </DialogContent>
                    <DialogActions>
                    <Button variant ="outlined" onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button variant ="contained" color="primary"
                        onClick={() => {
                            pickedList !== '' ? (findLength().then(
                                result => {
                                if(result <= 9 ){
                                    addWork(props);  
                                    
                                }
                                else{
                                    setOpen({errorMes:true}) 
                                }
                                }
                                )) : setOpen({hasErrorPull:true})
                            
                        }}>
                        Ok
                    </Button>
                    </DialogActions>
                </Dialog>)}   
            </Card>

            <Divider className={classes.divider}/>

            <Snackbar open={doneMes} autoHideDuration={6000} onClose={handleDoneClose}>
                <Alert onClose={handleDoneClose} severity="success">
                Item added successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={errorMes} autoHideDuration={6000} onClose={handleErrorClose}>
                <Alert onClose={handleErrorClose} severity="error">
                Over muximum number of items.
                </Alert>
            </Snackbar>
            <Snackbar open={hasErrorPull} autoHideDuration={6000} onClose={handleErrorClose}>
                <Alert onClose={handleErrorClose} severity="error">
                List is not selected.
                </Alert>
            </Snackbar>
        </div>
    )
}

export default ResultsCardBook