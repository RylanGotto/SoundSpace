import React, { useEffect, useState } from "react";
import { IonPage, IonCard } from "@ionic/react";
import {
  getUserProfile,
  getAccessToken,
  isTokenValid,
  clearTokens,
} from "../../services/spotify/spotifyAuth";
import { useAuth } from "../../context";
import { useHistory } from "react-router-dom";

const SpotifyDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { disconnectSpotify } = useAuth();
  const history = useHistory();

  // React Router v5
  // For React Router v6, use this instead:
  // const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      if (!isTokenValid()) {
        // v5
        // navigate('/'); // v6
        return;
      }

      try {
        const accessToken = getAccessToken();
        const userData = await getUserProfile(accessToken);
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user data:", err);
        setError("Failed to load user data");
        clearTokens();
        setTimeout(() => history.push("/"), 2000); // v5
        // setTimeout(() => navigate('/'), 2000); // v6
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [history]); // v5 dependency
  // }, [navigate]); // v6 dependency

  const handleLogout = () => {
    disconnectSpotify(history, "/home");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Loading your Spotify data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <IonPage>
      <IonCard>
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <h1>Spotify Dashboard</h1>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>

          {user && (
            <div
              style={{
                backgroundColor: "#f9f9f9",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                {user.images?.[0] && (
                  <img
                    src={user.images[0].url}
                    alt="Profile"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div>
                  <h2 style={{ margin: "0 0 10px 0" }}>{user.display_name}</h2>
                  <p
                    style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}
                  >
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p
                    style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}
                  >
                    <strong>Followers:</strong> {user.followers?.total || 0}
                  </p>
                  <p
                    style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}
                  >
                    <strong>Country:</strong> {user.country}
                  </p>
                  <p
                    style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}
                  >
                    <strong>Subscription:</strong> {user.product || "Free"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </IonCard>
    </IonPage>
  );
};

export default SpotifyDashboard;
