
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

export const generatePushId = (() => {
  const PUSH_CHARS =
    '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

  const lastRandChars = [];

  return function() {
    let now = new Date().getTime();

    const timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      now = Math.floor(now / 64);
    }

    let id = timeStampChars.join('');

    for (i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }

    return id;
  };
})();
