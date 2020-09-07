import { useState, useEffect} from 'react';
import { firestore } from '../firebase/firebase.utils'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export const useItems = (selectedList,selectedGenreName) => {
   
    
    
    const [items, setItems] = useState([]);
    
    useEffect(() => {
      if(selectedList){
        //console.log("UseItems")
      firestore
      .collection('items')
      .where('listId', '==', selectedList)
      .get()
      .then(snapshot => {
        
        const allLists = snapshot.docs.map((item) => ({
          width:4,
          height:(selectedGenreName === 'music') ? 4 : 6,
          itemurl:item.data().itemUrl,
          src:item.data().src,
          
        }));
       
        
        if (JSON.stringify(allLists) !== JSON.stringify(items)) {
          setItems(allLists);
        }
        
      });
      }
   
}, [selectedList]);

return { items };
};


export const useLists =  () => {
const user = firebase.auth().currentUser; 

const [lists, setLists] = useState([]);

  useEffect(() => {
        if(user){
          //console.log("USE list")
        firestore
        .collection('lists')
        .where('userid', '==', user.uid)
        .orderBy('name')
        .get()
        .then(snapshot => {
         
          const allLists = snapshot.docs.map((list) => ({
            genreName:list.data().genreName,
            listId:list.data().listId,
            name:list.data().name,
            userid:list.data().userId,
            docId: list.id,
          }));
         
           if (JSON.stringify(allLists) !== JSON.stringify(lists)) {
            setLists(allLists);
          }
          
        });
        }
     
  }, [lists,user]);
  
  return { lists, setLists };
};


