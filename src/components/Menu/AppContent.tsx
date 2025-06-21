import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonSplitPane, IonRouterOutlet } from "@ionic/react";
import { useAuth } from "../../context/AuthContext";
import SideMenu from "./SideMenu";
import SpotifyLogin from "../../pages/Spotify/SpotifyLogin";
import SpotifyCallback from "../../pages/Spotify/SpotifyCallback";
import SpotifyDashboard from "../../pages/Spotify/SpotifyDashboard";

// import { Playlist } from "../pages/Playlist";
// import { JoinRoom } from "../pages/JoinRoom";
// import { CreateRoom } from "../pages/CreateRoom";
// import { SpotifyLogin } from "../pages/SpotifyLogin";
// import { SpotifyCallback } from "../pages/SpotifyCallback";
import { LoadingSpinner } from "../Util/LoadingSpinner";
import { Login } from "../../pages/Login";
import Home from "../../pages/Home";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

// Public routes that don't need authentication

const PublicRoutes: React.FC = () => (
  <IonRouterOutlet>
    <Route exact path="/login" component={Login} />
    <Route path="/callback" component={SpotifyCallback} />
    <Route exact path="/dashboard" component={SpotifyDashboard} />
    <Route path="*">
      <Redirect to="/login" />
    </Route>
  </IonRouterOutlet>
);

// Protected routes with SideMenu
const ProtectedRoutes: React.FC = () => (
  <IonSplitPane contentId="main-content">
    <SideMenu />
    <IonRouterOutlet id="main-content">
      <Route exact path="/home" component={Home} />
      <Route path="/callback" component={SpotifyCallback} />
      <Route exact path="/spotify" component={SpotifyLogin} />
      <Route exact path="/dashboard" component={SpotifyDashboard} />

      {/* Default redirect */}
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>

      {/* Fallback */}
    </IonRouterOutlet>
  </IonSplitPane>
);

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  // Render appropriate route structure based on auth state
  return user ? <ProtectedRoutes /> : <PublicRoutes />;
};

export default AppContent;
