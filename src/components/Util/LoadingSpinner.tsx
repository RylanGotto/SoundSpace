import React from "react";
import { IonContent, IonSpinner, IonText } from "@ionic/react";

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  fullPage = true,
}) => {
  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: fullPage ? "100%" : "auto",
        padding: "1rem",
        gap: "1rem",
      }}
    >
      <IonSpinner name="crescent" />
      <IonText color="medium" className="ion-text-center">
        {message}
      </IonText>
    </div>
  );

  if (fullPage) {
    return <IonContent className="ion-padding">{content}</IonContent>;
  }

  return content;
};
