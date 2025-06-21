// src/components/SpotifyCallback.jsx - Compatible with React Router v5 & v6
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom"; // v5 compatible
import {
  exchangeCodeForToken,
  saveTokens,
} from "../../services/spotify/spotifyAuth";
const SpotifyCallback = () => {
  const history = useHistory();
  const location = useLocation();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const handleCallback = async () => {
      // React Router v5 - parse URL manually
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const error = urlParams.get("error");

      if (error) {
        setStatus(`Authentication failed: ${error}`);
        setTimeout(() => history.push("/"), 3000); // v5
        // setTimeout(() => navigate('/'), 3000); // v6
        return;
      }

      if (!code) {
        setStatus("No authorization code received");
        setTimeout(() => history.push("/"), 3000); // v5
        // setTimeout(() => navigate('/'), 3000); // v6
        return;
      }

      try {
        const tokenData = await exchangeCodeForToken(code, state);
        saveTokens(tokenData);

        setStatus("Authentication successful! Redirecting...");
        setTimeout(() => history.push("/dashboard"), 1000); // v5
        // setTimeout(() => navigate('/dashboard'), 1000); // v6
      } catch (error) {
        console.error("Token exchange failed:", error);
        setStatus("Authentication failed. Redirecting...");
        setTimeout(() => history.push("/"), 3000); // v5
        // setTimeout(() => navigate('/'), 3000); // v6
      }
    };

    handleCallback();
  }, [location.search, history]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "20px",
      }}
    >
      <div
        className="spinner"
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #1DB954",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <p>{status}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SpotifyCallback;
