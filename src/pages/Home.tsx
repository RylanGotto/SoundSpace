import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import { useAuth } from "../context";
const Home: React.FC = () => {
  const { isSpotifyConnected, disconnectSpotify } = useAuth();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Home {isSpotifyConnected() ? "Connected" : "Not Connected"}
            <IonButton onClick={disconnectSpotify}>
              Disconnect Spotify
            </IonButton>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>Home Component Works!</h1>
        <IonButton>Test Button</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
