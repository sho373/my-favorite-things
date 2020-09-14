import React, { useState, useEffect } from 'react';
import { firestore } from '../../firebase/firebase.utils';
import PropTypes from 'prop-types';
//MUI
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  deleteIcon: {
    color: '#ff5b5b',
    '&:hover': {
      color: '#ff1414',
    },
  },
  infoIcon: {
    color: '#87ceeb',
    backgroundColor: '#ffffff',
    '&:hover': {
      color: '#00bfff',
    },
  },
  itemPicture: {
    overflow: 'hidden',
  },
  notSelected: {
    '&:hover': {
      border: '2px solid #4169e1',
      transform: 'scale(1.2)',
      opacity: '0.9',
      transition: 'transfomr 6s cubic-bezier(0.25,0.45,0.45,0.95)',
    },
  },
}));

const imgStyle = {
  transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s',
};
const selectedImgStyle = {
  transform: 'translateZ(0px) scale3d(0.9, 0.9, 1)',
  transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s',
};
const cont = {
  backgroundColor: '#eee',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
};

export const SelectedImage = ({
  photo,
  margin,
  direction,
  top,
  left,
  selected,
  page,
}) => {
  const Checkmark = ({ selected, classes }) => (
    <div
      style={
        selected
          ? { left: '4px', top: '4px', position: 'absolute', zIndex: '1' }
          : { display: 'none' }
      }
    >
      {page === 'main' && (
        <Tooltip title="Delete">
          <DeleteIcon
            className={classes.deleteIcon}
            onClick={() =>
              firestore
                .collection('items')
                .doc(photo.id)
                .delete()
                .then(() => {})
            }
          />
        </Tooltip>
      )}
      {page === 'list' && (
        <Tooltip title="Info">
          <InfoIcon
            className={classes.infoIcon}
            onClick={() => {
              if (photo.itemurl) window.open(photo.itemurl, '_blank');
            }}
          />
        </Tooltip>
      )}
    </div>
  );

  const classes = useStyles();

  const [isSelected, setIsSelected] = useState(selected);
  //calculate x,y scale
  const sx = (100 - (30 / photo.width) * 100) / 100;
  const sy = (100 - (30 / photo.height) * 100) / 100;
  selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`;

  if (direction === 'column') {
    cont.position = 'absolute';
    cont.left = left;
    cont.top = top;
  }

  const handleOnClick = (e) => {
    setIsSelected(!isSelected);
  };

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  return (
    <div
      style={{ margin, height: photo.height, width: photo.width, ...cont }}
      className={!isSelected ? 'not-selected' : ''}
    >
      <Checkmark
        selected={isSelected ? true : false}
        classes={classes}
        photo={photo}
      />
      <img
        alt={photo.title}
        style={
          isSelected ? { ...imgStyle, ...selectedImgStyle } : { ...imgStyle }
        }
        {...photo}
        onClick={handleOnClick}
      />

      <style>{`.not-selected:hover{outline:2px solid royalblue}`}</style>
    </div>
  );
};
SelectedImage.propTypes = {
  photo: PropTypes.object,
  margin: PropTypes.string,
  direction: PropTypes.string,
  top: PropTypes.number,
  left: PropTypes.number,
  selected: PropTypes.bool,
  page: PropTypes.string,
  classes: PropTypes.object,
};

export default SelectedImage;
