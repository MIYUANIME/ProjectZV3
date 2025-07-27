import { TVShow, Season, Episode } from '../types';
import { proxyFetch } from './proxyServer';

// Base URL for watchanimeworld.in
const BASE_URL = 'https://watchanimeworld.in';

// Cache for storing fetched episodes to avoid repeated requests
const episodeCache = new Map<string, Episode[]>();

export interface EpisodeFetchResult {
  success: boolean;
  episodes?: Episode[];
  error?: string;
}

/**
 * Generate unique video URL for each episode
 */
function generateEpisodeVideoUrl(episodeNumber: number): string {
  // Return null to indicate we need to fetch the real URL
  return '';
}

/**
 * Fetch episodes for a specific anime and season from watchanimeworld.in
 */
export async function fetchEpisodes(animeTitle: string, seasonNumber: number): Promise<EpisodeFetchResult> {
  const cacheKey = `${animeTitle}-season-${seasonNumber}`;
  
  // Check cache first
  if (episodeCache.has(cacheKey)) {
    return {
      success: true,
      episodes: episodeCache.get(cacheKey)!
    };
  }

  try {
    const episodes: Episode[] = [];
    const animeTitleLower = animeTitle.toLowerCase();
    
    // Determine max episodes based on anime and season
    let maxEpisodes = 26; // Default
    
    if (animeTitleLower === 'naruto') {
      switch (seasonNumber) {
        case 1:
          maxEpisodes = 57; // Episodes 1-57
          break;
        case 2:
          maxEpisodes = 43; // Episodes 58-100
          break;
        case 3:
          maxEpisodes = 41; // Episodes 101-141
          break;
        case 4:
          maxEpisodes = 42; // Episodes 142-183
          break;
        case 5:
          maxEpisodes = 37; // Episodes 184-220
          break;
        default:
          maxEpisodes = 26;
      }
    } else if (animeTitleLower === 'naruto-shippuden') {
      switch (seasonNumber) {
        case 1:
          maxEpisodes = 32; // Episodes 1-32
          break;
        case 2:
          maxEpisodes = 21; // Episodes 33-53
          break;
        case 3:
          maxEpisodes = 18; // Episodes 54-71
          break;
        case 4:
          maxEpisodes = 17; // Episodes 72-88
          break;
        case 5:
          maxEpisodes = 24; // Episodes 89-112
          break;
        case 6:
          maxEpisodes = 31; // Episodes 113-143
          break;
        case 7:
          maxEpisodes = 8; // Episodes 144-151
          break;
        case 8:
          maxEpisodes = 24; // Episodes 152-175
          break;
        case 9:
          maxEpisodes = 21; // Episodes 176-196
          break;
        case 10:
          maxEpisodes = 24; // Episodes 197-220
          break;
        default:
          maxEpisodes = 26;
      }
    } else if (animeTitleLower === 'jujutsu-kaisen') {
      switch (seasonNumber) {
        case 1:
          maxEpisodes = 24; // Episodes 1-24
          break;
        case 2:
          maxEpisodes = 23; // Episodes 1-23
          break;
        default:
          maxEpisodes = 26;
      }
    } else if (animeTitleLower === 'doraemon') {
      switch (seasonNumber) {
        case 1:
          maxEpisodes = 52; // Episodes 1-52
          break;
        default:
          maxEpisodes = 26;
      }
    }
    
    console.log(`Creating ${maxEpisodes} episodes for ${animeTitle} Season ${seasonNumber}...`);
    
    // Create episodes with image covers only (no video URLs yet)
    for (let episodeNumber = 1; episodeNumber <= maxEpisodes; episodeNumber++) {
      // Calculate the actual episode number for the season
      let actualEpisodeNumber: number;
      
      if (animeTitleLower === 'naruto') {
        switch (seasonNumber) {
          case 1:
            actualEpisodeNumber = episodeNumber; // 1-57
            break;
          case 2:
            actualEpisodeNumber = episodeNumber + 57; // 58-100
            break;
          case 3:
            actualEpisodeNumber = episodeNumber + 100; // 101-141
            break;
          case 4:
            actualEpisodeNumber = episodeNumber + 141; // 142-183
            break;
          case 5:
            actualEpisodeNumber = episodeNumber + 183; // 184-220
            break;
          default:
            actualEpisodeNumber = episodeNumber;
        }
      } else if (animeTitleLower === 'naruto-shippuden') {
        switch (seasonNumber) {
          case 1:
            actualEpisodeNumber = episodeNumber; // 1-32
            break;
          case 2:
            actualEpisodeNumber = episodeNumber + 32; // 33-53
            break;
          case 3:
            actualEpisodeNumber = episodeNumber + 53; // 54-71
            break;
          case 4:
            actualEpisodeNumber = episodeNumber + 71; // 72-88
            break;
          case 5:
            actualEpisodeNumber = episodeNumber + 88; // 89-112
            break;
          case 6:
            actualEpisodeNumber = episodeNumber + 112; // 113-143
            break;
          case 7:
            actualEpisodeNumber = episodeNumber + 143; // 144-151
            break;
          case 8:
            actualEpisodeNumber = episodeNumber + 151; // 152-175
            break;
          case 9:
            actualEpisodeNumber = episodeNumber + 175; // 176-196
            break;
          case 10:
            actualEpisodeNumber = episodeNumber + 196; // 197-220
            break;
          default:
            actualEpisodeNumber = episodeNumber;
        }
      } else if (animeTitleLower === 'jujutsu-kaisen') {
        switch (seasonNumber) {
          case 1:
            actualEpisodeNumber = episodeNumber; // 1-24
            break;
          case 2:
            actualEpisodeNumber = episodeNumber; // 1-23 (Season 2 starts from 1)
            break;
          default:
            actualEpisodeNumber = episodeNumber;
        }
      } else if (animeTitleLower === 'doraemon') {
        switch (seasonNumber) {
          case 1:
            actualEpisodeNumber = episodeNumber; // 1-52
            break;
          default:
            actualEpisodeNumber = episodeNumber;
        }
      } else {
        actualEpisodeNumber = episodeNumber;
      }
      
      // Generate thumbnail URL based on anime title
      let thumbnailUrl: string;
      if (animeTitleLower === 'naruto') {
        thumbnailUrl = `https://img.watchanimeworld.in/images/1221/${actualEpisodeNumber.toString().padStart(3, '0')}.webp`;
      } else if (animeTitleLower === 'naruto-shippuden') {
        thumbnailUrl = `https://img.watchanimeworld.in/images/12032/${actualEpisodeNumber.toString().padStart(3, '0')}.webp`;
      } else if (animeTitleLower === 'jujutsu-kaisen') {
        // Use different image directories for Jujutsu Kaisen seasons
        if (seasonNumber === 1) {
          // Season 1: image directory 13743
          thumbnailUrl = `https://img.watchanimeworld.in/images/13743/${episodeNumber.toString().padStart(2, '0')}.webp`;
        } else if (seasonNumber === 2) {
          // Season 2: image directory 13804
          thumbnailUrl = `https://img.watchanimeworld.in/images/13804/${episodeNumber.toString().padStart(2, '0')}.webp`;
        } else {
          // Fallback to Season 1
          thumbnailUrl = `https://img.watchanimeworld.in/images/13743/${episodeNumber.toString().padStart(2, '0')}.webp`;
        }
      } else if (animeTitleLower === 'doraemon') {
        // Doraemon uses image directory 2749 with 2-digit format
        thumbnailUrl = `https://img.watchanimeworld.in/images/2749/${episodeNumber.toString().padStart(2, '0')}.webp`;
      } else {
        thumbnailUrl = `https://img.watchanimeworld.in/images/1221/${actualEpisodeNumber.toString().padStart(3, '0')}.webp`;
      }

      // Create user-friendly episode title
      let episodeTitle: string;
      episodeTitle = `Episode ${actualEpisodeNumber}`;

      const episode: Episode = {
        id: `${animeTitleLower}-${seasonNumber}x${episodeNumber}`,
        episodeNumber: actualEpisodeNumber, // Use actual episode number
        title: episodeTitle,
        thumbnail: thumbnailUrl,
        duration: '24 min',
        watchUrl: '', // Empty - will be fetched when user clicks
        airDate: new Date().toISOString()
      };
      
      episodes.push(episode);
    }
    
    console.log(`✅ Successfully created ${episodes.length} episodes with image covers`);
    
    // Clear any existing cache for this anime/season to ensure fresh data
    episodeCache.delete(cacheKey);
    
    // Cache the results
    episodeCache.set(cacheKey, episodes);
    
    return {
      success: true,
      episodes
    };
  } catch (error) {
    console.error('Error creating episodes:', error);
    return {
      success: false,
      error: 'Failed to create episodes'
    };
  }
}

