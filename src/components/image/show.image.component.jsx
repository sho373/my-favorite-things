import React, { Component } from 'react'
import { useState, useEffect, useCallback  } from 'react';
import Gallery from "react-photo-gallery";
import {firestore} from '../../firebase/firebase.utils';

import SelectedImage from "./SelectedImage";

import { useSelectedListValue ,useListsValue} from '../../contexts/lists/index';
import { getTitle } from '../../helpers/helpers';

export const ShowImage = (props) => {
  const { selectedList } = useSelectedListValue();//listId
 
  const { lists } = useListssValue();

  const listGenreName = getTitle(lists, selectedList).genreName;
 
  const [booksImg,setBooksImg] = useState([]);
  const [mangaImg,setMangaImg] = useState([]);
  const [movieImg,setMovieImg] = useState([]);
  const [tvSeriesImg,setTVSeriesImg] = useState([]);
  const [animeImg,setAnimeImg] = useState([]);
  const [gameImg,setGameImg] = useState([]);
  const [musicImg,setMusicImg] = useState([]);
  const [sortBook,setSortBook] = useState(false);

  const items =  firestore.collection('items')
  .where("userid","==","e7khWBppcye3DKe0fRcegt0kqpB2")

  let contentImg = "";
     
    useEffect(() => {
      if(listGenreName === "book"){
        console.log("useeffect BOOK")
        return(
            items
         .where("genreName","==","book")
         .where("listId","==",selectedList)
         .orderBy("title").onSnapshot(querySnapshot => {
         let bookArray = [];
         querySnapshot.forEach(doc => {
           const {src,title,author,userid} = doc.data();
           bookArray.push({
             id: doc.id,
             src,
             title,
             author,
             height:9,
            width:6,
            userid
           });
         });
         setBooksImg(bookArray); 
     })
        )
      }
      
    }, [selectedList])

    useEffect(() => {
      if(listGenreName==="manga"){
        console.log("useeffect MANGA")
        return(
         items
         .where("listId","==",selectedList)
         .orderBy("title").onSnapshot(querySnapshot => {
         let mangaArray = [];
         querySnapshot.forEach(doc => {
           const {src,title,author,userid} = doc.data();
           mangaArray.push({
             id: doc.id,
             src,
             title,
             author,
             height:9,
             width:6,
             userid
           });
           
         });
         
         setMangaImg(mangaArray);
     })
        )
      }
   }, [selectedList])

   useEffect(() => {
     if(listGenreName === "movie"){
      console.log("useeffect MOVIE")
      return(
       items
       .where("genreName","==","movie")
       .where("listId","==",selectedList)
       .orderBy("title").onSnapshot(querySnapshot => {
       let movieArray = [];
       querySnapshot.forEach(doc => {
         const {src,title,userid} = doc.data();
         movieArray.push({
           id: doc.id,
           src,
           title,
          
           height:9,width:6,userid
         });
         
       });
       setMovieImg(movieArray);
   })
      )
     } 
 }, [selectedList])

 useEffect(() => {
  if(listGenreName==="tvseries"){
    return(
    items
      .where("listId","==",selectedList)
      .orderBy("title").onSnapshot(querySnapshot => {
      let tvSeriesArray = [];
      querySnapshot.forEach(doc => {
        const {src,title,height,width,userid} = doc.data();
        tvSeriesArray.push({
          id: doc.id,
          src,
          title,
         
          height:9,width:6,userid
        });
        
      });
   
      setTVSeriesImg(tvSeriesArray);
      
      
   })
     )
  }

}, [selectedList])

useEffect(() => {
  
  if(listGenreName === "anime"){
    console.log("use effect anime")
    return(
      items
      .where("genreName","==","anime")
      .where("listId","==",selectedList)
      .orderBy("title").onSnapshot(querySnapshot => {
      let animeArray = [];
      querySnapshot.forEach(doc => {
        const {src,title,height,width,userid} = doc.data();
        animeArray.push({
          id: doc.id,
          src,
          title,
          
          height:9,width:6,userid
        });
        
      });
   
      setAnimeImg(animeArray);
      
      
   })
     )
  }
   
 
}, [selectedList])

useEffect(() => {
  if(listGenreName==="game"){
    return(
      items
      .where("genreName","==","game")
      .where("listId","==",selectedList)
      .orderBy("title").onSnapshot(querySnapshot => {
      let gameArray = [];
      querySnapshot.forEach(doc => {
        const {src,title,height,width,userid} = doc.data();
        gameArray.push({
          id: doc.id,
          src,
          title,
          
          height:9,width:6,userid
        });
        
      });
   
      setGameImg(gameArray);
      
      
   })
     )
  }
   
 
}, [selectedList])

useEffect(() => {
  if(listGenreName === "music"){
    console.log("useeffect MUSIC")
    return(
    items
    .where("genreName","==","music")
     .where("listId","==",selectedList)
     .orderBy("title").onSnapshot(querySnapshot => {
     let musicArray = [];
     querySnapshot.forEach(doc => {
       const {src,title,author,userid} = doc.data();
       musicArray.push({
         id: doc.id,
         src,
         title,
         author,
         height:6,
        width:6,
        userid
       });
     });
     setMusicImg(musicArray); 
 })
    )
  }
  
}, [selectedList])

    const imageRenderer = useCallback(
      ({ index, left, top, key, photo }) => (
        <SelectedImage
          
          key={key}
          margin={"2px"}
          index={index}
          photo={photo}
          left={left}
          top={top}
          //genre={props.genre}
        />
      ),
      []
    );
    
    
    switch(listGenreName){
      case 'book':
        contentImg = booksImg;
        break;
      case 'manga':
        contentImg = mangaImg;
       
        break;
      case 'movie':
        contentImg = movieImg;
        break;
      case 'tvseries':
        contentImg = tvSeriesImg;
        break;
      case 'anime':
        contentImg = animeImg;
        break;
      case 'game':
        contentImg = gameImg;
        break;
      case 'music':
        contentImg = musicImg;
        break;
    }
    return (
      <>
      {<Gallery photos={contentImg}  renderImage={imageRenderer}/>}
     
      </>
     )
  }

  export default ShowImage