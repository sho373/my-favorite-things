import React from 'react';
import Link from '@material-ui/core/Link';

import './sign-out.styles.scss';

class SignOut extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <div className="sign-out">
        <h2 className="title">You have been signed out</h2>
        <span>Thank you for using this app!</span>
        <h4 className="sign-in-here">
          sign in <Link href="/signin">here</Link>
        </h4>
      </div>
    );
  }
}

export default SignOut;
