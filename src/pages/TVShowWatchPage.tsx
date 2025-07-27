import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTVShowInfo, fetchEpisodes, getCachedEpisodes, fetchVideoUrl, updateEpisodeVideoUrl, getDetectiveConanEpisodes } from '../utils/tvShowUtils';
import { TVShow, Episode } from '../types';
import { 
  Play, 
  ArrowLeft, 
  ArrowRight, 
  List, 
  Info,
  Star,
  Calendar,
  Clock,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { addToWatchHistory } from '../utils/profileUtils';

const TVShowWatchPage: React.FC = () => {
  const { showId, episodeNumber } = useParams<{ showId: string; episodeNumber: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<TVShow | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [showSeasonSelector, setShowSeasonSelector] = useState(false);

  useEffect(() => {
    if (showId && episodeNumber) {
      // Parse episode number and season from URL
      let parsedEpisodeNum: number;
      let parsedSeason: number = 1;
      
      if (episodeNumber.includes('x')) {
        // Format like "2x1", "2x2", etc.
        const [season, episode] = episodeNumber.split('x');
        parsedSeason = parseInt(season);
        parsedEpisodeNum = parseInt(episode);
      } else {
        // Regular format like "1", "2", etc.
        parsedEpisodeNum = parseInt(episodeNumber);
      }
      
      loadEpisodeData(showId, parsedEpisodeNum, parsedSeason);
    }
  }, [showId, episodeNumber]);

  // Close season selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.season-selector')) {
        setShowSeasonSelector(false);
      }
    };

    if (showSeasonSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSeasonSelector]);

  // Add to watch history when episode loads
  useEffect(() => {
    if (currentEpisode && show) {
      addToWatchHistory(show.id, `${show.title} - Episode ${currentEpisode.episodeNumber}`, show.poster);
    }
  }, [currentEpisode, show]);

  const loadEpisodeData = async (showId: string, episodeNum: number, seasonNum?: number) => {
    try {
      setLoading(true);
      setError(null);

      // Get show info
      const showInfo = getTVShowInfo(showId);
      if (!showInfo) {
        setError('Show not found');
        return;
      }
      setShow(showInfo);

      // --- Custom logic for Detective Conan only ---
      if (showId === 'detective-conan') {
        const episodes = getDetectiveConanEpisodes();
        setEpisodes(episodes);
        const episode = episodes.find(ep => ep.episodeNumber === episodeNum);
        if (episode) {
          setCurrentEpisode(episode);
        } else {
          setError('Episode not found');
        }
        setLoading(false);
        return;
      }

      // Determine which season this episode belongs to
      let targetSeason = seasonNum || 1;
      
      // For Naruto and Naruto Shippuden, determine season based on episode number
      if (showInfo.id === 'naruto') {
        if (episodeNum >= 1 && episodeNum <= 57) {
          targetSeason = 1;
        } else if (episodeNum >= 58 && episodeNum <= 100) {
          targetSeason = 2;
        } else if (episodeNum >= 101 && episodeNum <= 141) {
          targetSeason = 3;
        } else if (episodeNum >= 142 && episodeNum <= 183) {
          targetSeason = 4;
        } else if (episodeNum >= 184 && episodeNum <= 220) {
          targetSeason = 5;
        }
      } else if (showInfo.id === 'naruto-shippuden') {
        if (episodeNum >= 1 && episodeNum <= 32) {
          targetSeason = 1;
        } else if (episodeNum >= 33 && episodeNum <= 53) {
          targetSeason = 2;
        } else if (episodeNum >= 54 && episodeNum <= 71) {
          targetSeason = 3;
        } else if (episodeNum >= 72 && episodeNum <= 88) {
          targetSeason = 4;
        } else if (episodeNum >= 89 && episodeNum <= 112) {
          targetSeason = 5;
        } else if (episodeNum >= 113 && episodeNum <= 143) {
          targetSeason = 6;
        } else if (episodeNum >= 144 && episodeNum <= 151) {
          targetSeason = 7;
        } else if (episodeNum >= 152 && episodeNum <= 175) {
          targetSeason = 8;
        } else if (episodeNum >= 176 && episodeNum <= 196) {
          targetSeason = 9;
        } else if (episodeNum >= 197 && episodeNum <= 220) {
          targetSeason = 10;
        }
      }
      // For Jujutsu Kaisen, use the season from URL parsing

      // Update current season if needed
      if (targetSeason !== currentSeason) {
        setCurrentSeason(targetSeason);
      }

      // Check cache first for the target season
      let cachedEpisodes = getCachedEpisodes(showId, targetSeason);
      if (!cachedEpisodes) {
        // Fetch episodes for the target season
        const result = await fetchEpisodes(showId, targetSeason);
        if (result.success && result.episodes) {
          cachedEpisodes = result.episodes;
          setEpisodes(result.episodes);
        } else {
          setError(result.error || 'Failed to load episodes');
          return;
        }
      } else {
        setEpisodes(cachedEpisodes);
      }

      // Find current episode
      const episode = cachedEpisodes.find(ep => ep.episodeNumber === episodeNum);
      if (episode) {
        setCurrentEpisode(episode);
      } else {
        setError('Episode not found');
      }
    } catch (err) {
      setError('An error occurred while loading the episode');
      console.error('Error loading episode:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToEpisode = async (episodeNum: number) => {
    if (showId) {
      // Check if episode already has video URL
      const episode = episodes.find(ep => ep.episodeNumber === episodeNum);
      
      if (episode && !episode.watchUrl) {
        // Fetch video URL for this episode
        setLoadingVideo(true);
        try {
          console.log(`🎬 Loading video for Episode ${episodeNum} (Season ${currentSeason})...`);
          const videoUrl = await fetchVideoUrl(showId, currentSeason, episodeNum);
          
          if (videoUrl) {
            // Update episode in cache with video URL
            updateEpisodeVideoUrl(showId, currentSeason, episodeNum, videoUrl);
            
            // Update local state
            setEpisodes(prevEpisodes => 
              prevEpisodes.map(ep => 
                ep.episodeNumber === episodeNum 
                  ? { ...ep, watchUrl: videoUrl }
                  : ep
              )
            );
            
            // Update current episode if it's the one being loaded
            if (currentEpisode && currentEpisode.episodeNumber === episodeNum) {
              setCurrentEpisode(prev => prev ? { ...prev, watchUrl: videoUrl } : null);
            }
            
            console.log(`✅ Video URL loaded for Episode ${episodeNum}`);
          } else {
            console.warn(`⚠️ Failed to load video URL for Episode ${episodeNum}`);
          }
        } catch (error) {
          console.error(`❌ Error loading video for Episode ${episodeNum}:`, error);
        } finally {
          setLoadingVideo(false);
        }
      }
      
      // Navigate to episode with proper format for Jujutsu Kaisen Season 2
      // Check if we're currently in Season 2 by looking at the current URL and season state
      const isCurrentlyInSeason2 = episodeNumber && episodeNumber.includes('x') && episodeNumber.startsWith('2x');
      
      // For Jujutsu Kaisen, determine the correct format based on current season and URL
      if (show?.id === 'jujutsu-kaisen') {
        // Check if we should use Season 2 format
        // Also check if the episodes we're viewing are from Season 2 (they should have 23 episodes)
        const isViewingSeason2Episodes = episodes.length === 23;
        const shouldUseSeason2Format = currentSeason === 2 || isCurrentlyInSeason2 || isViewingSeason2Episodes;
        
        if (shouldUseSeason2Format) {
          // For Jujutsu Kaisen Season 2, use 2x format
          navigate(`/tvshow/${showId}/episode/2x${episodeNum}`);
        } else {
          // For Jujutsu Kaisen Season 1, use regular format
          navigate(`/tvshow/${showId}/episode/${episodeNum}`);
        }
      } else {
        // For other shows, use regular format
        navigate(`/tvshow/${showId}/episode/${episodeNum}`);
      }
    }
  };

  const getNextEpisode = () => {
    if (!currentEpisode || !episodes.length) return null;
    const currentIndex = episodes.findIndex(ep => ep.episodeNumber === currentEpisode.episodeNumber);
    return episodes[currentIndex + 1] || null;
  };

  const getPreviousEpisode = () => {
    if (!currentEpisode || !episodes.length) return null;
    const currentIndex = episodes.findIndex(ep => ep.episodeNumber === currentEpisode.episodeNumber);
    return episodes[currentIndex - 1] || null;
  };

  const getNextSeason = () => {
    if (!show || currentSeason >= show.totalSeasons) return null;
    return show.seasons.find(season => season.seasonNumber === currentSeason + 1) || null;
  };

  const getPreviousSeason = () => {
    if (!show || currentSeason <= 1) return null;
    return show.seasons.find(season => season.seasonNumber === currentSeason - 1) || null;
  };

  const navigateToSeason = async (seasonNumber: number) => {
    if (showId) {
      setCurrentSeason(seasonNumber);
      setShowSeasonSelector(false);
      
      // Load episodes for the new season
      const result = await fetchEpisodes(showId, seasonNumber);
      if (result.success && result.episodes) {
        setEpisodes(result.episodes);
        
        // Navigate to first episode of the season
        const firstEpisode = result.episodes[0];
        if (firstEpisode) {
          // For Jujutsu Kaisen, use the 2x format for Season 2
          if (show?.id === 'jujutsu-kaisen') {
            if (seasonNumber === 1) {
              // Season 1: use regular episode number
              navigate(`/tvshow/${showId}/episode/${firstEpisode.episodeNumber}`);
            } else if (seasonNumber === 2) {
              // Season 2: use 2x format
              navigate(`/tvshow/${showId}/episode/2x${firstEpisode.episodeNumber}`);
            } else {
              // Fallback to regular format
              navigate(`/tvshow/${showId}/episode/${firstEpisode.episodeNumber}`);
            }
          } else {
            // For other shows, use the actual episode number
            navigate(`/tvshow/${showId}/episode/${firstEpisode.episodeNumber}`);
          }
        }
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Episode Not Found</h1>
          <button
            onClick={() => navigate('/tvshows')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go to TV Shows
          </button>
        </div>
      </div>
    );
  }

  if (loading || !currentEpisode || !show) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const nextEpisode = getNextEpisode();
  const previousEpisode = getPreviousEpisode();
  const nextSeason = getNextSeason();
  const previousSeason = getPreviousSeason();

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-gray-800/50 backdrop-blur-sm rounded-lg text-white hover:bg-gray-700/50 transition-colors duration-200 border border-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{show.title}</h1>
              <p className="text-gray-400">Episode {currentEpisode.episodeNumber} • {currentEpisode.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Season Selector */}
            <div className="relative season-selector">
              <button
                onClick={() => setShowSeasonSelector(!showSeasonSelector)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/50 transition-colors duration-200 border border-white/10"
              >
                <span>Season {currentSeason}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showSeasonSelector && (
                <div className="absolute top-full left-0 mt-2 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-white/10 z-50 min-w-48">
                  {show.seasons.map((season) => (
                    <button
                      key={season.id}
                      onClick={() => navigateToSeason(season.seasonNumber)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-colors ${
                        season.seasonNumber === currentSeason
                          ? 'bg-blue-600/80 text-white'
                          : 'text-gray-300'
                      } ${season.seasonNumber === 1 ? 'rounded-t-lg' : ''} ${
                        season.seasonNumber === show.totalSeasons ? 'rounded-b-lg' : ''
                      }`}
                    >
                      <div className="font-semibold">{season.title}</div>
                      <div className="text-sm opacity-75">{season.totalEpisodes} Episodes</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowEpisodeList(!showEpisodeList)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/50 transition-colors duration-200 border border-white/10"
            >
              <List className="w-4 h-4" />
              <span>Episodes</span>
            </button>
            
            <button
              onClick={() => navigate(`/tvshow/${showId}`)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700/80 transition-colors duration-200 border border-blue-500/20"
            >
              <Info className="w-4 h-4" />
              <span>Show Info</span>
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <div className="aspect-video">
              {loadingVideo ? (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-lg mb-2">Loading video...</p>
                    <p className="text-sm text-gray-400">Episode {currentEpisode.episodeNumber}</p>
                  </div>
                </div>
              ) : currentEpisode.watchUrl ? (
                // --- Custom embed for Detective Conan only ---
                showId === 'detective-conan' ? (
                  <iframe
                    src={currentEpisode.watchUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; encrypted-media; fullscreen"
                    title={`${currentEpisode.title} - ${show.title}`}
                  ></iframe>
                ) : (
                  <iframe
                    src={currentEpisode.watchUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; encrypted-media; fullscreen"
                    title={`${currentEpisode.title} - ${show.title}`}
                  ></iframe>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <p className="text-lg mb-2">Click episode to load video</p>
                    <p className="text-sm text-gray-400">Episode {currentEpisode.episodeNumber}</p>
                    {/* For Detective Conan, no load button needed, just show error */}
                    {showId !== 'detective-conan' && (
                      <button
                        onClick={async () => {
                          if (showId && currentEpisode) {
                            setLoadingVideo(true);
                            try {
                              const videoUrl = await fetchVideoUrl(showId, currentSeason, currentEpisode.episodeNumber);
                              if (videoUrl) {
                                updateEpisodeVideoUrl(showId, currentSeason, currentEpisode.episodeNumber, videoUrl);
                                setEpisodes(prevEpisodes =>
                                  prevEpisodes.map(ep =>
                                    ep.episodeNumber === currentEpisode.episodeNumber
                                      ? { ...ep, watchUrl: videoUrl }
                                      : ep
                                  )
                                );
                                setCurrentEpisode(prev => prev ? { ...prev, watchUrl: videoUrl } : null);
                              }
                            } catch (error) {
                              console.error(`❌ Error loading video for Episode ${currentEpisode.episodeNumber}:`, error);
                            } finally {
                              setLoadingVideo(false);
                            }
                          }
                        }}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Load Video
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Show Info Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={show.poster}
              alt={show.title}
              className="w-32 h-48 object-cover rounded-lg mx-auto md:mx-0"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">{show.title}</h2>
              <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-300">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{show.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{show.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{show.totalEpisodes} Episodes</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  show.status === 'completed' 
                    ? 'bg-green-600/80 text-white' 
                    : 'bg-yellow-600/80 text-black'
                }`}>
                  {show.status === 'completed' ? 'Completed' : 'Ongoing'}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{show.genre}</p>
              <p className="text-gray-300 leading-relaxed mb-4">{show.description}</p>
              
              {/* Episode Navigation */}
              <div className="flex items-center gap-4 flex-wrap">
                {previousEpisode ? (
                  <button
                    onClick={() => navigateToEpisode(previousEpisode.episodeNumber)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 backdrop-blur-sm rounded-lg hover:bg-gray-600/50 transition-colors border border-white/10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Episode {previousEpisode.episodeNumber}
                  </button>
                ) : previousSeason ? (
                  <button
                    onClick={() => navigateToSeason(previousSeason.seasonNumber)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 backdrop-blur-sm rounded-lg hover:bg-gray-600/50 transition-colors border border-white/10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {previousSeason.title} (Last Episode)
                  </button>
                ) : null}
                
                {nextEpisode ? (
                  <button
                    onClick={() => navigateToEpisode(nextEpisode.episodeNumber)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 backdrop-blur-sm rounded-lg hover:bg-blue-700/80 transition-colors border border-blue-500/20"
                  >
                    Episode {nextEpisode.episodeNumber}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : nextSeason ? (
                  <button
                    onClick={() => navigateToSeason(nextSeason.seasonNumber)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 backdrop-blur-sm rounded-lg hover:bg-blue-700/80 transition-colors border border-blue-500/20"
                  >
                    {nextSeason.title} (First Episode)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Episode Selection */}
        {showEpisodeList && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">All Episodes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => navigateToEpisode(episode.episodeNumber)}
                  className={`p-3 rounded-lg transition-all duration-200 border ${
                    episode.episodeNumber === currentEpisode.episodeNumber
                      ? 'bg-blue-600/80 text-white border-blue-500/50'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border-white/10'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold mb-1">{episode.episodeNumber}</div>
                    <div className="text-xs opacity-75">{episode.duration}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notice for Better Experience */}
        <div className="bg-blue-900/50 backdrop-blur-sm text-blue-200 rounded-lg p-4 mb-6 text-sm border border-blue-500/20">
          <strong>💡 For the Best Experience:</strong><br />
          We recommend using an <span className="font-semibold">ad blocker</span> or the <span className="font-semibold">Brave browser</span> for an ad-free streaming experience.<br />
          This will help you avoid unwanted redirects and enjoy smoother playback.
        </div>
      </div>
    </div>
  );
};

export default TVShowWatchPage; 