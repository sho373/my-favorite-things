import React, {useContext,createContext,useState} from 'react';

import PropTypes from 'prop-types';

export const SelectedListContext = createContext();

export const SelectedListProvider = ({ children }) => {
    const [selectedList, setSelectedList] = useState('');

    return(
        <SelectedListContext.Provider 
            value ={{selectedList, setSelectedList}}>
            {children}
        </SelectedListContext.Provider>
     )
}

export const useSelectedListValue = () => useContext(SelectedListContext)

SelectedListProvider.propTypes = {
    children: PropTypes.node.isRequired,
};