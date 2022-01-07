import "../App.css";
import React, { useState } from "react";

import {
  Card,
  Button,
  CardImg,
  CardTitle,
  CardText,
  CardBody,
} from "reactstrap";
import { ButtonGroup, Col, Row, Badge } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";

function Movie(props) {
  const [watchMovie, setWatchMovie] = useState(false);
  const [votes, setVotes] = useState(false);
  const [myRatingMovie, setMyRatingMovie] = useState(0);
  const [countWatchMovie, setCountWatchMovie] = useState(0);

  let likeColor;
  if (props.movieLiked === true) {
    likeColor = { color: "#92D7A5" };
  }
  let watchColor;
  if (watchMovie === true) {
    watchColor = { color: "#00b894" };
  }

  //    number of stars depending on click on + ou -    //
  let plusOne = () => {
    setMyRatingMovie(myRatingMovie + 1);
    setVotes(true);
  };
  let minusOne = () => {
    setMyRatingMovie(myRatingMovie - 1);
    setVotes(true);
  };

  //    changer number of votes   //
  let globalCouting = props.globalCountRatingParent;
  if (votes === true) {
    globalCouting = globalCouting + 1;
  }

  let myRating = [];
  for (let i = 0; i < 10; i++) {
    if (i < myRatingMovie) {
      myRating.push(<FontAwesomeIcon icon={faStar} className="text-warning" />);
    }
  }

  //    calculate medium    //
  let totalRating = props.globalRatingParent * props.globalCountRatingParent;
  let totalNotesAfterMine = totalRating + myRatingMovie;
  let newTotalRating =
    totalNotesAfterMine / (props.globalCountRatingParent + 1);
  let roundedTotalRating = Math.round(newTotalRating);

  let totalRatingTab = [];
  for (let i = 0; i < roundedTotalRating; i++) {
    totalRatingTab.push(
      <FontAwesomeIcon icon={faStar} className="text-warning" />
    );
  }

  let clickLikeMovie = (myRatingMovie) => {
    props.handleClickAddMovieParent(
      props.movieNameParent,
      props.movieImgParent
    );
  };

  let deleteLikeMovie = () => {
    props.handleClickDeleteMovieParent(props.movieNameParent);
  };

  return (
    <Col xs="12" lg="6" xl="4">
      <Card className="card">
        <CardImg top width="100%" src={props.movieImgParent} />
        <CardBody>
          <div className="ratingBlock">
            <p className="pMovieCard">
              like:
              <FontAwesomeIcon
                icon={faHeart}
                onClick={() => {
                  if (props.movieLiked === false) {
                    clickLikeMovie();
                  }
                  if (props.movieLiked === true) {
                    deleteLikeMovie();
                  }
                }}
                style={likeColor}
              />
            </p>
            <Row>
              {/* <p className="pMovieCard">
                vues:
                <FontAwesomeIcon
                  icon={faVideo}
                  onClick={() =>
                    setWatchMovie(true, setCountWatchMovie(countWatchMovie + 1))
                  }
                  style={watchColor}
                />
                <Badge pill className="text-primary" color="primary">
                  {countWatchMovie}
                </Badge>
              </p> */}
            </Row>
            <div className="row">
              <p className="pMovieCard">mon avis: {myRating}</p>
            </div>
            <div className="pMovieCard plusMinusBlock">
              <ButtonGroup size="sm">
                <Button onClick={() => minusOne()}>-</Button>
                <Button onClick={() => plusOne()}>+</Button>
              </ButtonGroup>
            </div>
            <p className="pMovieCard">
              moyenne: {totalRatingTab}({globalCouting})
            </p>
          </div>
          <CardTitle tag="h5">{props.movieNameParent}</CardTitle>
          <CardText>{props.movieDescParent}</CardText>
        </CardBody>
      </Card>
    </Col>
  );
}

export default Movie;
