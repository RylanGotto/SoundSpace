import React from "react";
import { Redirect, Route, Switch, Router } from "react-router-dom";
import { IonSplitPane, IonRouterOutlet } from "@ionic/react";
import { useAuth } from "../../context/AuthContext";
import SideMenu from "./SideMenu";
import SpotifyLogin from "../../pages/Spotify/SpotifyLogin";
import SpotifyCallback from "../../pages/Spotify/SpotifyCallback";

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
    {/* Your login component */}

    {/* <Route path="*">
      <Redirect to="/login" />
    </Route> */}
  </IonRouterOutlet>
);

// Protected routes with SideMenu
const ProtectedRoutes: React.FC = () => (
  <IonSplitPane contentId="main-content">
    <SideMenu />
    <IonRouterOutlet id="main-content">
      <Route exact path="/home" component={Home} />
      <Route path="/callback" component={SpotifyCallback} />

      {/* <Route exact path="/playlist/:playlistId" component={Playlist} />
      <Route exact path="/join_room">
        <JoinRoom />
      </Route>
      <Route exact path="/create_room">
        <CreateRoom />
      </Route> */}

      {/* Spotify routes - these might need auth too */}
      <Route exact path="/spotify" component={SpotifyLogin} />

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
  const history = useHistory();

  useEffect(() => {
    // Redirect to /login if user becomes null
    if (!loading && !user && history.location.pathname !== "/login") {
      history.replace("/login");
    }
  }, [user, loading, history]);

  if (loading) {
    return <div>Loading...</div>;
  }
  // Render appropriate route structure based on auth state
  return user ? <ProtectedRoutes /> : <PublicRoutes />;
};

export default AppContent;
