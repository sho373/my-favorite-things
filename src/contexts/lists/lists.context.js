import React, {useContext,createContext} from 'react';
import {useLists} from "../../hooks/hooks";
import PropTypes from 'prop-types';


export const ListsContext = createContext();

export const ListsProvider =  ({ children }) => {
  
  const { lists, setLists } = useLists();
    
  return (
    <ListsContext.Provider value={{ lists, setLists }}>
      {children}
    </ListsContext.Provider>
  );
};

export const useListsValue = () => useContext(ListsContext);

ListsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};