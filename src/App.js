import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import './App.css';

import ResponsiveDrawer from './components/responsive-drawer/responsive.drawer.component';
import HomePage from './pages/homepage/homepage.component';
import Users from './pages/users-list/users.component';
import Profile from './pages/profile/profile.component';
import SignIn from './pages/sign-in/sign-in.component';
import SignUp from './pages/sign-up/sign-up.component';
import SignOut from './pages/sign-out/sign-out.component';
import ResultsPage from './pages/search-results/results.component';

import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { ListsProvider, SelectedListProvider } from './contexts/lists/index';
import CurrentUserContext from './contexts/current-user/current-user.context';

export const pageNotFound = () => {
  return (
    <h1 style={{ margin: '50px' }} data-testid="page-not-found">
      404 Page not found
    </h1>
  );
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: null,
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot((snapShot) => {
          this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data(),
            },
          });
        });
      }

      this.setState({ currentUser: userAuth });
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }
  render() {
    return (
      <div>
        <SelectedListProvider>
          <ListsProvider>
            <main data-testid="application">
              <CurrentUserContext.Provider value={this.state.currentUser}>
                <ResponsiveDrawer />

                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() =>
                      this.state.currentUser ? <HomePage /> : <div></div>
                    }
                  />
                  <Route
                    exact
                    path="/profile"
                    render={() =>
                      this.state.currentUser ? (
                        <Profile />
                      ) : (
                        <Redirect to="/signin" />
                      )
                    }
                  />
                  <Route
                    exact
                    path="/signup"
                    render={() =>
                      this.state.currentUser ? <Redirect to="/" /> : <SignUp />
                    }
                  />
                  <Route
                    exact
                    path="/signin"
                    render={() =>
                      this.state.currentUser ? <Redirect to="/" /> : <SignIn />
                    }
                  />
                  <Route exact path="/users/:displayName" component={Users} />
                  <Route exact path="/search" component={ResultsPage} />
                  <Route exact path="/signout" component={SignOut} />
                  <Route component={pageNotFound} />
                </Switch>
              </CurrentUserContext.Provider>
            </main>
          </ListsProvider>
        </SelectedListProvider>
      </div>
    );
  }
}

export default App;
