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
      },
      {
        id: 'detective-conan',
        title: 'Detective Conan',
        poster: 'https://media.themoviedb.org/t/p/w440_and_h660_face/hSKD1ysKYJ36t6iUSf8dN3C76Se.jpg',
        genre: 'Mystery, Detective, Adventure',
        rating: '8.5/10',
        year: '1996',
        description: 'Shinichi Kudo, a high school detective, is transformed into a child while investigating a mysterious organization and solves a multitude of cases while impersonating his childhood friend.',
        totalSeasons: 1,
        totalEpisodes: 0, // Do not reference DETECTIVE_CONAN_EPISODES
        status: 'ongoing',
        seasons: [
          {
            id: 'season-1',
            seasonNumber: 1,
            title: 'Season 1',
            totalEpisodes: 0, // Do not reference DETECTIVE_CONAN_EPISODES
            episodes: [], // Do not reference DETECTIVE_CONAN_EPISODES
          }
        ]
      },
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
    },
    {
      id: 'detective-conan',
      title: 'Detective Conan',
      poster: 'https://media.themoviedb.org/t/p/w440_and_h660_face/hSKD1ysKYJ36t6iUSf8dN3C76Se.jpg',
      genre: 'Mystery, Detective, Adventure',
      rating: '8.5/10',
      year: '1996',
      description: 'Shinichi Kudo, a high school detective, is transformed into a child while investigating a mysterious organization and solves a multitude of cases while impersonating his childhood friend.',
      totalSeasons: 1,
      totalEpisodes: 0, // Do not reference DETECTIVE_CONAN_EPISODES
      status: 'ongoing',
      seasons: [
        {
          id: 'season-1',
          seasonNumber: 1,
          title: 'Season 1',
          totalEpisodes: 0, // Do not reference DETECTIVE_CONAN_EPISODES
          episodes: [], // Do not reference DETECTIVE_CONAN_EPISODES
        }
      ]
    },
  ];
}

/**
 * Helper to parse Detective Conan episodes from a text block
 */
