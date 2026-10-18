// Google Maps JavaScript API Loader with script caching
let googleMapsPromise = null;

export function loadGoogleMapsScript(apiKey) {
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return Promise.reject(new Error('NO_API_KEY'));
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if script element is already on page
    const existing = document.getElementById('google-maps-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps));
      existing.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&language=en&region=MY`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps script loaded but window.google.maps is not available'));
      }
    };

    script.onerror = (err) => {
      googleMapsPromise = null;
      reject(err);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
