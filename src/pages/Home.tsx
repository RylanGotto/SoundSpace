import React, { useEffect } from "react";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import { useAuth } from "../context";
import SpotifyDashboard from "./Spotify/SpotifyDashboard";
const Home: React.FC = () => {
  const { user } = useAuth();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Home </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Welcome!</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Hello, {user?.email}</p>
            <p>You are successfully authenticated and can see the side menu.</p>
          </IonCardContent>
        </IonCard>
      </IonContent>
      <IonContent>
        <SpotifyDashboard />
      </IonContent>
    </IonPage>
  );
};

export default Home;