/**
 * Fetch a single episode from watchanimeworld.in
 */
async function fetchSingleEpisode(animeTitle: string, seasonNumber: number, episodeNumber: number): Promise<Episode | null> {
  try {
    const episodeUrl = `${BASE_URL}/episode/${animeTitle}-${seasonNumber}x${episodeNumber}/`;
    
    console.log(`Fetching episode ${episodeNumber} from: ${episodeUrl}`);
    
    // Use proxy to fetch the page with timeout
    const html = await Promise.race([
      proxyFetch(episodeUrl),
      new Promise<string>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 10000) // 10 second timeout
      )
    ]);
    
    // Parse the HTML to extract episode information
    const episode = parseEpisodeFromHTML(html, animeTitle, seasonNumber, episodeNumber);
    
    if (episode) {
      console.log(`✅ Episode ${episodeNumber} parsed successfully with video URL: ${episode.watchUrl}`);
    } else {
      console.warn(`⚠️ Episode ${episodeNumber} parsing failed`);
    }
    
    return episode;
  } catch (error) {
    console.error(`Error fetching episode ${episodeNumber}:`, error);
    return null;
  }
}

/**
 * Parse episode information from HTML
 */
function parseEpisodeFromHTML(html: string, animeTitle: string, seasonNumber: number, episodeNumber: number): Episode | null {
  try {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract episode title (around line 514)
    const titleElement = doc.querySelector('h1, .episode-title, .title');
    let title = titleElement?.textContent?.trim();
    
    // If no title found, create user-friendly episode title
    if (!title) {
      title = `Episode ${episodeNumber}`;
    }
    
    // Extract video URL from the specific div with id="options-0" (around line 516)
    // Look for the <!-- player --> area and options-0 div
    const optionsDiv = doc.querySelector('div#options-0');
    console.log(`Episode ${episodeNumber}: Options div found:`, !!optionsDiv);
    
    if (!optionsDiv) {
      console.warn(`Episode ${episodeNumber}: No options-0 div found`);
      return null;
    }
    
    // Find iframe within options-0 div
    const iframe = optionsDiv.querySelector('iframe[src*="x.pixfusion.in"]');
    console.log(`Episode ${episodeNumber}: Iframe found:`, !!iframe);
    
    if (!iframe) {
      console.warn(`Episode ${episodeNumber}: No iframe found in options-0 div`);
      return null;
    }
    
    // Extract data-src first, then fallback to src
    const videoUrl = iframe.getAttribute('data-src') || iframe.getAttribute('src');
    console.log(`Episode ${episodeNumber}: Video URL extracted:`, videoUrl);
    
    if (!videoUrl) {
      console.warn(`Episode ${episodeNumber}: No video URL found in iframe`);
      return null;
    }
    
    // Generate thumbnail URL based on anime title
    let thumbnail: string;
    const animeTitleLower = animeTitle.toLowerCase();
    if (animeTitleLower === 'naruto') {
      thumbnail = `https://img.watchanimeworld.in/images/1221/${episodeNumber.toString().padStart(3, '0')}.webp`;
    } else if (animeTitleLower === 'naruto-shippuden') {
      thumbnail = `https://img.watchanimeworld.in/images/12032/${episodeNumber.toString().padStart(3, '0')}.webp`;
          } else if (animeTitleLower === 'jujutsu-kaisen') {
        // Use different image directories for Jujutsu Kaisen seasons
        if (seasonNumber === 1) {
          // Season 1: image directory 13743
          thumbnail = `https://img.watchanimeworld.in/images/13743/${episodeNumber.toString().padStart(2, '0')}.webp`;
        } else if (seasonNumber === 2) {
          // Season 2: image directory 13804
          thumbnail = `https://img.watchanimeworld.in/images/13804/${episodeNumber.toString().padStart(2, '0')}.webp`;
        } else {
          // Fallback to Season 1
          thumbnail = `https://img.watchanimeworld.in/images/13743/${episodeNumber.toString().padStart(2, '0')}.webp`;
        }
      } else if (animeTitleLower === 'doraemon') {
        // Doraemon uses image directory 2749 with 2-digit format
        thumbnail = `https://img.watchanimeworld.in/images/2749/${episodeNumber.toString().padStart(2, '0')}.webp`;
      } else {
        thumbnail = `https://img.watchanimeworld.in/images/1221/${episodeNumber.toString().padStart(3, '0')}.webp`;
      }
    
    // Extract duration if available
    const durationElement = doc.querySelector('.duration, .time');
    const duration = durationElement?.textContent?.trim() || '24 min';
    
    return {
      id: `${animeTitle}-${seasonNumber}x${episodeNumber}`,
      episodeNumber,
      title,
      thumbnail,
      duration,
      watchUrl: videoUrl,
      airDate: new Date().toISOString() // Default to current date
    };
  } catch (error) {
    console.error('Error parsing episode HTML:', error);
    return null;
  }
}

