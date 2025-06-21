import React from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
} from "@ionic/react";
import { useAuth } from "../../context";

interface SpotifyAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthComplete: () => void;
}

export const SpotifyAuthModal: React.FC<SpotifyAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthComplete,
}) => {
  const { connectSpotify } = useAuth();

  const handleConnectSpotify = async () => {
    try {
      await connectSpotify();
      onAuthComplete();
    } catch (error) {
      console.error("Failed to connect to Spotify:", error);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Connect to Spotify</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={onClose}>
              Skip
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <h2>Connect your Spotify account</h2>
          <p>
            To manage your playlist and add songs, please connect your Spotify
            account.
          </p>
          <IonButton
            expand="block"
            onClick={handleConnectSpotify}
            className="ion-margin-top"
          >
            Connect to Spotify
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};
