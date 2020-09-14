import React, { useEffect ,useState,useCallback} from 'react';
import Gallery from "react-photo-gallery";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {firestore} from '../../firebase/firebase.utils';
import SelectedImage from './selectedImage.component';
import { getTitle} from '../../helpers/helpers';
import { useSelectedListValue, useListsValue } from '../../contexts/lists/index';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection:'column',
    margin:theme.spacing(0.5,'auto'),
    padding:theme.spacing(0,1),
    [theme.breakpoints.up('sm')]: {
      width:600,
    },
    
  },
  
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  listName:{
    margin:theme.spacing(7,'auto',2,'auto'),
    color:'#1c1c1c',
  },
}));

export const Main = () => {
      
    let listName = '';
    let listGenreName = '';
    const { selectedList } = useSelectedListValue();//listId
    const { lists } = useListsValue();
    
    const [worksImg,setWorksImg] = useState([]);

    const classes = useStyles();
    const user = firebase.auth().currentUser; 
  
  if (
    lists &&
    lists.length > 0 &&
    selectedList 
  ) {
    listName =  getTitle(lists, selectedList) ? 
    getTitle(lists, selectedList).name : '';
    listGenreName = getTitle(lists, selectedList) ? 
      getTitle(lists, selectedList).genreName : '';
  }else{
    listName="";
  }
    
  useEffect(() => {
    document.title = `${listName}`;
  });
  
  useEffect(() => {
   
      return(
       firestore.collection('items')
       .where("userid","==",user.uid)
       .where("listId","==",selectedList)
       .orderBy("title").onSnapshot(querySnapshot => {
       let worksArray = [];
       let imgHeight = (listGenreName === "music") ? 4 : 6
       querySnapshot.forEach(doc => {
         const {src,title,author,userid} = doc.data();
         worksArray.push({
           id: doc.id,
           src,
           title,
           author,
          width:4, 
          height:imgHeight,
          userid
         });
       });
       setWorksImg(worksArray); 
        })
      )
  
  }, [selectedList])

  
  const imageRenderer = useCallback(
    ({ index, left, top, key, photo }) => (
      <SelectedImage
        selected={false}
        key={key}
        margin={"2px"}
        index={index}
        photo={photo}
        left={left}
        top={top}
        direction={"column"}
        page={"main"}
      />
    ),
    []
  );
  
    return (
      <div className={classes.root}> 
        <div>
          <h2 className = {classes.listName}>{listName}</h2>
        </div>
       
        {worksImg.length > 0 && (
          <Gallery photos={worksImg} 
            direction={"column"} 
            columns={3} margin={5} 
            renderImage={imageRenderer}
            />)}

      </div>
    )
};

export default Main