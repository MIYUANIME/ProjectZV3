import { Movie, SearchFilters } from '../types';

export const searchMovies = (movies: Movie[], query: string, filters?: SearchFilters): Movie[] => {
  let filteredMovies = movies;

  // Text search
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredMovies = filteredMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.genre.toLowerCase().includes(searchTerm) ||
      movie.director?.toLowerCase().includes(searchTerm) ||
      movie.cast?.some(actor => actor.toLowerCase().includes(searchTerm))
    );
  }

  // Apply filters
  if (filters) {
    if (filters.genre && filters.genre !== 'all') {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genre.toLowerCase().includes(filters.genre!.toLowerCase())
      );
    }

    if (filters.year && filters.year !== 'all') {
      filteredMovies = filteredMovies.filter(movie =>
        movie.year === filters.year
      );
    }

    if (filters.rating && filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      filteredMovies = filteredMovies.filter(movie => {
        const rating = parseFloat(movie.rating.split('/')[0]);
        return rating >= minRating;
      });
    }
  }

  // Sort results
  if (filters?.sortBy) {
    filteredMovies.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return (b.year || '0').localeCompare(a.year || '0');
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating);
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });
  }

  return filteredMovies;
};

export const getUniqueGenres = (movies: Movie[]): string[] => {
  const genres = new Set<string>();
  movies.forEach(movie => {
    movie.genre.split(',').forEach(genre => {
      genres.add(genre.trim());
    });
  });
  return Array.from(genres).sort();
};

export const getUniqueYears = (movies: Movie[]): string[] => {
  const years = new Set<string>();
  movies.forEach(movie => {
    if (movie.year) {
      years.add(movie.year);
    }
  });
  return Array.from(years).sort().reverse();
};