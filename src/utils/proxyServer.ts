// Enhanced proxy server for handling CORS when fetching from watchanimeworld.in
// Uses Vite dev server proxy as primary method, with external proxy services as fallback

export async function proxyFetch(url: string): Promise<string> {
  try {
    // First try the Vite dev server proxy (most reliable in development)
    const viteProxyUrl = `/api/proxy${url.replace('https://watchanimeworld.in', '')}`;
    console.log(`🔄 Trying Vite proxy: ${viteProxyUrl}`);
    
    const response = await fetch(viteProxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (response.ok) {
      const text = await response.text();
      console.log(`✅ Vite proxy succeeded`);
      return text;
    } else {
      console.warn(`❌ Vite proxy failed with status ${response.status}`);
    }
  } catch (error) {
    console.warn(`❌ Vite proxy failed:`, error);
  }
  
  // Fallback to external proxy services
  return await proxyFetchWithFallback(url);
}

// Enhanced proxy services with better error handling and more reliable services
export async function proxyFetchWithFallback(url: string): Promise<string> {
  const proxyServices = [
    // Most reliable services first (reordered for better success rate)
    `https://thingproxy.freeboard.io/fetch/${url}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&method=raw`,
    // Additional fallbacks with different approaches
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://thingproxy.freeboard.io/fetch/${url}?method=GET`,
    // Move codetabs to the end as it has CORS issues
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}&method=GET`
  ];
  
  for (const proxyUrl of proxyServices) {
    try {
      console.log(`🔄 Trying external proxy: ${proxyUrl}`);
      
      // Use different fetch options for different proxy services
      const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      };
      
      // For codetabs, try without preflight to avoid CORS issues
      if (proxyUrl.includes('codetabs.com')) {
        fetchOptions.mode = 'no-cors';
        fetchOptions.credentials = 'omit';
      }
      
      const response = await fetch(proxyUrl, fetchOptions);
      
      if (response.ok) {
        const text = await response.text();
        console.log(`✅ External proxy succeeded: ${proxyUrl}`);
        return text;
      } else {
        console.warn(`❌ External proxy failed with status ${response.status}: ${proxyUrl}`);
      }
    } catch (error) {
      console.warn(`❌ External proxy service failed: ${proxyUrl}`, error);
      continue;
    }
  }
  
  throw new Error('All proxy services failed');
} 