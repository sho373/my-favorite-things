import React,{useState} from 'react';
import {useListsValue,useSelectedListValue} from '../../contexts/lists/index';
import {firestore} from '../../firebase/firebase.utils';
import { Link } from 'react-router-dom';

 //MUI
import Button  from '@material-ui/core/Button';
import TextField  from '@material-ui/core/TextField';
import Dialog  from '@material-ui/core/Dialog';
import DialogActions  from '@material-ui/core/DialogActions';
import DialogContent  from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';


import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';


import MusicNoteIcon from '@material-ui/icons/MusicNote'; //music
import ImportContactsIcon from '@material-ui/icons/ImportContacts'; //book
import MovieIcon from '@material-ui/icons/Movie'; //movie
import TvIcon from '@material-ui/icons/Tv';//tvseries
import LiveTvIcon from '@material-ui/icons/LiveTv';//anime
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';//game
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';//manga


export const IndividualList = ({list}) => {
  const { setSelectedList } = useSelectedListValue();

  const [open,setOpen] = useState({
    showConfirm:false,
    isEditing:false,
  })

  const [myValue,setValue] = useState(false);

  const {showConfirm,isEditing} = open;

  let { lists,setLists } = useListsValue();


  const handleClose = () => {
    setOpen({isEditing:false,showConfirm:false});
  };

  const updateList = docId => {
      
    setOpen({setIsEditing:false});
      firestore
      .collection('lists')
      .doc(docId)
      .update({
          name:myValue
      })
      .then(() =>{
          setLists([...lists]);
          setSelectedList('');   
      }) 
  }

  const deleteList = (docId,listId) => {

    let delete_content = 
      firestore
      .collection("items")
      .where("listId","==",listId);

    delete_content.get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    })

    firestore
    .collection('lists')
    .doc(docId)
    .delete()
    .then(() =>{
        setLists([...lists]);
        setSelectedList('');  
    })

    handleClose();
  };

  // const longPressProps = useLongPress({
  //   onLongPress: (ev) =>  {setOpen({isEditing:!isEditing});
  //   console.log('on long press', ev.button, ev.shiftKey)}
  // });

  return (
    
    <div >  
      <Link to = "/">
      <ListItem  button 
      //  {...longPressProps}
        onClick={() => 
        setSelectedList(list.listId)}
        onDoubleClick={() => 
            setOpen({isEditing:!isEditing})}
            key={list.docId} >
        
        <ListItemIcon  >{list.genreName === 'book' ? <ImportContactsIcon /> 
        : list.genreName === 'movie'
        ? <MovieIcon/>
        : list.genreName === 'manga'
        ? <LocalLibraryIcon/>
        : list.genreName === 'anime'
        ? <LiveTvIcon/>
        : list.genreName === 'music'
        ? <MusicNoteIcon/>
        : list.genreName === 'tvseries'
        ? <TvIcon/>
        : list.genreName === 'game'
        ? <VideogameAssetIcon/>
        :<VideogameAssetIcon/>}</ListItemIcon>

        <ListItemText  primary={list.name} />
        <ListItemSecondaryAction key={list.docId}>

            <Tooltip  title="Delete">
            <IconButton 
              onClick={() => 
                setOpen({showConfirm:!showConfirm})}
              style={{color:"#dcdcdc"}} edge="end" aria-label="delete">
              <DeleteIcon fontSize="small"/>
            </IconButton>
            </Tooltip>

            {showConfirm && 
              (<Dialog open={showConfirm} onClose={handleClose} 
                aria-labelledby="form-dialog-title">
              <DialogTitle>Are you sure you want delete "{list.name}" ?</DialogTitle>
                  <DialogActions>
                    <Button variant = "outlined" onClick={()=> setOpen({showConfirm:!showConfirm})} color="default">
                      Cancel
                    </Button>
                    <Button variant = "contained" color="secondary" onClick={() => deleteList(list.docId,list.listId)}>
                      Delete
                    </Button>
                  </DialogActions>
              </Dialog>)}
        </ListItemSecondaryAction>
      
      </ListItem>
      </Link>
      {isEditing  && 
          (<Dialog open={isEditing} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>Edit title</DialogTitle>
            <DialogContent>
              <TextField
                autoComplete='off'
                autoFocus
                margin="dense"
                id="name"
                type="text"
                label ="Title"
                onChange = {event => setValue(event.target.value)} 
                  fullWidth
                />
                </DialogContent>
                <DialogActions>
                  <Button variant = "outlined" onClick={()=> setOpen({isEditing:!isEditing})} color="default">
                    Cancel
                  </Button>
                  <Button variant = "contained" color="primary" onClick={() => updateList(list.docId)}>
                    Save
                  </Button>
                </DialogActions>
          </Dialog>)
      }
    </div>
    
  )
}

export default IndividualList