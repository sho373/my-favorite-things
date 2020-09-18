import React from 'react';
import Link from '@material-ui/core/Link';
import { ReactComponent as Logo } from '../../assets/tmdb-2020.svg';

import './about.styles.scss';

class About extends React.Component {
  render() {
    return (
      <div className="about">
        <h2 className="title">Film data</h2>
        <span>
          All film-related metadata used in this application, including movie
          title, release dates and poster art is supplied by{' '}
          <Link href="https://www.themoviedb.org/">The Movie Database </Link>
          (TMDb).
        </span>

        <span>
          This app uses the TMDb API but is not endorsed or certified by TMDb.
        </span>

        <Link className="logo-container" to="https://www.themoviedb.org/">
          <Logo />
        </Link>
        <h2 className="title">Book data</h2>
        <span>
          All book-related metadata used in this application, including book
          title, author name, publisher name and book image is supplied by{' '}
          <Link href="https://webservice.rakuten.co.jp/api/bookstotalsearch/">
            Rakuten Books Total Search API
          </Link>
        </span>
        <span>
          This app uses the Rakuten Books Total Search API but is not endorsed
          or certified by Rakuten Developers.
        </span>
        <div className="img-container">
          <a href="https://webservice.rakuten.co.jp/" target="_blank">
            <img
              src="https://webservice.rakuten.co.jp/img/credit/200709/credit_31130.gif"
              border="0"
              alt="Rakuten Web Service Center"
              title="Rakuten Web Service Center"
              width="311"
              height="30"
            />
          </a>
        </div>
      </div>
    );
  }
}

export default About;
