import React, { useEffect ,useState} from 'react';

import {UsersItem} from './users.items.components';

import {sortedList} from '../../helpers/helpers';

import {firestore} from '../../firebase/firebase.utils';

import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection:'column',
      //width:640,
      margin:theme.spacing(0.5,'auto'),
      padding:theme.spacing(0,1),
      [theme.breakpoints.up('sm')]: {
       // width:350,
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
        marginTop:theme.spacing(7),
        color:"#2c2c2c"
    },
   
  }));

  

export const Users = (props) => {

    const classes = useStyles();
  

    const [userId,setUserId] = useState([]);
    const [lists, setLists] = useState([]);
    const [errorMes, setErrorMes] = useState(false);

    const currentUserName = props.match.params ? props.match.params.displayName : ""
    
    const getUserId = async (userName) => {
      const snapshot = await firestore.collection('users')
                        .where("displayName","==",userName);
      const checkSnapshot= await snapshot.get()

        if(checkSnapshot.empty){
            setErrorMes(true);
        } 
      
        snapshot
        .get()
        .then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                setUserId(doc.id)
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
           
            setErrorMes(true);
        });
        
        
    }


    const useLists = (userId) => {
        
      useEffect(() => {
        if(userId){
          //console.log("use items")

        let unsubscribe = 
            firestore
            .collection('lists')
            .where('userid','==',userId)
        
        unsubscribe = unsubscribe.onSnapshot(snapshot => {
          const newItems = snapshot.docs.map(item => ({
            id: item.id,
            ...item.data(),
          }));
    
          setLists(
            newItems
          );
          
        });
    
        return () => unsubscribe();
        }
      }, [userId]);
    
      return {lists};
    };


    getUserId(currentUserName)
    useLists(userId);
    
    let sortedLists = sortedList(lists);
 

    return (
        
        <div className={classes.root}>
            {/* <div className={classes.toolbar}/> */}
            {sortedLists && (sortedLists.map((list) => {
                return (<div key={list.listId}>
                    <h2 className = {classes.listName} >{list.name}</h2>
                    <UsersItem  list={list.listId} genreName={list.genreName}/></div>)
            }))}

            {errorMes && (
              <>
              <h1>
                <div className={classes.toolbar}/>
                NO USER FOUND 
              </h1>
              </>
            )}
        </div>
        
    )
}

export default Users