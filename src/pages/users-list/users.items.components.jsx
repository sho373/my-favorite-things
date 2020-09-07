import React, {useCallback} from 'react';
import {useItems} from '../../hooks/hooks';
import Gallery from "react-photo-gallery";
import SelectedImage from '../../components/main/selectedImage.component';


export const UsersItem = (props) => {
    
    const {items} = useItems(props.list,props.genreName)

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
          page={"list"}
        />
      ),
      []
    );

    return (
        <div >
        {items.length > 0 && (<Gallery photos={items} 
            direction={"column"} 
            columns={3} margin={5} 
            renderImage={imageRenderer}
            />)}
        </div>
    )
} 

export default UsersItem