export function parseDetectiveConanEpisodes(episodeText: string): Episode[] {
  const lines = episodeText.split('\n').filter(line => line.trim().startsWith('Episode'));
  const poster = 'https://media.themoviedb.org/t/p/w440_and_h660_face/hSKD1ysKYJ36t6iUSf8dN3C76Se.jpg';
  return lines.map((line, idx) => {
    const match = line.match(/Episode (\d+): (.+)/);
    if (!match) return null;
    const episodeNumber = parseInt(match[1], 10);
    const url = match[2].trim();
    return {
      id: `detective-conan-ep${episodeNumber}`,
      episodeNumber,
      title: `Episode ${episodeNumber}`,
      thumbnail: poster,
      watchUrl: url,
    };
  }).filter(Boolean) as Episode[];
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

// --- Detective Conan Manual Episode Data ---
const DETECTIVE_CONAN_POSTER = 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2020/09/detective-conan-2083769.jpg?tf=3840x';
const DETECTIVE_CONAN_EPISODES = [
  { id: 'detective-conan-ep1', episodeNumber: 1, title: 'Episode 1', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/dXFgWzAVw' },
  { id: 'detective-conan-ep2', episodeNumber: 2, title: 'Episode 2', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/Ww305cDV_' },
  { id: 'detective-conan-ep3', episodeNumber: 3, title: 'Episode 3', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/afs-n50pI' },
  { id: 'detective-conan-ep4', episodeNumber: 4, title: 'Episode 4', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/ZLsqkFLzv' },
  { id: 'detective-conan-ep5', episodeNumber: 5, title: 'Episode 5', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/p6x5jsgqN' },
  { id: 'detective-conan-ep6', episodeNumber: 6, title: 'Episode 6', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/5ck1YyMHp' },
  { id: 'detective-conan-ep7', episodeNumber: 7, title: 'Episode 7', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/_8bEoEuRf' },
  { id: 'detective-conan-ep8', episodeNumber: 8, title: 'Episode 8', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/tAKpX9Du2' },
  { id: 'detective-conan-ep9', episodeNumber: 9, title: 'Episode 9', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/ti32o0JN9' },
  { id: 'detective-conan-ep10', episodeNumber: 10, title: 'Episode 10', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/Izv4MZjzP' },
  { id: 'detective-conan-ep11', episodeNumber: 11, title: 'Episode 11', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/a1fH09XzG' },
  { id: 'detective-conan-ep12', episodeNumber: 12, title: 'Episode 12', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/IUs8mK96o' },
  { id: 'detective-conan-ep13', episodeNumber: 13, title: 'Episode 13', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/34qMcvPao' },
  { id: 'detective-conan-ep14', episodeNumber: 14, title: 'Episode 14', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/uDJCd_8yA' },
  { id: 'detective-conan-ep15', episodeNumber: 15, title: 'Episode 15', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/jlmFJT-Ux' },
  { id: 'detective-conan-ep16', episodeNumber: 16, title: 'Episode 16', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/6o8VryzOB' },
  { id: 'detective-conan-ep17', episodeNumber: 17, title: 'Episode 17', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/kzhY2-IFXP' },
  { id: 'detective-conan-ep18', episodeNumber: 18, title: 'Episode 18', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/zfVqk8PPB' },
  { id: 'detective-conan-ep19', episodeNumber: 19, title: 'Episode 19', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/Jp9n2Vbrz' },
  { id: 'detective-conan-ep20', episodeNumber: 20, title: 'Episode 20', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/l1Lqkx_eJ' },
  { id: 'detective-conan-ep21', episodeNumber: 21, title: 'Episode 21', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/ovbyz0h9s' },
  { id: 'detective-conan-ep22', episodeNumber: 22, title: 'Episode 22', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/I-YL4qOX_' },
  { id: 'detective-conan-ep23', episodeNumber: 23, title: 'Episode 23', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/EAu3XQggY' },
  { id: 'detective-conan-ep24', episodeNumber: 24, title: 'Episode 24', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/67fBC-Ulk' },
  { id: 'detective-conan-ep25', episodeNumber: 25, title: 'Episode 25', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/GRHOVYtr1' },
  { id: 'detective-conan-ep26', episodeNumber: 26, title: 'Episode 26', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/J2FGY9Mk0' },
  { id: 'detective-conan-ep27', episodeNumber: 27, title: 'Episode 27', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/LIaMcChMK' },
  { id: 'detective-conan-ep28', episodeNumber: 28, title: 'Episode 28', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/IgVZl-1ut' },
  { id: 'detective-conan-ep29', episodeNumber: 29, title: 'Episode 29', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/PtYhuiU8w' },
  { id: 'detective-conan-ep30', episodeNumber: 30, title: 'Episode 30', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/7YE6FnTLq' },
  { id: 'detective-conan-ep31', episodeNumber: 31, title: 'Episode 31', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/5lb_pFFIM' },
  { id: 'detective-conan-ep32', episodeNumber: 32, title: 'Episode 32', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/laeLIhgbC' },
  { id: 'detective-conan-ep33', episodeNumber: 33, title: 'Episode 33', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/AnRt8gtqU' },
  { id: 'detective-conan-ep34', episodeNumber: 34, title: 'Episode 34', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/uqZm41WKg' },
  { id: 'detective-conan-ep35', episodeNumber: 35, title: 'Episode 35', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/2V6VSRcmD' },
  { id: 'detective-conan-ep36', episodeNumber: 36, title: 'Episode 36', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/0ZBstZa7C' },
  { id: 'detective-conan-ep37', episodeNumber: 37, title: 'Episode 37', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/FKYCd86Uvt' },
  { id: 'detective-conan-ep38', episodeNumber: 38, title: 'Episode 38', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/1JY6kuCl8' },
  { id: 'detective-conan-ep39', episodeNumber: 39, title: 'Episode 39', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/xZUVa3_IL' },
  { id: 'detective-conan-ep40', episodeNumber: 40, title: 'Episode 40', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/S9DkUEv2_' },
  { id: 'detective-conan-ep41', episodeNumber: 41, title: 'Episode 41', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/xpA85h0Wm' },
  { id: 'detective-conan-ep42', episodeNumber: 42, title: 'Episode 42', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/Zu9kJh9r5' },
  { id: 'detective-conan-ep43', episodeNumber: 43, title: 'Episode 43', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/dil1F83mj' },
  { id: 'detective-conan-ep44', episodeNumber: 44, title: 'Episode 44', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/49iPLWolC' },
  { id: 'detective-conan-ep45', episodeNumber: 45, title: 'Episode 45', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/tSjYy0bfeC' },
  { id: 'detective-conan-ep46', episodeNumber: 46, title: 'Episode 46', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/tyN1dqqM_' },
  { id: 'detective-conan-ep47', episodeNumber: 47, title: 'Episode 47', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/BzpfThfy0' },
  { id: 'detective-conan-ep48', episodeNumber: 48, title: 'Episode 48', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/gpuQGOtsO' },
  { id: 'detective-conan-ep49', episodeNumber: 49, title: 'Episode 49', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/g-jYSv6GI' },
  { id: 'detective-conan-ep50', episodeNumber: 50, title: 'Episode 50', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/LVlEA5AJ8' },
  { id: 'detective-conan-ep51', episodeNumber: 51, title: 'Episode 51', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/oSb1dO7KR' },
  { id: 'detective-conan-ep52', episodeNumber: 52, title: 'Episode 52', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/DA6mtb9DR' },
  { id: 'detective-conan-ep53', episodeNumber: 53, title: 'Episode 53', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/aMAY4CDQ2' },
  { id: 'detective-conan-ep54', episodeNumber: 54, title: 'Episode 54', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/guqKlqYwAg' },
  { id: 'detective-conan-ep55', episodeNumber: 55, title: 'Episode 55', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/B-v5TW9NL' },
  { id: 'detective-conan-ep56', episodeNumber: 56, title: 'Episode 56', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/Kkp8tXKRa' },
  { id: 'detective-conan-ep57', episodeNumber: 57, title: 'Episode 57', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/VTYGDwgAz' },
  { id: 'detective-conan-ep58', episodeNumber: 58, title: 'Episode 58', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/QW1gqc0M4' },
  { id: 'detective-conan-ep59', episodeNumber: 59, title: 'Episode 59', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/5zB9VhPiT' },
  { id: 'detective-conan-ep60', episodeNumber: 60, title: 'Episode 60', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/OugXIPbX4' },
  { id: 'detective-conan-ep61', episodeNumber: 61, title: 'Episode 61', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/PUvNG3O_r' },
  { id: 'detective-conan-ep62', episodeNumber: 62, title: 'Episode 62', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/zmv_OlpOK' },
  { id: 'detective-conan-ep63', episodeNumber: 63, title: 'Episode 63', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/aOf45XZxI' },
  { id: 'detective-conan-ep64', episodeNumber: 64, title: 'Episode 64', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/Lufhk_uay' },
  { id: 'detective-conan-ep65', episodeNumber: 65, title: 'Episode 65', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/-rSzHnI8-' },
  { id: 'detective-conan-ep66', episodeNumber: 66, title: 'Episode 66', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/OprkkdIbM' },
  { id: 'detective-conan-ep67', episodeNumber: 67, title: 'Episode 67', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/EVKMlO_TB' },
  { id: 'detective-conan-ep68', episodeNumber: 68, title: 'Episode 68', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/wJR4coh7F' },
  { id: 'detective-conan-ep69', episodeNumber: 69, title: 'Episode 69', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/j5952DEhp' },
  { id: 'detective-conan-ep70', episodeNumber: 70, title: 'Episode 70', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/8jsazrsSf' },
  { id: 'detective-conan-ep71', episodeNumber: 71, title: 'Episode 71', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/XsxbKiJPd' },
  { id: 'detective-conan-ep72', episodeNumber: 72, title: 'Episode 72', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/ugQCZyKCD' },
  { id: 'detective-conan-ep73', episodeNumber: 73, title: 'Episode 73', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/ro6ZWsvEZ' },
  { id: 'detective-conan-ep74', episodeNumber: 74, title: 'Episode 74', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/Wa_7IiNyG' },
  { id: 'detective-conan-ep75', episodeNumber: 75, title: 'Episode 75', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/Om2atzC3O' },
  { id: 'detective-conan-ep76', episodeNumber: 76, title: 'Episode 76', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/5FR412ViD' },
  { id: 'detective-conan-ep77', episodeNumber: 77, title: 'Episode 77', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/of4BlIqRG' },
  { id: 'detective-conan-ep78', episodeNumber: 78, title: 'Episode 78', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/WVNTcY6nc' },
  { id: 'detective-conan-ep79', episodeNumber: 79, title: 'Episode 79', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/oVyUlR-Sh' },
  { id: 'detective-conan-ep80', episodeNumber: 80, title: 'Episode 80', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/Ai2PeCF9z' },
  { id: 'detective-conan-ep81', episodeNumber: 81, title: 'Episode 81', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/thx27RXRg' },
  { id: 'detective-conan-ep82', episodeNumber: 82, title: 'Episode 82', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/YteIMTqnD' },
  { id: 'detective-conan-ep83', episodeNumber: 83, title: 'Episode 83', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/gj0ycdsaw' },
  { id: 'detective-conan-ep84', episodeNumber: 84, title: 'Episode 84', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/s7mFSDccJT' },
  { id: 'detective-conan-ep85', episodeNumber: 85, title: 'Episode 85', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/oRppEaDeB' },
  { id: 'detective-conan-ep86', episodeNumber: 86, title: 'Episode 86', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/bJI2stWas' },
  { id: 'detective-conan-ep87', episodeNumber: 87, title: 'Episode 87', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/tqo8XCx--' },
  { id: 'detective-conan-ep88', episodeNumber: 88, title: 'Episode 88', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/F_Q74kh05' },
  { id: 'detective-conan-ep89', episodeNumber: 89, title: 'Episode 89', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/oldZuUaOm' },
  { id: 'detective-conan-ep90', episodeNumber: 90, title: 'Episode 90', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/0EYmE5XAK' },
  { id: 'detective-conan-ep91', episodeNumber: 91, title: 'Episode 91', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/B9663Wvdb' },
  { id: 'detective-conan-ep92', episodeNumber: 92, title: 'Episode 92', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/1zr6jhBQa' },
  { id: 'detective-conan-ep93', episodeNumber: 93, title: 'Episode 93', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/sfnboCLfH' },
  { id: 'detective-conan-ep94', episodeNumber: 94, title: 'Episode 94', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/HzxdYv9IX' },
  { id: 'detective-conan-ep95', episodeNumber: 95, title: 'Episode 95', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/uvqwsmiXL' },
  { id: 'detective-conan-ep96', episodeNumber: 96, title: 'Episode 96', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/-Xje09x8m' },
  { id: 'detective-conan-ep97', episodeNumber: 97, title: 'Episode 97', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/xVlPaEAQ2' },
  { id: 'detective-conan-ep98', episodeNumber: 98, title: 'Episode 98', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/uSqrGj2yc' },
  { id: 'detective-conan-ep99', episodeNumber: 99, title: 'Episode 99', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/iJQbx4CYaa' },
  { id: 'detective-conan-ep100', episodeNumber: 100, title: 'Episode 100', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/92x1yGUVN' },
  { id: 'detective-conan-ep101', episodeNumber: 101, title: 'Episode 101', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/1u2SNxFVn' },
  { id: 'detective-conan-ep102', episodeNumber: 102, title: 'Episode 102', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/P-cTKMT29' },
  { id: 'detective-conan-ep103', episodeNumber: 103, title: 'Episode 103', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/4Vr0XR1oF' },
  { id: 'detective-conan-ep104', episodeNumber: 104, title: 'Episode 104', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/QQkMCSTgw' },
  { id: 'detective-conan-ep105', episodeNumber: 105, title: 'Episode 105', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/hTo9YIUHe' },
  { id: 'detective-conan-ep106', episodeNumber: 106, title: 'Episode 106', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/NkoGEROPL' },
  { id: 'detective-conan-ep107', episodeNumber: 107, title: 'Episode 107', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/b16xy8D5C' },
  { id: 'detective-conan-ep108', episodeNumber: 108, title: 'Episode 108', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/G8OTAg-ld' },
  { id: 'detective-conan-ep109', episodeNumber: 109, title: 'Episode 109', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/fAbtoOvYL' },
  { id: 'detective-conan-ep110', episodeNumber: 110, title: 'Episode 110', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/JUc_-9ReA' },
  { id: 'detective-conan-ep111', episodeNumber: 111, title: 'Episode 111', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/6uqcw0FXe' },
  { id: 'detective-conan-ep112', episodeNumber: 112, title: 'Episode 112', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/aEvv8dZo4' },
  { id: 'detective-conan-ep113', episodeNumber: 113, title: 'Episode 113', thumbnail: DETECTIVE_CONAN_POSTER, watchUrl: 'https://short.icu/RMzsxVhQj' },
];

export function getDetectiveConanEpisodes() {
  return DETECTIVE_CONAN_EPISODES;
} 