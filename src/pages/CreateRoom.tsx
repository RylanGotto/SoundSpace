import React, { useState } from "react";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
  IonLoading,
} from "@ionic/react";
import { useAuth } from "../context";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { useToast } from "../hooks/useToast";
import { CreateRoomForm } from "../components/Form/CreateFormFrom";
import { SpotifyAuthModal } from "../components/Spotify/SpotifyAuthModal";

const CreateRoom: React.FC = () => {
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);

  const { isSpotifyConnected } = useAuth();
  const { formData, loading, updateField, createRoom } = useCreateRoom();
  const {
    showToast,
    toastMessage,
    toastColor,
    showSuccessToast,
    showErrorToast,
    hideToast,
  } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createRoom();

      if (result.success) {
        showSuccessToast("Room created successfully!");

        // Check if user is connected to Spotify
        if (!isSpotifyConnected()) {
          setShowSpotifyModal(true);
        } else {
          console.log("User is already authenticated with Spotify");
          // Could redirect or perform other actions here
        }
      }
    } catch (error: any) {
      showErrorToast(error.message || "Failed to create room");
    }
  };

  const handleSpotifyAuthComplete = () => {
    setShowSpotifyModal(false);
    showSuccessToast("Spotify connected successfully!");
  };

  const handleCloseSpotifyModal = () => {
    setShowSpotifyModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Create a Room</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <CreateRoomForm
          roomname={formData.roomname}
          description={formData.description}
          loading={loading}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
        />

        <SpotifyAuthModal
          isOpen={showSpotifyModal}
          onClose={handleCloseSpotifyModal}
          onAuthComplete={handleSpotifyAuthComplete}
        />

        <IonLoading isOpen={loading} message="Creating room..." />

        <IonToast
          isOpen={showToast}
          onDidDismiss={hideToast}
          message={toastMessage}
          duration={3000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default CreateRoom;
