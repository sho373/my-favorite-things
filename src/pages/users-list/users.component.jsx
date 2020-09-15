import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { firestore } from '../../firebase/firebase.utils';

import { UsersItem } from './users.items.component';
import { sortedList } from '../../helpers/helpers';

import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(0.5, 'auto'),
    padding: theme.spacing(0, 1),
    [theme.breakpoints.up('sm')]: {
      width: 600,
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  listName: {
    color: '#2c2c2c',
    margin: theme.spacing(3.5, 'auto', 2.5, 'auto'),
  },
  title: {
    color: '#2c2c2c',
    margin: theme.spacing(5.5, 'auto', 2.5, 'auto'),
  },
  divider: {
    color: '#ff7a7a',
    margin: theme.spacing(0, 'auto', 4, 'auto'),
  },
  noUser: {
    margin: theme.spacing(5, 'auto'),
  },
}));

export const Users = (props) => {
  const classes = useStyles();

  const [userId, setUserId] = useState([]);
  const [lists, setLists] = useState([]);
  const [errorMes, setErrorMes] = useState(false);

  const currentUserName = props.match.params
    ? props.match.params.displayName
    : '';

  const getUserId = async (userName) => {
    const snapshot = await firestore
      .collection('users')
      .where('displayName', '==', userName);
    const checkSnapshot = await snapshot.get();

    if (checkSnapshot.empty) {
      setErrorMes(true);
    }

    snapshot
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          setUserId(doc.id);
        });
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
        setErrorMes(true);
      });
  };

  const useLists = (userId) => {
    useEffect(() => {
      if (userId) {
        //console.log("use items")

        let unsubscribe = firestore
          .collection('lists')
          .where('userid', '==', userId);

        unsubscribe = unsubscribe.onSnapshot((snapshot) => {
          const newItems = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }));

          setLists(newItems);
        });

        return () => unsubscribe();
      }
    }, [userId]);

    return { lists };
  };

  getUserId(currentUserName);
  useLists(userId);

  let sortedLists = sortedList(lists);

  return (
    <div className={classes.root}>
      <h2 className={classes.title}>
        A List of {currentUserName}&rsquo;s Favorite Things
      </h2>
      <Divider />

      {sortedLists &&
        sortedLists.map((list) => {
          return (
            <div key={list.listId}>
              <h2 className={classes.listName}>{list.name}</h2>
              <UsersItem list={list.listId} genreName={list.genreName} />
            </div>
          );
        })}

      {errorMes && <h1 className={classes.noUser}>USER NOT FOUND</h1>}
    </div>
  );
};
Users.propTypes = {
  match: PropTypes.object,
};
export default Users;