/**
 * Get TV show information
 */
export function getTVShowInfo(showId: string): TVShow | null {
  const tvShows: TVShow[] = [
    {
      id: 'naruto',
      title: 'Naruto',
      poster: 'https://m.media-amazon.com/images/M/MV5BZTNjOWI0ZTAtOGY1OS00ZGU0LWEyOWYtMjhkYjdlYmVjMDk2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      genre: 'Action, Adventure, Fantasy',
      rating: '8.4/10',
      year: '2002',
      description: 'Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village.',
      totalSeasons: 5,
      totalEpisodes: 220,
      status: 'completed',
      seasons: [
        { id: 'season-1', seasonNumber: 1, title: 'Season 1', totalEpisodes: 57, episodes: [] },
        { id: 'season-2', seasonNumber: 2, title: 'Season 2', totalEpisodes: 43, episodes: [] },
        { id: 'season-3', seasonNumber: 3, title: 'Season 3', totalEpisodes: 41, episodes: [] },
        { id: 'season-4', seasonNumber: 4, title: 'Season 4', totalEpisodes: 42, episodes: [] },
        { id: 'season-5', seasonNumber: 5, title: 'Season 5', totalEpisodes: 37, episodes: [] }
      ]
    },
    {
      id: 'naruto-shippuden',
      title: 'Naruto Shippuden',
      poster: 'https://image.tmdb.org/t/p/w185/kV27j3Nz4d5z8u6mN3EJw9RiLg2.jpg',
      genre: 'Action, Adventure, Fantasy',
      rating: '8.7/10',
      year: '2007',
      description: 'Naruto Shippuden is the continuation of the original animated TV series Naruto. The story revolves around an older and slightly more matured Uzumaki Naruto and his quest to save his friend Uchiha Sasuke from the grips of darkness.',
      totalSeasons: 10,
      totalEpisodes: 220,
      status: 'completed',
      seasons: [
        { id: 'season-1', seasonNumber: 1, title: 'Season 1', totalEpisodes: 32, episodes: [] },
        { id: 'season-2', seasonNumber: 2, title: 'Season 2', totalEpisodes: 21, episodes: [] },
        { id: 'season-3', seasonNumber: 3, title: 'Season 3', totalEpisodes: 18, episodes: [] },
        { id: 'season-4', seasonNumber: 4, title: 'Season 4', totalEpisodes: 17, episodes: [] },
        { id: 'season-5', seasonNumber: 5, title: 'Season 5', totalEpisodes: 24, episodes: [] },
        { id: 'season-6', seasonNumber: 6, title: 'Season 6', totalEpisodes: 31, episodes: [] },
        { id: 'season-7', seasonNumber: 7, title: 'Season 7', totalEpisodes: 8, episodes: [] },
        { id: 'season-8', seasonNumber: 8, title: 'Season 8', totalEpisodes: 24, episodes: [] },
        { id: 'season-9', seasonNumber: 9, title: 'Season 9', totalEpisodes: 21, episodes: [] },
        { id: 'season-10', seasonNumber: 10, title: 'Season 10', totalEpisodes: 24, episodes: [] }
      ]
    },
          {
        id: 'jujutsu-kaisen',
        title: 'Jujutsu Kaisen',
        poster: 'https://image.tmdb.org/t/p/w185/fHpKWq9ayzSk8nSwqRuaAUemRKh.jpg',
        genre: 'Action, Fantasy, Supernatural',
        rating: '8.6/10',
        year: '2020',
        description: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts and thus exorcise himself.',
        totalSeasons: 2,
        totalEpisodes: 47,
        status: 'ongoing',
        seasons: [
          { id: 'season-1', seasonNumber: 1, title: 'Season 1', totalEpisodes: 24, episodes: [] },
          { id: 'season-2', seasonNumber: 2, title: 'Season 2', totalEpisodes: 23, episodes: [] }
        ]
      },
      {
        id: 'doraemon',
        title: 'Doraemon',
        poster: 'https://image.tmdb.org/t/p/w185/bHMqPDsW7Lb71CVHXq4PuEvQ4NY.jpg',
        genre: 'Adventure, Comedy, Fantasy',
        rating: '8.2/10',
        year: '1979',
        description: 'Doraemon is a robotic cat that comes from the 22nd century to help Nobita Nobi, a young boy who is very lazy and always gets into trouble. Doraemon has a magical pocket that contains various gadgets from the future.',
        totalSeasons: 1,
        totalEpisodes: 52,
        status: 'completed',
        seasons: [
          { id: 'season-1', seasonNumber: 1, title: 'Season 1', totalEpisodes: 52, episodes: [] }
        ]
      }
    ];
    
    return tvShows.find(show => show.id === showId) || null;
}

