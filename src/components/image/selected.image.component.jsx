// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import { FaTrashAlt, FaInfo } from 'react-icons/fa';
// import { firestore } from '../../firebase/firebase.utils';
// import { useSelectedListValue, useListsValue } from '../context';
// import { getTitle } from '../../helpers/helpers';

// const showDetails = (id, genre) => {
//   firestore
//     .collection('items')
//     .where('genreName', '==', genre)
//     .doc(id)
//     .get()
//     .then(function (doc) {
//       if (doc.exists) {
//         const detailsUrl = doc.data().itemUrl;

//         if (detailsUrl) {
//           window.open(detailsUrl, '_blank');
//         }
//       } else {
//         // doc.data() will be undefined in this case
//         console.log('No such document!');
//       }
//     })
//     .catch(function (error) {
//       console.log('Error getting document:', error);
//     });
// };

// const deleteItem = (id, genre) => {
//   firestore
//     .collection('items')
//     .where('genreName', '==', genre)
//     .doc(id)
//     .delete()
//     .then(() => {});
// };

// const imgStyle = {
//   transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s',
// };
// const selectedImgStyle = {
//   transform: 'translateZ(0px) scale3d(0.9, 0.9, 1)',
//   transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s',
// };
// const cont = {
//   backgroundColor: '#eee',
//   cursor: 'pointer',
//   overflow: 'hidden',
//   position: 'relative',
// };

// const SelectedImage = ({
//   index,
//   photo,
//   margin,
//   direction,
//   top,
//   left,
//   selected,
// }) => {
//   const { selectedList } = useSelectedListValue(); //projectId
//   const { lists } = useListsValue();
//   let listGenreName = getTitle(lists, selectedList).genreName;
//   const Checkmark = ({ selected }) => (
//     <>
//       <div
//         style={
//           selected
//             ? { left: '4px', top: '4px', position: 'absolute', zIndex: '1' }
//             : { display: 'none' }
//         }
//       >
//         <button
//           className="booksImg-trash"
//           onClick={() => {
//             deleteItem(photo.id, listGenreName);
//           }}
//         >
//           <FaTrashAlt />
//         </button>
//       </div>
//       <div
//         style={
//           selected
//             ? { right: '4px', bottom: '4px', position: 'absolute', zIndex: '1' }
//             : { display: 'none' }
//         }
//       >
//         <button
//           className="booksImg-info"
//           onClick={(e) => {
//             e.preventDefault();
//             showDetails(photo.id, listGenreName);
//           }}
//         >
//           <FaInfo />
//         </button>
//       </div>
//     </>
//   );

//   const [isSelected, setIsSelected] = useState(selected);

//   const sx = (100 - (30 / photo.width) * 100) / 100;
//   const sy = (100 - (30 / photo.height) * 100) / 100;
//   selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`;

//   if (direction === 'column') {
//     cont.position = 'absolute';
//     cont.left = left;
//     cont.top = top;
//   }

//   const handleOnClick = (e) => {
//     setIsSelected(!isSelected);
//   };

//   useEffect(() => {
//     setIsSelected(selected);
//   }, [selected]);

//   return (
//     <div className="item-picture">
//       <div
//         style={{ margin, height: photo.height, width: photo.width, ...cont }}
//         className={!isSelected ? 'not-selected' : ''}
//       >
//         <img
//           className="not-selected__background-image"
//           alt={photo.title}
//           style={
//             isSelected ? { ...imgStyle, ...selectedImgStyle } : { ...imgStyle }
//           }
//           {...photo}
//           onClick={handleOnClick}
//         />
//         <Checkmark selected={isSelected ? true : false} />
//         {/* <style>{`.not-selected:hover{outline:2px solid #06befa}`}</style> */}
//       </div>
//     </div>
//   );
// };
// SelectedImage.propTypes = {
//   photo: PropTypes.object,
// };
// export default SelectedImage;
