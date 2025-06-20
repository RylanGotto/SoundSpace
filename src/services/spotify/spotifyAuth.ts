// src/utils/spotifyAuth.js
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI =
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI || "http://127.0.0.1:8101/callback";
const SCOPES =
  "user-read-private user-read-email playlist-read-private user-top-read";

// Generate random string for state parameter
const generateRandomString = (length = 16) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Redirect to Spotify authorization
export const redirectToSpotifyAuth = () => {
  const state = generateRandomString();
  localStorage.setItem("spotify_auth_state", state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    state: state,
    show_dialog: "true",
  });
  console.log(params.toString());
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code, state) => {
  const storedState = localStorage.getItem("spotify_auth_state");

  if (state !== storedState) {
    throw new Error("State mismatch - possible CSRF attack");
  }

  // For client-side apps, we need to use PKCE or a backend proxy
  // This example uses a simple approach - in production, use PKCE or backend
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRRET),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
      // client_id: CLIENT_ID,
      // Note: For security, client_secret should not be exposed in frontend
      // Consider using PKCE flow or a backend proxy
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  const data = await response.json();
  localStorage.removeItem("spotify_auth_state");
  return data;
};

// Get user profile
export const getUserProfile = async (accessToken) => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
};

// Token management
export const saveTokens = (tokenData) => {
  localStorage.setItem("spotify_access_token", tokenData.access_token);
  if (tokenData.refresh_token) {
    localStorage.setItem("spotify_refresh_token", tokenData.refresh_token);
  }
  // Calculate expiry time
  const expiryTime = Date.now() + tokenData.expires_in * 1000;
  localStorage.setItem("spotify_token_expiry", expiryTime.toString());
};

export const getAccessToken = () => {
  return localStorage.getItem("spotify_access_token");
};

export const isTokenValid = () => {
  const token = getAccessToken();
  const expiryTime = localStorage.getItem("spotify_token_expiry");

  if (!token || !expiryTime) return false;

  return Date.now() < parseInt(expiryTime);
};

export const clearTokens = () => {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_token_expiry");
};
