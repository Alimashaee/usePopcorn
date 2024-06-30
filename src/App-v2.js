import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { cleanup } from "@testing-library/react";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

const average = (arr) =>
  Math.round(
    (arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0) +
      Number.EPSILON) *
      10
  ) / 10;

const key = "85ce3adf";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // const query = "road-house";
  function handleSearch(movieName) {
    setQuery(movieName);
  }

  // fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=inception`)
  //   .then((res) => res.json())
  //   .then((data) => setMovies(data.Search));

  function handleSelectId(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }
  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?=tt3896198&apikey=${key}&s=${query}`
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setIsLoading(false);
          // console.log(data);
        } catch (err) {
          err.type === "p"
            ? setError("Movie not found")
            : setError("Something went wrong with fetching movies");

          // setError();
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      handleCloseMovie();

      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar
        movies={movies}
        error={error}
        query={query}
        onSearch={handleSearch}
      />
      <Main
        movies={movies}
        isLoading={isLoading}
        error={error}
        handleCloseMovie={handleCloseMovie}
        handleSelectId={handleSelectId}
        selectedId={selectedId}
      ></Main>
    </>
  );
}

function NavBar({ movies, error, query, onSearch }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} onSearch={onSearch} />
      <NumResault movies={movies} error={error} />
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, onSearch }) {
  // const [query, setQuery] = useState("");

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}

function NumResault({ movies, error }) {
  return (
    <p className="num-results">
      Found <strong> {!error && movies.length}</strong> results
    </p>
  );
}

function Main({
  movies,
  isLoading,
  error,
  selectedId,
  handleCloseMovie,
  handleSelectId,
}) {
  // if (selectedMovie) console.log("True");

  return (
    <main className="main">
      <ListBox
        movies={movies}
        isLoading={isLoading}
        error={error}
        onSelect={handleSelectId}
      />
      <WatchedBox
        selectedId={selectedId}
        onClose={handleCloseMovie}
        onSelect={handleSelectId}
      />
    </main>
  );
}

function ListBox({ movies, isLoading, error, onSelect }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isLoading && <Loader />}
      {!isLoading && !error && isOpen1 && (
        <MovieList movies={movies} onSelect={onSelect} />
      )}
      {error && <Error message={error} />}

      {/* {isLoading ? <Loader /> : isOpen1 && <MovieList movies={movies} />} */}
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function Error({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function MovieList({ movies, onSelect }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie onSelect={onSelect} movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelect }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelect(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedBox({ selectedId, onClose }) {
  const [isOpen2, setIsOpen2] = useState(true);
  const [watched, setWatched] = useState([]);

  function handleAddWatched(movie) {
    if (watched.includes(movie)) console.log("This movie already exists");
    setWatched((watched) => [...watched, movie]);
  }

  function handleRemoveWatched(id) {
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbID !== id && movie)
    );
  }

  return (
    <div className="box">
      {selectedId ? (
        <MovieDetails
          selectedId={selectedId}
          onClose={onClose}
          onAddWatched={handleAddWatched}
          watched={watched}
          onRemoveWatched={handleRemoveWatched}
          key={selectedId}
        />
      ) : (
        <>
          <button
            className="btn-toggle"
            onClick={() => setIsOpen2((open) => !open)}
          >
            {isOpen2 ? "–" : "+"}
          </button>

          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} onDelete={handleRemoveWatched} />
        </>
      )}
    </div>
  );
}

function MovieDetails({ selectedId, onClose, onAddWatched, watched }) {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState("");

  const isWatcehd = watched.filter(
    (movie) => movie.imdbID === selectedId
  ).length;

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Runtime: runtime,
    Poster: poster,
    Year: year,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = selectedMovie;

  // Add watched
  function handleAddWatched() {
    const newWatchedMovie = {
      imdbID: selectedId,
      poster,
      title,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: Number(userRating),
    };
    onAddWatched(newWatchedMovie);
    onClose();
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function getMovieDetails() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?=tt3896198&apikey=${key}&i=${selectedId}
        `,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error("⛔ Failed to fetch movie");
          const data = await res.json();
          setSelectedMovie(data);
          setIsLoading(false);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        }
      }
      getMovieDetails();

      return function () {
        controller.abort();
      };
    },
    [selectedId]
  );

  // Changing the page title
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      // Cleanup function
      return function () {
        document.title = "usePopcorn";
        // console.log(`cleanup for ${title} `); //Closure hapenning
      };
    },
    [title]
  );

  useEffect(
    function () {
      function keydownEventHandler(e) {
        if (e.code === "Escape") {
          onClose();
          console.log("Closing");
        }
      }

      document.addEventListener("keydown", keydownEventHandler);
      return function () {
        document.removeEventListener("keydown", keydownEventHandler);
      };
    },
    [onClose]
  );

  return (
    <>
      {isLoading && !error && <Loader />}
      {error && <Error message={error} />}
      {!error && !isLoading && (
        <div className="details">
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <>
                {isWatcehd ? (
                  <p>
                    You rated this movie {watchedUserRating} <span>⭐</span>
                  </p>
                ) : null}
                {!isWatcehd && (
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                )}
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleAddWatched}>
                    + Add to watched
                  </button>
                )}
              </>
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
      )}
    </>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Watched movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function Watched({ movie, onDelete }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
        &times;
      </button>
    </li>
  );
}
