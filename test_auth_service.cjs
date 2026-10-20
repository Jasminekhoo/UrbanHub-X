const key = 'AIzaSyD_J2yLcJH2jCMHZ-hPZUbYvuqQOFQe9h4';

async function testJsApiAuth() {
  // Test 1: Call Maps JS API bootstrap
  const jsRes = await fetch(`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry`, {
    headers: {
      'Referer': 'http://localhost:3000/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const jsText = await jsRes.text();
  console.log('JS Bootstrap Status:', jsRes.status);
  
  // Test 2: Check Maps JS QuotaService / Authenticate endpoint
  // Google Maps JS API uses:
  // https://maps.googleapis.com/maps/api/js/AuthenticationService.Authenticate?1shttp%3A%2F%2Flocalhost%3A3000&callback=_xdc_._0&key=...
  const authUrl = `https://maps.googleapis.com/maps/api/js/AuthenticationService.Authenticate?1shttp%3A%2F%2Flocalhost%3A3000&callback=_xdc_._0&key=${key}&token=123`;
  const authRes = await fetch(authUrl, {
    headers: {
      'Referer': 'http://localhost:3000/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  console.log('AuthenticationService Status:', authRes.status);
  const authText = await authRes.text();
  console.log('AuthenticationService Response:', authText);

  // Test 3: Check Geocoding API
  const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=3.1872,101.5168&key=${key}`);
  const geoData = await geoRes.json();
  console.log('Geocoding:', geoData.status, geoData.error_message || 'OK');
}

testJsApiAuth().catch(console.error);
