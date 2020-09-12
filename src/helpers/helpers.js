export const getTitle = (lists, listId) =>
  lists.find(list => list.listId === listId);

export const getGenre = (lists, genreName) =>
  lists.find(list => list.genreName === genreName);

export const sortedList = (lists) => {
  let sortedLists = lists.slice();

  sortedLists.sort(function(a, b) {
    if(a.genreName < b.genreName){
        return -1;  
    }else if(a.genreName > b.genreName){
        return 1;
    }else{
        if(a.name < b.name){
           return -1
        }else if(a.name > b.name){
          return 1;
        }else{
          return 0;
        }
    }
  });
  
  return sortedLists
} 
