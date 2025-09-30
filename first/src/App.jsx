import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import LoadingSpinner from "./components/LoadingSpinner";
import MovieCard from "./components/MovieCard";
import Footer from "./components/Footer";
import { getSearchTrending, updateSearchId } from "./appWrite";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  // for search
  const [searchTerm, setSearchTerm] = useState("");
  // for displaying error fetching movies on screen
  const [error, setError] = useState(null);
  // for storing movies list
  const [moviesList, setMoviesList] = useState([]);
  // for loading state
  const [isLoading, setIsLoading] = useState(false);
  // useDebounce for reducing API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState();
  // for trending movies
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // fetching Movies
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const endPoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      console.log(data);

      if (data.Response === "False") {
        setError(data.Error || "No movies found.");
        setMoviesList([]);
        return;
      }

      setMoviesList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchId(query, data.results[0]);
      }
    } catch (err) {
      console.log(`Error Fetching Movies: ${err}`);
      setError("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // for trending movies on page load

  const fetchTrendingMovies = async () => {
    try {
      const movies = await getSearchTrending();
      setTrendingMovies(movies);
    } catch (err) {
      console.error(`Error fetching trending movies: ${err}`);
    }
  };
  // for movies API data fetch
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // useEffect for fetching trending movies on page load because
  // not to get by search term
  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <div>
      <div className="pattern">
        
      <div className="wrapper">
        <header>
          <img src="./logo.svg" alt="Movie Trello Logo" className="h-16 w-16" />
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You’ll Love
            Without the Hassle
          </h1>

          {/* search section */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* for trending movies  */}

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.postURL} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}


        {/* ................................... */}

        <section className="all-movies">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default App;
