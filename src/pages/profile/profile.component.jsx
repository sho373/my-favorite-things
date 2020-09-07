import React ,{useState,useContext} from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {firestore } from '../../firebase/firebase.utils';
import CurrentUserContext from '../../contexts/current-user/current-user.context';
import './profile.styles.scss';

//MUI
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

import { makeStyles } from '@material-ui/core/styles';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
       
      '& > * + *': {
        marginTop: theme.spacing(1),
        padding: '0 30px',
      },
      margin: theme.spacing(1),
      float: 'center'
    },
    button: { 
       cursor:'pointer',
        float: 'right',
        
        '&:hover': {
            
          }
      }
  }));


const Profile = () => {
    const classes = useStyles();

    const [myValue,setValue] = useState({
        displayName:false,
        email:false,
        password:false,
        newPassword:false,
        confirmPassword:false
    });

    const [open, setOpen] = useState({
            isSucces:false,
            succesMes:{},
            displayOpen:false,
            emailOpen:false,
            passwordOpen:false,
            deleteOpen:false,
            isError:false,
            errorMes:{}
    });

   const {isSucces,succesMes,displayOpen,
    emailOpen,passwordOpen,
    deleteOpen,
    errorMes} = open

    const {displayName,email,
        password,newPassword,confirmPassword} = myValue;

    const  currentUser = useContext(CurrentUserContext);
    
    
    const editUser = firebase.auth().currentUser;
    const userId =  editUser ? editUser.uid : "";
   

    const handleChange = event => {
        const { value, name } = event.target;
    
        setValue({ ...myValue, [name]: value });
    };
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen({isSucces:false});
    };

    const displayClose = () => {
        setOpen({displayOpen:false});
    };
    const emailClose = () => {
        setOpen({emailOpen:false});
    }
    const passwordClose = () => {
        setOpen({passwordOpen:false})
    }
    const deleteClose = () => {
        setOpen({deleteOpen:false})
    }
    
    const updateDisplay = async event => {
        console.log("DDD",displayName)
        
        if((displayName !== currentUser.displayName) && displayName){

            const snapshot = await firebase.firestore().collection('users')
            .where("displayName","==",displayName).get();
    
            if(!snapshot.empty){
                //alert("this display name is already taken");
                setOpen({isError: true,
                    errorMes:{displayname: "this display name is already taken"}
                    })
                return;
            } 

            try{
                await firestore.collection('users')
                .doc(userId)
                .update({
                    createdAt:new Date(),
                    displayName:displayName
                })
                .then(
                    setOpen({isSucces:true,
                        succesMes:"successfully updated!"})
                )
            }catch(error){
                setOpen({isError: true,
                    errorMes:{display: error.message}
                    })
            }
            
        }
       
        
        //setValue({displayName:""})
        
    }

    const updateEmail = async event => {
        
        if(email !== currentUser.email){
    
            const snapshot = await firebase.firestore().collection('users')
            .where("email","==",email).get();
    
            if(!snapshot.empty){
                //alert("this display name is already taken");
                setOpen({isError: true,
                    errorMes:{email: "The email address is already in use by another account"}
                    })
                return;
            } 

            try{
                const credentials = firebase.auth.EmailAuthProvider.credential(
                    editUser.email,
                    password
                  )

                  editUser.reauthenticateWithCredential(credentials)
                  .then(function(){
      
                      editUser.updateEmail(email); 
                      
                      firestore.collection('users')
                      .doc(userId)
                      .update({
                           createdAt:new Date(),
                           email:email
                      })
                      .then(
                        setOpen({isSucces:true,
                            succesMes:"successfully updated!"})
                      )
                      
                  }).catch(function(error){
                      
                    setOpen({isError: true,
                        errorMes:{email: error.message}
                      })
                  })
            }catch(error){
                
                setOpen({isError: true,
                     errorMes:{email: error.message}
                   })
            }
        
        }
        
        
    }

    const updatePassword = async event => {

        if(newPassword !== confirmPassword){
            setOpen({isError: true,
                errorMes:{password: "passwords don't match"}
                })
            return 
        }

        try{
            const credentials = firebase.auth.EmailAuthProvider.credential(
                editUser.email,
                password
            );
            editUser.reauthenticateWithCredential(credentials)
            .then(function(){

                editUser.updatePassword(newPassword)
                setOpen({isSucces:true,
                    succesMes:"Password was successfully updated!"})
            })
            .catch(function(error){
                
              setOpen({isError: true,
                  errorMes:{password: error.message}
                })
            })
            
        }catch (error){
            setOpen({isError: true,
                errorMes:{password: error.message}
                })
        }   
    }
    const deleteWholeList = async (userId) => {

        let delete_content = 
          firestore
          .collection("items")
          .where("userid","==",userId);
    
        await delete_content.get().then(function(querySnapshot){
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();
          });
        }) 

        let delete_lists = 
        firestore
        .collection("lists")
        .where("userid","==",userId)
     
        delete_lists.get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        }) 

         
      };

    const deleteAcocunt = async event => {

        try{
            const credentials = firebase.auth.EmailAuthProvider.credential(
                editUser.email,
                password
            );

            editUser.reauthenticateWithCredential(credentials)
            .then(function(){

                 deleteWholeList(userId)
                 .then(
                    firestore.collection('users')
                    .doc(userId)
                    .delete()
                    .then(
                        
                           //
                    )
                 )
                

                 editUser.delete().then(function(){  
                    // setOpen({isSucces:true,
                    //     succesMes:"Account was successfully deleted!"})
                    
                        alert("Account was successfully deleted!")
                    //redirectToTarget()
                  }).catch(function(error) {
                    // An error happened.
                  })
                
                
            })
            .catch(function(error){
                
              setOpen({isError: true,
                  errorMes:{delete: error.message}
                })
            })
            
        }catch (error){
            setOpen({isError: true,
                errorMes:{delete: error.message}
                })
        }   
    }

  return(
    <div className = 'profile'> 

        <h2 className = 'title'>Edit your profile</h2>
        <h4>Here you can edit your profile</h4>
        
        {currentUser ? (<><span className = "edit-display-name">
            Display name: <span className = "dis-char">{currentUser.displayName}</span>
            
            <Tooltip title="Edit">
            <EditIcon className={classes.button} color="primary" 
             onClick={()=> setOpen({displayOpen:!displayOpen})}/>
            </Tooltip>

            {displayOpen &&  (
                <Dialog open={displayOpen} onClose={displayClose} aria-labelledby="form-dialog-title">
                   
                    <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        type="text"
                        label = "Display name"
                        name="displayName"
                        onChange = {handleChange}
                        fullWidth
                        required
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button variant="outlined" color="default" 
                        onClick={()=> setOpen({displayOpen:!displayOpen})} >
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary"
                        onClick={() => updateDisplay()}>
                        Save
                    </Button>
                    </DialogActions>
                </Dialog>)}
                {errorMes && (<div className={classes.root}>
                    <Snackbar open={!!errorMes.displayname} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error">
                        {errorMes.displayname}
                        </Alert>
                    </Snackbar>
                </div>)}
            </span> 
        

        <span className = "edit-email">
            Email: <span className="email-char">{currentUser.email}</span>
        
            <Tooltip title="Edit">
            <EditIcon onClick={()=> setOpen({emailOpen:!emailOpen})} 
            color="primary" className={classes.button}/>
            </Tooltip>

        {emailOpen &&  (
                <Dialog open={emailOpen} onClose={emailClose} aria-labelledby="form-dialog-title">
                   
                    <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        type="email"
                        label = "Email"
                        name="email"
                        onChange = {handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="normal"
                        id="password"
                        type="password"
                        label = "Password"
                        required
                        name="password"
                        onChange = {handleChange}
                        fullWidth
                        
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button variant="outlined" color="default"
                        onClick={()=> setOpen({emailOpen:!emailOpen})}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" 
                        onClick={() => updateEmail()}>
                        Save
                    </Button>
                    </DialogActions>
                </Dialog>)}
                {errorMes && (<div className={classes.root}>
                    <Snackbar open={!!errorMes.email} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error">
                            {errorMes.email}
                        </Alert>
                    </Snackbar>
                </div>)}
        </span></>)
        : null}
        
        
       
        <Button className={classes.root} 
         onClick={()=> setOpen({passwordOpen:!passwordOpen})}
            variant="contained" color="primary">
            Change Password
        </Button>

        {passwordOpen && (
                <Dialog 
                disableBackdropClick disableEscapeKeyDown
                open={passwordOpen} onClose={passwordClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Update password</DialogTitle>
                    <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        type="password"
                        label = "Current password"
                        name="password"
                        onChange = {handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="normal"
                        id="newPassword"
                        type="password"
                        label = "New Password"
                        required
                        name="newPassword"
                        onChange = {handleChange}
                        fullWidth
                    />
                     <TextField
                        margin="normal"
                        id="confirmPassword"
                        type="password"
                        label = "Confirim Password"
                        required
                        name="confirmPassword"
                        onChange = {handleChange}
                        fullWidth
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button variant="outlined" color="default"
                        onClick={()=> setOpen({passwordOpen:!passwordOpen})} >
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" 
                        onClick={() => updatePassword()}>
                        Save
                    </Button>
                    </DialogActions>
                </Dialog>)}
                {errorMes && (<div className={classes.root}>
                    <Snackbar open={!!errorMes.password} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error">
                        {errorMes.password}
                        </Alert>
                    </Snackbar>
                </div>)}

        <Button 
            onClick={()=> setOpen({deleteOpen:!deleteOpen})}
            startIcon={<DeleteIcon />} 
            className={classes.root} 
            variant="contained" color="secondary">
            Delete account
        </Button>

        {deleteOpen &&  (
                <Dialog open={deleteOpen} onClose={deleteClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title"> Are you sure you want to delete this account ?</DialogTitle>
                    <DialogContent>
                       Please enter your password
                       <TextField
                        autoFocus
                        margin="normal"
                        id="password"
                        type="password"
                        label = "Current password"
                        name="password"
                        onChange = {handleChange}
                        fullWidth
                        required
                    />
                    </DialogContent>
                    
                    <DialogActions>
                    <Button variant="outlined" color="default"
                        onClick={()=> setOpen({deleteOpen:!deleteOpen})}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="secondary" 
                        onClick={() => deleteAcocunt()}>
                       Delete
                    </Button>
                    </DialogActions>
                </Dialog>)}

                {errorMes && (<div className={classes.root}>
                    <Snackbar open={!!errorMes.delete} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error">
                        {errorMes.delete}
                        </Alert>
                    </Snackbar>
                </div>)}

        {isSucces && (<div className={classes.root}>
            <Snackbar open={isSucces} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                {succesMes}
                </Alert>
            </Snackbar>
        </div>)}

    </div>
 
)
}

export default Profile;