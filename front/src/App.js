import "./App.css";
import React, { useState, useEffect } from "react";
import Movie from "./components/movie";

import { Nav } from "reactstrap";
import { Container, Row } from "reactstrap";
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

function App() {
  const [moviesList, setMoviesList] = useState([]);
  const [moviesWishList, setMoviesWishList] = useState([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const toggle = () => setPopoverOpen(!popoverOpen);
  const [moviesCount, setMoviesCount] = useState(0);


  //    retrieve all movies from api + load wishlist from DB   //
  useEffect(async () => {
    let rawMoviesFetch = await fetch("/new-movies");
    let moviesFetch = await rawMoviesFetch.json();
    setMoviesList(moviesFetch.resultRaw.results);

    let retrieveMoviesFromWishlist = await fetch("/loadWishlist");
    let list = await retrieveMoviesFromWishlist.json();
    setMoviesWishList(list.allMovies);
    setMoviesCount(list.allMovies.length);
  }, []);

  //    increase liked movies count & add movie name to wishlist    //
  let handleClickAddMovie = async (title, img) => {
    setMoviesCount(moviesCount + 1);
    setMoviesWishList([
      ...moviesWishList,
      {
        title: title,
        img: img,
      },
    ]);

    let addWishListToDb = await fetch("/addToWishlist", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `title=${title}&img=${img}`,
    });
  };

  //    delete movie    //
  let handleClickDeleteMovie = async (movieNameParent) => {
    setMoviesCount(moviesCount - 1);
    setMoviesWishList(
      moviesWishList.filter((each) => each.title !== movieNameParent)
    );

    let deleteWishListFromDb = await fetch(`/deleteMovie/${movieNameParent}`, {
      method: "DELETE",
    });
  };

  //    wishlist    //
  let wishList = moviesWishList.map(function (element, i) {
    return (
      <ListGroup key={i}>
        <ListGroupItem>
          <div>
            <img
              width="100%"
              src={element.img}
              className="likedMovieImage"
              alt={element.title}
              onClick = {() => handleClickDeleteMovie(element.title)}
            />
          </div>
          <div>
            <p>{element.title}</p>
          </div>
        </ListGroupItem>
      </ListGroup>
    );
  });

  let displayedMoviesList = moviesList.map(function (element, i) {
    let isLiked = false;
    for (let i = 0; i < moviesWishList.length; i++) {
      if (element.title == moviesWishList[i].title) {
        isLiked = true;
      }
    }
    let movieDesc = element.overview;
    if (element.overview.length > 400) {
      movieDesc = element.overview.slice(0, 400) + " ...";
    }

    let apiPath = "https://image.tmdb.org/t/p/w500/";
    let imgPath = `${apiPath}${element.backdrop_path}`;
    let noImage = "../img/no_image.jpg";
    let movieImg;
    if (element.backdrop_path === null) {
      movieImg = noImage;
    } else {
      movieImg = imgPath;
    }

    return (
      <Movie
        key={i}
        movieLiked={isLiked}
        movieNameParent={element.title}
        movieDescParent={movieDesc}
        movieImgParent={movieImg}
        globalRatingParent={element.vote_average}
        globalCountRatingParent={element.vote_count}
        handleClickAddMovieParent={handleClickAddMovie}
        handleClickDeleteMovieParent={handleClickDeleteMovie}
      />
    );
  });

  return (
    <div className="main">
      <div className="row col-12 m-4">
        <Nav className="navBar">
          <img src="./img/logo.png" alt="logo" />
          <h1 className="title">My movies</h1>
          <div>
            <Button id="Popover" type="button" color="primary">
              {moviesCount} film(s)
            </Button>
            <Popover
              placement="bottom"
              isOpen={popoverOpen}
              target="Popover"
              toggle={toggle}
              className="text-primary"
              color="primary"
            >
              <PopoverHeader>my movies</PopoverHeader>
              <PopoverBody className="popoverBody">{wishList}</PopoverBody>
            </Popover>
          </div>
        </Nav>
      </div>

      <div>
        <Container>
          <Row>{displayedMoviesList}</Row>
        </Container>
      </div>
    </div>
  );
}

export default App;
