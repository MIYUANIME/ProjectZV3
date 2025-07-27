import React from 'react';
import SpotlightCarousel from '../components/SpotlightCarousel';
import MovieSection from '../components/MovieSection';
import { spotlightMovies } from '../data/spotlightMovies';
import { getDoraemonMovies, getShinchanMovies, getAllMovies } from '../data/Data';

const HomePage: React.FC = () => {
  const allMovies = getAllMovies();
  const doraemonMovies = getDoraemonMovies();
  const shinchanMovies = getShinchanMovies();
  const newReleases = allMovies
    .filter(movie => movie.isNew)
    .slice(0, 8);
  const popularMovies = allMovies
    .filter(movie => parseFloat(movie.rating) > 8)
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));


  return (
    <div className="min-h-screen bg-black">
      {/* Spotlight Section */}
      <SpotlightCarousel movies={spotlightMovies} />
      
      {/* Movie Sections */}
      <div className="relative z-10 pt-2">
        <MovieSection title="New Releases" movies={newReleases} size="medium" />
        <MovieSection title="Popular Movies" movies={popularMovies} size="medium" />
        <MovieSection title="Doraemon Collection" movies={doraemonMovies} size="medium" />
        <MovieSection title="Shin-chan Collection" movies={shinchanMovies} size="medium" />
      </div>
    </div>
  );
};

export default HomePage;