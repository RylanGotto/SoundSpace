import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonToast,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { supabase } from "../lib/supabase";
import { useHistory } from "react-router-dom";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
  const history = useHistory();

  const handleAuth = async () => {
    if (!email || !password) {
      setToastMessage("Please fill in all fields");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        history.replace("/home");
        // Redirect will happen automatically via AuthContext
      } else {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        history.replace("/home");
        setToastMessage("Check your email for verification link!");
        setShowToast(true);
      }
    } catch (error: any) {
      setToastMessage(error.message);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              {isLogin ? "Sign In" : "Create Account"}
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonSegment
              value={isLogin ? "login" : "register"}
              onIonChange={(e) => setIsLogin(e.detail.value === "login")}
            >
              <IonSegmentButton value="login">
                <IonLabel>Sign In</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="register">
                <IonLabel>Sign Up</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            <IonItem className="ion-margin-top">
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
                placeholder="Enter your email"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                placeholder="Enter your password"
              />
            </IonItem>

            <IonButton
              expand="full"
              onClick={handleAuth}
              disabled={loading}
              className="ion-margin-top"
            >
              {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
        />
      </IonContent>
    </IonPage>
  );
};
