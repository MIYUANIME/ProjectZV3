import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieCard from '../components/MovieCard';
import { getAllMovies } from '../data/Data';
import { searchMovies, getUniqueGenres, getUniqueYears } from '../utils/searchUtils';
import { SearchFilters } from '../types';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const allMovies = getAllMovies();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>({
    genre: searchParams.get('genre') || undefined,
    year: searchParams.get('year') || undefined,
    rating: searchParams.get('rating') || undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'title'
  });
  const [results, setResults] = useState(allMovies);

  const genres = getUniqueGenres(allMovies);
  const years = getUniqueYears(allMovies);

  useEffect(() => {
    const filteredResults = searchMovies(allMovies, query, filters);
    setResults(filteredResults);
  }, [query, filters, allMovies]);

  useEffect(() => {
    // Update URL params
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.genre) params.set('genre', filters.genre);
    if (filters.year) params.set('year', filters.year);
    if (filters.rating) params.set('rating', filters.rating);
    if (filters.sortBy && filters.sortBy !== 'title') params.set('sortBy', filters.sortBy);
    
    setSearchParams(params);
  }, [query, filters, setSearchParams]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setQuery('');
    setFilters({ sortBy: 'title' });
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
            <SearchIcon className="w-8 h-8 mr-3" />
            Search Movies
          </h1>
          
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar 
              movies={allMovies} 
              onSearch={handleSearch}
              showSuggestions={false}
            />
          </div>

          {/* Filters */}
          <FilterBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            genres={genres}
            years={years}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-300">
              {query ? (
                <span>
                  Found <span className="text-white font-semibold">{results.length}</span> results for "{query}"
                </span>
              ) : (
                <span>
                  Showing <span className="text-white font-semibold">{results.length}</span> movies
                </span>
              )}
            </div>
            
            {(query || filters.genre || filters.year || filters.rating) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((movie) => (
              <div key={movie.id}>
                <MovieCard movie={movie} size="small" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
            <p className="text-gray-400 mb-6">
              {query 
                ? `No movies found matching "${query}"`
                : "No movies match your current filters"
              }
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Search & Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;