import { useState } from "react";
import { createPlaylist, joinPlaylist } from "../services/playlistService";

interface UseCreateRoomReturn {
  formData: {
    roomname: string;
    description: string;
  };
  loading: boolean;
  updateField: (field: string, value: string) => void;
  createRoom: () => Promise<{ success: boolean; playlistId?: string }>;
}

export const useCreateRoom = (): UseCreateRoomReturn => {
  const [formData, setFormData] = useState({
    roomname: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const createRoom = async (): Promise<{
    success: boolean;
    playlistId?: string;
  }> => {
    if (!formData.roomname.trim()) {
      throw new Error("Please fill in all required fields");
    }

    setLoading(true);
    try {
      const result = await createPlaylist(
        formData.roomname,
        formData.description
      );

      if (result.code === "23505") {
        throw new Error("Only one playlist can exist");
      }

      await joinPlaylist(result.id);
      return { success: true, playlistId: result.id };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    updateField,
    createRoom,
  };
};
