import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useHistory } from 'react-router-dom';
//MUI
import Paper from '@material-ui/core/Paper';
import { makeStyles, fade, withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { css } from '@emotion/core';
import BarLoader from 'react-spinners/BarLoader';

const override = css`
  display: block;
  top: 78px;
  left: 0px;
  width: 100%;
  position: absolute;
`;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  search: {
    border: 2,
    position: 'relative',
    borerColer: '#000000',
    variant: 'outlined',
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(0),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 0, 0, 1),
    border: 2,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: '#000000',
  },
  paper: {
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #ced4da',
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(2, 0, 2, 0),
  },
  inputInput: {
    border: 0,
    fontSize: 15,
    padding: theme.spacing(1.6, 1, 1.6, 0),
    paddingLeft: `calc(1em + ${theme.spacing(0)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
    },
    [theme.breakpoints.down('sm')]: {
      width: '10ch',
    },
  },
  genreButton: {
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
  },
}));

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    padding: theme.spacing(1.6, 0, 1.6, 1),
    margin: theme.spacing(0, 0, 0, 1),
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    borderRight: 0,
    fontSize: 15,
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),

    '&:focus': {
      borderRadius: theme.shape.borderRadius,
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0',
    },
  },
}))(InputBase);

let REACT_APP_RAKUTEN_BOOKS_API_URL =
  process.env.REACT_APP_RAKUTEN_BOOKS_API_URL;
const REACT_APP_RAKUTEN_APP_ID = process.env.REACT_APP_RAKUTEN_APP_ID;
//const REACT_APP_IGDB_API_KEY = process.env.REACT_APP_IGDB_API_KEY;
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
//const proxy = 'https://cors-anywhere.herokuapp.com/';

axios.defaults.baseURL = 'https://project-9fe3c.web.app/';

export const SearchArea = () => {
  const classes = useStyles();

  const [works, setWorks] = useState('');
  const [myValue, setMyValue] = useState('');
  const [genreName, setGenreName] = useState('book');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    //document.getElementById('myForm').reset();
    setWorks('');
    setGenreName(event.target.value);
  };

  const handleSearch = (event) => {
    setMyValue(event.target.value);
  };

  const loadClose = () => {
    setLoading(false);
  };

  const searchRakuten = (event) => {
    event.preventDefault();

    let sortString = '';
    if (genreName === 'manga') {
      sortString = '&booksGenreId=001001';
    }

    const requestUrl =
      REACT_APP_RAKUTEN_BOOKS_API_URL +
      '&format=json' +
      '&applicationId=' +
      REACT_APP_RAKUTEN_APP_ID +
      '&sort' +
      encodeURI('reviewCount') +
      '&outOfStockFlag=1' +
      sortString +
      '&keyword=' +
      encodeURIComponent(myValue);

    if (myValue) {
      axios
        .get(requestUrl)
        .then((data) => {
          if (data.data.Items.length === 0) {
            setOpen(true);
          } else {
            setWorks([...data.data.Items]);
          }
          setLoading(false);
        })
        .catch((error) => {
          setOpen(true);

          return;
        });
    } else {
      setLoading(false);
    }
  };

  const searchMovie = (event) => {
    event.preventDefault();

    let sortString = 'movie';
    let requestUrl = '';
    if (genreName === 'tvseries' || genreName === 'anime') {
      sortString = 'tv';
    }
    const containsJapanese = myValue.match(
      /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/
    );
    requestUrl =
      `https://api.themoviedb.org/3/search/` +
      sortString +
      `?api_key=${TMDB_API_KEY}&query=${myValue}`;
    if (containsJapanese) {
      requestUrl = requestUrl.concat('&language=ja');
    }

    if (myValue) {
      axios
        .get(requestUrl)
        .then((data) => {
          //console.log("USING MOVIE API ")

          if (data.data.results.length === 0) {
            setOpen(true);
          } else {
            setWorks([...data.data.results]);
          }
          setLoading(false);
        })
        .catch((error) => {
          setOpen(true);
        });
    } else {
      setLoading(false);
    }
  };

  // const searchMusic = (event) => {
  //   event.preventDefault();
  //   let url = `https://itunes.apple.com/search?term=${myValue}&country=jp&limit=15&media=music&entity=musicTrack`;

  //   myValue
  //     ? axios
  //         .get(url)
  //         .then((data) => {
  //           //console.log("USING MUSIC API ")

  //           if (data.data.results.length === 0) {
  //             setOpen(true);
  //           } else {
  //             setWorks([...data.data.results]);
  //           }
  //           setLoading(false);
  //         })
  //         .catch((error) => {
  //           setOpen(true);
  //         })
  //     : setLoading(false);
  // };

  // const searchGame = (event) => {
  //   event.preventDefault();

  //   axios.defaults.headers.common['user-key'] = REACT_APP_IGDB_API_KEY;
  //   axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  //   axios
  //     .get(
  //       `https://api-v3.igdb.com/games?search=${myValue}&region=5&fields=name,first_release_date,cover.url,url&limit=15`,
  //       {
  //         withCredentials: true,
  //       }
  //     )
  //     .then((data) => {
  //       if (data.data.length === 0) {
  //         setOpen(true);
  //       } else {
  //         setWorks([...data.data]);
  //       }
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       setOpen(true);
  //     });
  // };

  useEffect(() => {
    if (works) {
      //console.log('useeffect');
      history.push({
        pathname: '/search',
        state: { results: works, genreId: genreName },
      });
    }
  }, [works]);

  return (
    <div className={classes.root}>
      <NativeSelect
        className={classes.genreButton}
        id="demo-customized-select-native"
        value={genreName}
        onChange={handleChange}
        input={<BootstrapInput />}
      >
        {/* <option aria-label="No" value="" /> */}
        <option value={'book'}> Book</option>
        <option value={'manga'}> Manga</option>
        <option value={'movie'}> Movie</option>
        <option value={'tvseries'}> TV Series</option>
        <option value={'anime'}> Anime</option>
        {/* <option value={'music'}> Music</option> */}
        {/* <option value={'game'}> Game</option> */}
      </NativeSelect>

      <div className={classes.search}>
        <div className={classes.searchIcon} />

        <form
          id="myForm"
          onSubmit={
            genreName === 'book' || genreName === 'manga'
              ? searchRakuten
              : genreName === 'movie' ||
                genreName === 'anime' ||
                genreName === 'tvseries'
              ? searchMovie
              : searchMovie
            //: genreName === 'music'
            //? searchMusic
            // : genreName === 'game'
            // ? searchGame
            //searchMusic
          }
        >
          <Paper className={classes.paper}>
            <InputBase
              placeholder="Enter title…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={handleSearch}
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton
              className={classes.searchButton}
              type="submit"
              aria-label="search"
              onClick={() => setLoading(true)}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </Paper>
        </form>
      </div>

      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">NO RESULTS</DialogTitle>
          <DialogContent>
            There were no matches for your search term.
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose();
                loadClose();
              }}
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {!open && (
        <BarLoader
          css={override}
          size={150}
          color={'#36d7b7'}
          loading={loading}
        />
      )}
    </div>
  );
};

export default SearchArea;