/**
 * Get all TV shows
 */
export function getAllTVShows(): TVShow[] {
  return [
    {
      id: 'naruto',
      title: 'Naruto',
      poster: 'https://m.media-amazon.com/images/M/MV5BZTNjOWI0ZTAtOGY1OS00ZGU0LWEyOWYtMjhkYjdlYmVjMDk2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      genre: 'Action, Adventure, Fantasy',
      rating: '8.4/10',
      year: '2002',
      description: 'Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village.',
      totalSeasons: 5,
      totalEpisodes: 220,
      status: 'completed',
      seasons: [
        { id: 'season-1', seasonNumber: 1, title: 'Season 1', totalEpisodes: 57, episodes: [] },
        { id: 'season-2', seasonNumber: 2, title: 'Season 2', totalEpisodes: 43, episodes: [] },
        { id: 'season-3', seasonNumber: 3, title: 'Season 3', totalEpisodes: 41, episodes: [] },
        { id: 'season-4', seasonNumber: 4, title: 'Season 4', totalEpisodes: 42, episodes: [] },
        { id: 'season-5', seasonNumber: 5, title: 'Season 5', totalEpisodes: 37, episodes: [] }
      ]
    },
    {
      id: 'naruto-shippuden',
      title: 'Naruto Shippuden',
      poster: 'https://image.tmdb.org/t/p/w185/kV27j3Nz4d5z8u6mN3EJw9RiLg2.jpg',
      genre: 'Action, Adventure, Fantasy',
      rating: '8.7/10',
      year: '2007',
      description: 'Naruto Shippuden is the continuation of the original animated TV series Naruto. The story revolves around an older and slightly more matured Uzumaki Naruto and his quest to save his friend Uchiha Sasuke from the grips of darkness.',
      totalSeasons: 10,
      totalEpisodes: 220,
      status: 'completed',
      seasons: [
        { id: 'season-1', seasonNumber: 1, title: 'Season 1', totalEpisodes: 32, episodes: [] },
        { id: 'season-2', seasonNumber: 2, title: 'Season 2', totalEpisodes: 21, episodes: [] },
        { id: 'season-3', seasonNumber: 3, title: 'Season 3', totalEpisodes: 18, episodes: [] },
        { id: 'season-4', seasonNumber: 4, title: 'Season 4', totalEpisodes: 17, episodes: [] },
        { id: 'season-5', seasonNumber: 5, title: 'Season 5', totalEpisodes: 24, episodes: [] },
        { id: 'season-6', seasonNumber: 6, title: 'Season 6', totalEpisodes: 31, episodes: [] },
        { id: 'season-7', seasonNumber: 7, title: 'Season 7', totalEpisodes: 8, episodes: [] },
        { id: 'season-8', seasonNumber: 8, title: 'Season 8', totalEpisodes: 24, episodes: [] },
        { id: 'season-9', seasonNumber: 9, title: 'Season 9', totalEpisodes: 21, episodes: [] },
        { id: 'season-10', seasonNumber: 10, title: 'Season 10', totalEpisodes: 24, episodes: [] }
      ]
    },
    {
      id: 'jujutsu-kaisen',
      title: 'Jujutsu Kaisen',
      poster: 'https://image.tmdb.org/t/p/w185/fHpKWq9ayzSk8nSwqRuaAUemRKh.jpg',
      genre: 'Action, Fantasy, Supernatural',
      rating: '8.6/10',
      year: '2020',
      description: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts and thus exorcise himself.',
      totalSeasons: 2,
      totalEpisodes: 47,
      status: 'ongoing',
      seasons: [
        { id: 'season-1', seasonNumber: 1, title: 'Season 1', totalEpisodes: 24, episodes: [] },
        { id: 'season-2', seasonNumber: 2, title: 'Season 2', totalEpisodes: 23, episodes: [] }
      ]
    },
    {
      id: 'doraemon',
      title: 'Doraemon',
      poster: 'https://image.tmdb.org/t/p/w185/bHMqPDsW7Lb71CVHXq4PuEvQ4NY.jpg',
      genre: 'Adventure, Comedy, Fantasy',
      rating: '8.2/10',
      year: '1979',
      description: 'Doraemon is a robotic cat that comes from the 22nd century to help Nobita Nobi, a young boy who is very lazy and always gets into trouble. Doraemon has a magical pocket that contains various gadgets from the future.',
      totalSeasons: 1,
      totalEpisodes: 52,
      status: 'completed',
      seasons: [
        { id: 'season-1', seasonNumber: 1, title: 'Season 1', totalEpisodes: 52, episodes: [] }
      ]
    }
  ];
}

