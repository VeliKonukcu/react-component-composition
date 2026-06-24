import { useState, useEffect } from "react";

const apiKey = "a81674ed74d3af1b6fa4bf8f4f0a1e52";

export default function useMovieDetails(movieId) {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  function addMovieToList(movie) {
    setSelectedMovies((selectedMovie) => [...selectedMovie, movie]);
  }

  useEffect(() => {
    if (!movieId) {
      setSelectedMovie(null);
      return;
    }
    async function getMovieDetails() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
        );
        const data = await res.json();
        setSelectedMovie(data);
      } catch (error) {
        setErrorMsg(error.message);
      }
    }
    getMovieDetails();
  }, [movieId]);
  return { selectedMovies, selectedMovie, errorMsg, addMovieToList };
}
