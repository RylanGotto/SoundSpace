import { useEffect, useState } from "react";
import {
  checkPlaylistExists,
  subscribeToPlaylists,
  unsubscribeFromChannel,
} from "../services/playlistService";

export const usePlaylistState = () => {
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPlaylist = async () => {
      try {
        const id = await checkPlaylistExists(); // This now returns ID or null
        if (isMounted) {
          setPlaylistId(id);
        }
      } catch (err) {
        console.error("Error checking playlist:", err);
        if (isMounted) {
          setPlaylistId(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPlaylist();

    const channel = subscribeToPlaylists(async () => {
      const id = await checkPlaylistExists();
      if (isMounted) {
        setPlaylistId(id);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeFromChannel(channel);
    };
  }, []);

  return {
    playlistId,
    playlistExists: !!playlistId,
    isLoading,
  };
};