/**
 * Clear episode cache
 */
export function clearEpisodeCache(): void {
  episodeCache.clear();
}

/**
 * Get cached episodes
 */
export function getCachedEpisodes(animeTitle: string, seasonNumber: number): Episode[] | null {
  const cacheKey = `${animeTitle}-season-${seasonNumber}`;
  return episodeCache.get(cacheKey) || null;
}

/**
 * Fetch real video URL for a specific episode
 */
export async function fetchVideoUrl(animeTitle: string, seasonNumber: number, episodeNumber: number): Promise<string | null> {
  const maxRetries = 3;
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🎬 Attempt ${attempt}/${maxRetries} - Fetching video URL for Episode ${episodeNumber} (Season ${seasonNumber})`);
      
      // For Naruto, we need to use the actual episode number in the URL, not the season-specific number
      let urlEpisodeNumber = episodeNumber;
      
      if (animeTitle.toLowerCase() === 'naruto') {
        // The URL should use the actual episode number (1-220), not season-specific (1-57, 1-43, etc.)
        urlEpisodeNumber = episodeNumber;
      }
      
      // Try different URL formats for different seasons
      let episodeUrl = '';
      if (animeTitle.toLowerCase() === 'naruto') {
        // For Naruto, try different URL formats based on episode number
        if (episodeNumber <= 57) {
          // Season 1 episodes: naruto-1x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-1x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 100) {
          // Season 2 episodes: naruto-2x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-2x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 141) {
          // Season 3 episodes: naruto-3x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-3x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 183) {
          // Season 4 episodes: naruto-4x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-4x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 220) {
          // Season 5 episodes: naruto-5x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-5x${urlEpisodeNumber}/`;
        } else {
          // Fallback to season 1 format
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-1x${urlEpisodeNumber}/`;
        }
      } else if (animeTitle.toLowerCase() === 'naruto-shippuden') {
        // For Naruto Shippuden, try different URL formats based on episode number
        if (episodeNumber <= 32) {
          // Season 1 episodes: naruto-shippuden-1x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-1x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 53) {
          // Season 2 episodes: naruto-shippuden-2x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-2x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 71) {
          // Season 3 episodes: naruto-shippuden-3x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-3x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 88) {
          // Season 4 episodes: naruto-shippuden-4x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-4x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 112) {
          // Season 5 episodes: naruto-shippuden-5x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-5x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 143) {
          // Season 6 episodes: naruto-shippuden-6x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-6x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 151) {
          // Season 7 episodes: naruto-shippuden-7x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-7x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 175) {
          // Season 8 episodes: naruto-shippuden-8x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-8x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 196) {
          // Season 9 episodes: naruto-shippuden-9x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-9x${urlEpisodeNumber}/`;
        } else if (episodeNumber <= 220) {
          // Season 10 episodes: naruto-shippuden-10x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-10x${urlEpisodeNumber}/`;
        } else {
          // Fallback to season 1 format
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-1x${urlEpisodeNumber}/`;
        }
      } else if (animeTitle.toLowerCase() === 'jujutsu-kaisen') {
        // For Jujutsu Kaisen, use season-specific format
        if (seasonNumber === 1) {
          // Season 1: jujutsu-kaisen-1x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-1x${urlEpisodeNumber}/`;
        } else if (seasonNumber === 2) {
          // Season 2: jujutsu-kaisen-2x{episodeNumber}
          // For Season 2, we need to use the season-specific episode number (1-23), not the actual episode number
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-2x${episodeNumber}/`;
        } else {
          // Fallback to Season 1 format
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-1x${urlEpisodeNumber}/`;
        }
      } else if (animeTitle.toLowerCase() === 'doraemon') {
        // For Doraemon, use season-specific format
        if (seasonNumber === 1) {
          // Season 1: doraemon-1x{episodeNumber}
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-1x${urlEpisodeNumber}/`;
        } else {
          // Fallback to Season 1 format
          episodeUrl = `${BASE_URL}/episode/${animeTitle}-1x${urlEpisodeNumber}/`;
        }
      } else {
        // Default format for other anime
        episodeUrl = `${BASE_URL}/episode/${animeTitle}-${seasonNumber}x${urlEpisodeNumber}/`;
      }
      
      console.log(`🎬 Fetching from: ${episodeUrl}`);
      
      // Use proxy to fetch the page with timeout
      const html = await Promise.race([
        proxyFetch(episodeUrl), // Use the main proxyFetch function which tries Vite proxy first
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 15000) // 15 second timeout
        )
      ]);
      
      // Debug: Check if we got a valid HTML response
      console.log(`📄 HTML response length: ${html.length}`);
      if (html.length < 1000) {
        console.warn(`⚠️ HTML response seems too short, might be an error page`);
        console.log(`📄 HTML content: ${html.substring(0, 500)}`);
      }
      
      // Create a DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Debug: Check if we have a valid document
      const title = doc.querySelector('title');
      console.log(`📄 Page title: ${title?.textContent || 'No title found'}`);
      
      // Extract video URL from the specific div with id="options-0" (around line 516)
      const optionsDiv = doc.querySelector('div#options-0');
      console.log(`Episode ${episodeNumber}: Options div found:`, !!optionsDiv);
      
      if (!optionsDiv) {
        console.warn(`Episode ${episodeNumber}: No options-0 div found`);
        return null;
      }
      
      const iframe = optionsDiv.querySelector('iframe[src*="x.pixfusion.in"]');
      console.log(`Episode ${episodeNumber}: Iframe found:`, !!iframe);
      
      if (!iframe) {
        console.warn(`Episode ${episodeNumber}: No iframe found in options-0 div`);
        return null;
      }
      
      // Extract data-src first, then fallback to src
      const videoUrl = iframe.getAttribute('data-src') || iframe.getAttribute('src');
      console.log(`Episode ${episodeNumber}: Video URL extracted:`, videoUrl);
      
      if (videoUrl) {
        console.log(`✅ Episode ${episodeNumber}: Successfully fetched video URL`);
        return videoUrl;
      } else {
        console.warn(`Episode ${episodeNumber}: No video URL found in iframe`);
        return null;
      }
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ Attempt ${attempt}/${maxRetries} failed for episode ${episodeNumber}:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`❌ All ${maxRetries} attempts failed for episode ${episodeNumber}. Last error:`, lastError);
  return null;
}

/**
 * Update episode with video URL in cache
 */
export function updateEpisodeVideoUrl(animeTitle: string, seasonNumber: number, episodeNumber: number, videoUrl: string): void {
  const cacheKey = `${animeTitle}-season-${seasonNumber}`;
  const episodes = episodeCache.get(cacheKey);
  
  if (episodes) {
    const episode = episodes.find(ep => ep.episodeNumber === episodeNumber);
    if (episode) {
      episode.watchUrl = videoUrl;
      console.log(`✅ Updated Episode ${episodeNumber} with video URL in cache`);
    }
  }
} 