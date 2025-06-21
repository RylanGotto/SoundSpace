import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
} from "@ionic/react";

interface CreateRoomFormProps {
  roomname: string;
  description: string;
  loading: boolean;
  onFieldChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreateRoomForm: React.FC<CreateRoomFormProps> = ({
  roomname,
  description,
  loading,
  onFieldChange,
  onSubmit,
}) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Create a Room</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <form onSubmit={onSubmit}>
          <IonItem>
            <IonLabel position="stacked">Room Name *</IonLabel>
            <IonInput
              type="text"
              value={roomname}
              onIonInput={(e) => onFieldChange("roomname", e.detail.value!)}
              required
              disabled={loading}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonInput
              type="text"
              value={description}
              onIonInput={(e) => onFieldChange("description", e.detail.value!)}
              disabled={loading}
            />
          </IonItem>
          <IonButton
            type="submit"
            expand="block"
            className="ion-margin-top"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Room"}
          </IonButton>
        </form>
      </IonCardContent>
    </IonCard>
  );
};
