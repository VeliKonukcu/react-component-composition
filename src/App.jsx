import { useEffect, useState } from "react";

const getAverage = (array) =>
  array.reduce((sum, value) => sum + value / array.length, 0);

const apiKey = "a81674ed74d3af1b6fa4bf8f4f0a1e52";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieId, setMovieId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("")
  const [query, setQuery] = useState("")

  useEffect(() => {

    if (query.length < 2) {
      setMovies([]);
      setErrMsg("");
      return;
    }

    async function getMovies() {
      try {
        setErrMsg("")
        setLoading(true)
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`)
        
        if (!res.ok) {
          throw new Error("Bilinmeyen bir hata oluştu!")
        }
        
        const data = await res.json();
        if (data.total_results === 0) {
          throw new Error("Film Bulunamadı.")
        }

        setMovies(data.results);
      } catch (error) {
        setErrMsg(error.message);
      } finally {
        setLoading(false);
      }
    }

    getMovies();
  //   fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`)
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data.results))
  
  }, [query]);

  useEffect(() => {
    if (!movieId) {
      setSelectedMovie(null)
      return
    }
    async function getMovieDetails() {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
        const data = await res.json();
        setSelectedMovie(data)
      } catch (error) {
        setErrMsg(error.message);
      }
    }
    getMovieDetails()
  }, [movieId])

  return (
    <>
      <Nav>
        <Logo />
        <Search>
          <input type="text" className="form-control" value={query} placeholder="Film ara..." onChange={(e) => setQuery(e.target.value)} />
        </Search>
        <NavSearchResults movies={movies} />
      </Nav>
      <Main>
        {
          errMsg ? (
            <ErrorMessage errMsg={errMsg} />
          ) :
            loading ? (<Loading />) :
                  (<div className="row mt-2">
                      <div className="col-md-9">
                        <ListContainer>
                          <MovieList>
                            <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-4">
                              {movies.map((movie) => (
                                <Movie movie={movie} key={movie.id} setMovieId={setMovieId} movieId={movieId} />
                              ))}
                            </div>
                          </MovieList>
                        </ListContainer>
                      </div>
                      <div className="col-md-3">
                        <ListContainer>
                          <MyListSummary selectedMovies={selectedMovies} />
                          <MovieList>
                            {/* {selectedMovies.map((movie) => (
                              <MyListMovie movie={movie} key={movie.id} />
                            ))} */}
                            {selectedMovie && <MyListMovie movie={selectedMovie} setSelectedMovie={setSelectedMovie} setMovieId={setMovieId} />}
                          </MovieList>
                        </ListContainer>
                      </div>
                    </div>
                  )
        }
      </Main>
    </>
  );
}

function Loading() {
  return (
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

function ErrorMessage({errMsg}) {
  return (
    <div className="alert alert-danger mt-4" role="alert">
      {errMsg}
    </div>
  )
}

function Nav({ children }) {
  return (
    <nav className="bg-primary text-white p-2">
      <div className="container">
        <div className="row align-items-center">
          {children}
        </div>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <div className="col-4">
      <i className="bi bi-camera-reels me-2"></i>
      Movie App
    </div>
  );
}

function Search({children}) {
  return (
    <div className="col-4">
      {children}
    </div>
  );
}

function NavSearchResults({ movies }) {
  return (
    <div className="col-4 text-end">
      <strong>{movies.length}</strong> kayıt bulundu.
    </div>
  );
}

function Main({ children }) {
  return (
    <main className="container">
      {children}
    </main>
  );
}

function ListContainer({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="movie-list">
      <button
        className="btn btn-sm btn-outline-primary mb-2"
        onClick={() => setIsOpen((val) => !val)}
      >
        {isOpen ? (
          <i className="bi bi-chevron-up"></i>
        ) : (
          <i className="bi bi-chevron-down"></i>
        )}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ children }) {
  return (
    <>
      {children}
    </>
  );
}

function Movie({ movie, movieId, setMovieId }) {
  return (
    <div className="col mb-2" onClick={() => setMovieId(movieId => movie.id === movieId ? 0 : movie.id) }>
      <div className="card movie">
        <img src={
          movie.poster_path ? `https://media.themoviedb.org/t/p/w440_and_h660_face` + movie.poster_path
            : "/img/no-image.jpg"}
          alt={movie.title}
          className="card-img-top"
        />
        <div className={movie.id === movieId ? "card-body selected-movie" : "card-body"}>
          <h6 className="card-title">{movie.title}</h6>
          <div>
            <i className="bi bi-calendar2-date me-1"></i>
            <span>{movie.release_date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


function MyListSummary({ selectedMovies }) {
  const avgRating = getAverage(selectedMovies.map((m) => m.rating));
  const avgDuration = getAverage(selectedMovies.map((m) => m.duration));
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h5>Listeye [{selectedMovies.length}] film eklendi.</h5>
        <div className="d-flex justify-content-between">
          <p>
            <i className="bi bi-star-fill text-warning me-1"></i>
            <span>{avgRating.toFixed(2)}</span>
          </p>
          <p>
            <i className="bi bi-hourglass-split text-warning me-1"></i>
            <span>{avgDuration.toFixed(2)} dk</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function MyListMovie({ movie, setSelectedMovie, setMovieId}) {
  return (
    <div className="card mb-2">
      <div className="row">
        <div className="col-4">
          <img src={movie.poster_path ?
            `https://media.themoviedb.org/t/p/w440_and_h660_face` + movie.poster_path
            : "/img/no-image.jpg"}
            alt={movie.title}
            className="img-fluid rounded-start"
          />
          <button className="btn btn-sm btn-danger my-1" onClick={() => setSelectedMovie(null) & setMovieId(0)}>Kaldır</button>
        </div>
        <div className="col-8">
          <div className="card-body">
            <h6 className="card-title">{movie.title}</h6>
            <div>
              <p>
                <i className="bi bi-star-fill text-warning me-1"></i>
                <span>{movie.vote_average.toFixed(1)}</span>
              </p>
              <p>
                <i className="bi bi-hourglass text-warning me-1"></i>
                <span>{movie.runtime} dk</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}