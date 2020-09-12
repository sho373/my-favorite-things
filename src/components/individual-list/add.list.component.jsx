import React, { useState ,useContext} from 'react';
import CurrentUserContext from '../../contexts/current-user/current-user.context';

import { firestore } from '../../firebase/firebase.utils';
import { useListsValue } from '../../contexts/lists/index';

//MUI
import { makeStyles } from '@material-ui/core/styles';
import TextField  from '@material-ui/core/TextField';
import Dialog  from '@material-ui/core/Dialog';
import DialogActions  from '@material-ui/core/DialogActions';
import DialogContent  from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button  from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection:"column",
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  textControl:{
      margin: theme.spacing(1),
  },
  button:{
      float:'right',
  }
}));

export const AddList = () => {

  const [showAdd, setShowAdd] = useState(false);
  const [listName, setListName] = useState('');
  const [genreName,setGenreName] = useState('');
  
  const currentUser = useContext(CurrentUserContext);
  const currentUserId = currentUser ? currentUser.id : '';
  const { lists, setLists } = useListsValue();

  const [showConfirm, setshowConfirm] = useState(false);
 
  const classes = useStyles();
  let maxNumList = 10;
  
  const checkAndAdd = () => {
    findLength().then(
      result => {
        if (result <= maxNumList){
          addPoject();
          if(setShowAdd) handleCloseAdd();
        }else{
          setshowConfirm(!showConfirm) 
        }
      }
    )
  }

  const handleCloseAdd = () => {
    setShowAdd(false);
  };
  const genreChange = (event) => {
    setGenreName(event.target.value);
  };

  const handleClose = () => {
    setshowConfirm(false);
  };
  
  const findLength = () => {
    return (
      listName && 
      firestore
      .collection('lists')
      .where("userid","==",currentUserId)
      .get()
      .then(res =>{
        let size = (res.size) + 1;
        return size;
      }) 
    )  
  }

  const addPoject = () => {
    var newDocRef = firestore.collection("lists").doc();
    listName && 
      newDocRef.set({
        listId:newDocRef.id,
        name: listName,
        userid: currentUserId,
        genreName: genreName,
      })
      .then(() => {
        setLists([...lists]);
         setListName('');
      })
  }

  return (
   
    <div data-testid="add-list"> 
      
      <Tooltip title="Add list">
          <IconButton onClick={() => {setShowAdd(true)}} color="primary" className={classes.button}>
              <AddCircleIcon ></AddCircleIcon>
          </IconButton>
      </Tooltip>
      { (
        <div>
            <Dialog disableBackdropClick disableEscapeKeyDown
              open={showAdd} onClose={handleCloseAdd} aria-labelledby="form-dialog-title">
              <DialogContent>
                <form className={classes.container}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="demo-dialog-select-label">Genre</InputLabel>
                        <Select
                          labelId="demo-dialog-select-label"
                          id="demo-dialog-select"
                          value={genreName}
                          onChange={genreChange}
                          input={<Input />}
                        >
                          <MenuItem value={"book"}>Book</MenuItem>
                          <MenuItem value={"manga"}>Manga</MenuItem>
                          <MenuItem value={"movie"}>Movie</MenuItem>
                          <MenuItem value={"tvseries"}>TV Series</MenuItem>
                          <MenuItem value={"anime"}>Anime</MenuItem>
                          <MenuItem value={"music"}>Music</MenuItem>
                          <MenuItem value={"game"}>Game</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl className={classes.formControl}>
                      <TextField 
                        data-testid="list-name"
                        margin="normal"
                        autoComplete='off'
                        className={classes.textControl}  
                        onChange={e => setListName(e.target.value)}
                        id="outlined-basic" label="Name your list" 
                        variant="outlined" 
                        required
                        />
                    </FormControl>
                </form>
              </DialogContent>

              <DialogActions>
                <Button variant = "outlined" onClick={handleCloseAdd} color="default">
                  Cancel
                </Button>
                <Button
                  data-testid="add-list-submit" 
                  onClick={() => checkAndAdd()} 
                  color="primary" variant="contained">
                  Add
                </Button>

                {showConfirm && (
                  <Dialog open={showConfirm} onClose={handleClose} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title"></DialogTitle>
                    <DialogContent>
                    Over maximam number of list. 
                    </DialogContent>
                    <Button variant = "ooutlined" onClick={handleClose} color="default">
                    Cancel
                    </Button>
                  </Dialog>
                )}

              </DialogActions>

            </Dialog>
          </div>
        )
    }

    </div>
    );
};

export default AddList

