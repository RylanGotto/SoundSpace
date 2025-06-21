import React from "react";
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
} from "@ionic/react";
import { home, settings, logOut, add, enter } from "ionicons/icons";
import { useAuth } from "../../context";
import { usePlaylistState } from "../../hooks/usePlaylistState";
import { LoadingSpinner } from "../Util/LoadingSpinner";

// Types for better type safety
interface MenuItem {
  id: string;
  routerLink: string;
  icon: string;
  label: string;
  show: boolean;
}

// Reusable menu item component
const MenuItem: React.FC<{
  item: MenuItem;
  onClick?: () => void;
}> = ({ item, onClick }) => {
  if (!item.show) return null;

  return (
    <IonMenuToggle autoHide={false}>
      <IonItem
        routerLink={item.routerLink}
        routerDirection="none"
        onClick={onClick}
      >
        <IonIcon icon={item.icon} slot="start" />
        <IonLabel>{item.label}</IonLabel>
      </IonItem>
    </IonMenuToggle>
  );
};

// User info component
const UserInfo: React.FC<{ email?: string }> = ({ email }) => (
  <IonItem>
    <IonLabel>
      <p>Signed in as:</p>
      <p>
        <strong>{email}</strong>
      </p>
    </IonLabel>
  </IonItem>
);

// Sign out button component
const SignOutButton: React.FC<{ onSignOut: () => void }> = ({ onSignOut }) => (
  <IonItem>
    <IonButton expand="block" fill="clear" color="danger" onClick={onSignOut}>
      <IonIcon icon={logOut} slot="start" />
      Sign Out
    </IonButton>
  </IonItem>
);

const SideMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { playlistId, playlistExists, isLoading } = usePlaylistState();

  if (isLoading) return <LoadingSpinner />;
  if (playlistExists) {
    console.log("Playlist ID:", playlistId);
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Generate menu items based on state
  const getMenuItems = (): MenuItem[] => [
    {
      id: "home",
      routerLink: "/home",
      icon: home,
      label: "Home",
      show: true,
    },
    {
      id: "playlist",
      routerLink: `/playlist/${playlistId}`,
      icon: settings,
      label: "Playlist",
      show: playlistExists,
    },
    {
      id: "create-room",
      routerLink: "/create_room",
      icon: add,
      label: "Create A Room",
      show: !playlistExists,
    },
    {
      id: "join-room",
      routerLink: "/join_room",
      icon: enter,
      label: "Join A Room",
      show: true,
    },
  ];

  // Show loading state if needed
  if (isLoading) {
    return (
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel>Loading...</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
    );
  }

  const menuItems = getMenuItems();

  return (
    <IonMenu contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonMenuToggle autoHide={false}>
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </IonMenuToggle>

          {user?.email && <UserInfo email={user.email} />}
          <SignOutButton onSignOut={handleSignOut} />
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
