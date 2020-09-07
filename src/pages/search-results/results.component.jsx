import React, {Component}from 'react';
import {ResultsCardBook} from './results.card.book.component';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';


const styles = (theme) => ({
    paper:{
        marginTop:40,
        marginRight:"auto",
        marginLeft:"auto",
        width:420,
        [theme.breakpoints.down('sm')]:{
            
        },
    }
})

class ResultsPage extends Component {


   render(){
    
    const {classes} = this.props;

    return (
        <div>
            
        <Paper className={classes.paper}>
           {this.props.location.state && (
                ( this.props.location.state.genreId === 'book' || 
                this.props.location.state.genreId === 'manga') ? 
                    <div className="book-list">
                    {  
                        this.props.location.state.results.map((book,index) =>{
                            if(book.Item.largeImageUrl.includes("noimage_01.gif")) return null;
                            
                            let image = book.Item.largeImageUrl.replace('?_ex=200x200','?_ex=500x500');
                            let title = book.Item.title
                            let author = book.Item.author ? book.Item.author : book.Item.hardware
                            let itemUrl = book.Item.itemUrl;
                            let publisherName = book.Item.publisherName;
            
                            return image && 
                                <div className = "card" key={index}><ResultsCardBook
                                    key={index}
                                    image = {image}
                                    title={title ? title : "No"}
                                    author={author}
                                    itemUrl={itemUrl}
                                    publisherName={publisherName}
                                    genreName={this.props.location.state.genreId}
                                    /></div>
                        })
                    }
                    </div> 
                    
                    :  (this.props.location.state.genreId === 'anime' ||
                    this.props.location.state.genreId === 'tvseries' ||
                    this.props.location.state.genreId === 'movie') 
                    ? 
                    <div className = "movie-list">
                        {this.props.location.state.results.map((movie,index) => {
                            if(movie.poster_path === null) return null;
                            
                            let image = `https://image.tmdb.org/t/p/original${movie.poster_path}`
                            let releaseDate;
                            let title;
                            let itemUrl;

                            if(this.props.location.state.genreId === 'movie'){
                                releaseDate = movie.release_date;
                                title =  movie.title;
                                itemUrl =  "https://www.themoviedb.org/movie/"+ movie.id
                            }else{
                                releaseDate = movie.first_air_date;
                                title =  movie.name;
                                itemUrl =  "https://www.themoviedb.org/tv/" + movie.id
                            }
                           
                            return image && <div className = "card" key={index}><ResultsCardBook 
                                        key={index}
                                        image = {image}
                                        title={title}
                                        author={releaseDate}
                                        genreName={this.props.location.state.genreId}
                                        itemUrl={itemUrl}
                                        /></div>
                        })
                        }
                    </div>
                    : (this.props.location.state.genreId === 'music')  
                    ? <div className="music-list">
                        {  
                            this.props.location.state.results.map((music,index) =>{
                                let image = music.artworkUrl100.replace("100x100bb.jpg","500x500bb.jpg");
                                let title = music.collectionCensoredName
                                let author = music.artistName
                                let itemUrl = music.trackViewUrl
                                return image && <div className = "card" key={index}><ResultsCardBook
                                            key={index}
                                            image = {image}
                                            title={title ? title : "No"}
                                            author={author}
                                        itemUrl = {itemUrl}
                                        genreName={'music'}
                                            /></div>
                            })
                        }
                    </div>
                    :(this.props.location.state.genreId === 'game')
                    ? <div className="game-list">
                        {this.props.location.state.results.map((game,index) =>{
                            let image = game.cover ? "https:" + game.cover.url.replace('t_thumb','t_cover_big') : "";
                            let title = game.name;
                            let releaseDate = game.first_release_date ? new Date(game.first_release_date * 1000).toLocaleDateString('ja-JP').slice(0,4) : "";
                            let itemUrl = game.url
                            return image && <div className = "card" key={index}><ResultsCardBook
                                        key={index}
                                        image = {image ? image : "No"}
                                        title={title ? title : "No"}
                                        author={releaseDate}
                                        genreName={"game"}
                                        itemUrl={itemUrl}
                                        /></div>
                        })     
                        }
                         </div>
                    : <div></div>
                )
            }
        </Paper>
        </div>
    )
}
}

export default withStyles(styles)(ResultsPage)