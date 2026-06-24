import { useState } from "react";
import StarRating from "./StarRating";

import useMovies from "./hooks/useMovies";
import useMovieDetails from "./hooks/useMovieDetails";

const getAverage = (array) =>
  array.reduce((sum, value) => sum + value / array.length, 0);

export default function App() {
  const [movieId, setMovieId] = useState(0);
  const [query, setQuery] = useState("");

  const {
    movies,
    loading,
    errMsg,
    currentPage,
    totalPage,
    totalResults,
    previousPage,
    nextPage,
    goToPage,
  } = useMovies(query);

  const { selectedMovies, selectedMovie, errorMsg, addMovieToList } =
    useMovieDetails(movieId);

  return (
    <>
      <Nav>
        <Logo />
        <Search>
          <input
            type="text"
            className="form-control"
            value={query}
            placeholder="Film ara..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </Search>
        <NavSearchResults totalResults={totalResults} />
      </Nav>
      <Main>
        {errMsg ? (
          <ErrorMessage errMsg={errMsg} />
        ) : errorMsg ? (
          <ErrorMessage errMsg={errorMsg} />
        ) : loading ? (
          <Loading />
        ) : (
          <div className="row mt-2">
            <div className="col-md-9">
              <ListContainer>
                <MovieList>
                  <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-4">
                    {movies.map((movie) => (
                      <Movie
                        movie={movie}
                        key={movie.id}
                        setMovieId={setMovieId}
                        movieId={movieId}
                      />
                    ))}
                  </div>
                </MovieList>
              </ListContainer>
            </div>
            <div className="col-md-3">
              <ListContainer>
                <MyListSummary selectedMovies={selectedMovies} />
                <MovieList>
                  {selectedMovie && (
                    <MyListMovie
                      movie={selectedMovie}
                      setMovieId={setMovieId}
                      addMovieToList={addMovieToList}
                    />
                  )}
                  <StarRating />
                </MovieList>
              </ListContainer>
            </div>
            {totalResults ? (
              <ChangePage
                previousPage={previousPage}
                nextPage={nextPage}
                totalPage={totalPage}
                currentPage={currentPage}
                goToPage={goToPage}
              />
            ) : null}
          </div>
        )}
      </Main>
    </>
  );
}

function ChangePage({
  previousPage,
  nextPage,
  goToPage,
  totalPage,
  currentPage,
}) {
  const pageNumbers = [];
  const maxPageToShow = 10;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageToShow / 2));
  let endPage = startPage + maxPageToShow - 1;

  if (endPage > totalPage) {
    endPage = totalPage;
    startPage = Math.max(1, endPage - maxPageToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="pagination d-flex justify-content-center">
      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <a
          className="page-link"
          href="#"
          aria-label="Previous"
          onClick={() => previousPage()}
        >
          <span aria-hidden="true">&laquo;</span>
          <span className="sr-only">Önceki</span>
        </a>
      </li>
      {pageNumbers.map((page) => (
        <li
          key={page}
          className={currentPage === page ? "page-item active" : "page-item"}
        >
          <a className="page-link" href="#" onClick={() => goToPage(page)}>
            {page}
          </a>
        </li>
      ))}
      <li
        className={`page-item ${currentPage === totalPage ? "disabled" : ""} `}
      >
        <a
          className="page-link"
          href="#"
          aria-label="Next"
          onClick={() => nextPage()}
        >
          <span className="sr-only">Sonraki</span>
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  );
}

function Loading() {
  return (
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

function ErrorMessage({ errMsg }) {
  return (
    <div className="alert alert-danger mt-4" role="alert">
      {errMsg}
    </div>
  );
}

function Nav({ children }) {
  return (
    <nav className="bg-primary text-white p-2">
      <div className="container">
        <div className="row align-items-center">{children}</div>
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

function Search({ children }) {
  return <div className="col-4">{children}</div>;
}

function NavSearchResults({ totalResults }) {
  return (
    <div className="col-4 text-end">
      <strong>{totalResults}</strong> kayıt bulundu.
    </div>
  );
}

function Main({ children }) {
  return <main className="container">{children}</main>;
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
  return <>{children}</>;
}

function Movie({ movie, movieId, setMovieId }) {
  return (
    <div
      className="col mb-2"
      onClick={() =>
        setMovieId((movieId) => (movie.id === movieId ? 0 : movie.id))
      }
    >
      <div className="card movie">
        <img
          src={
            movie.poster_path
              ? `https://media.themoviedb.org/t/p/w440_and_h660_face` +
                movie.poster_path
              : "/img/no-image.jpg"
          }
          alt={movie.title}
          className="card-img-top"
        />
        <div
          className={
            movie.id === movieId ? "card-body selected-movie" : "card-body"
          }
        >
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
  const avgRating = getAverage(selectedMovies.map((m) => m.vote_average));
  const avgDuration = getAverage(selectedMovies.map((m) => m.runtime));
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
        {selectedMovies.map((movie) => (
          <div key={movie.id} className="row">
            <div className="col-4 p-0">
              <img
                src={
                  movie.poster_path
                    ? `https://media.themoviedb.org/t/p/w440_and_h660_face` +
                      movie.poster_path
                    : "/img/no-image.jpg"
                }
                alt={movie.title}
                className="img-fluid rounded mx-3 my-1"
              />
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
        ))}
      </div>
    </div>
  );
}

function MyListMovie({ movie, setMovieId, addMovieToList }) {
  const date = new Date(movie.release_date);
  return (
    <div className="card mb-2">
      <div className="row">
        <div className="col-4 p-0">
          <img
            src={
              movie.poster_path
                ? `https://media.themoviedb.org/t/p/w440_and_h660_face` +
                  movie.poster_path
                : "/img/no-image.jpg"
            }
            alt={movie.title}
            className="img-fluid rounded mx-3 my-1"
          />
        </div>
        <div className="col-8">
          <div className="card-body">
            <h6 className="card-title">{movie.title}</h6>
            <i className="bi bi-calendar2-date me-1"></i>
            <small>{date.getFullYear()}</small>
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
        <div className="col-12 border-top">
          <p className="m-2">{movie.overview}</p>
          <p>
            {movie.genres?.map((genre) => (
              <span key={genre.id} className="badge text-bg-primary me-1">
                {genre.name}
              </span>
            ))}
          </p>
        </div>
        <div>
          <button
            className="btn btn-sm btn-info"
            onClick={() => addMovieToList(movie)}
          >
            Ekle
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => setMovieId(0)}
          >
            Kaldır
          </button>
        </div>
      </div>
    </div>
  );
}
