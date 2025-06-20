// supabasePlaylistService.ts
import { supabase } from "../lib/supabase";

// ==================== AUTH HELPERS ====================
const getUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.id) throw new Error("User not authenticated");
  return data.user.id;
};

// ==================== PLAYLIST ====================
export const createPlaylist = async (name, description) => {
  const created_by = await getUserId();
  const { data, error } = await supabase
    .from("playlists")
    .insert([{ name, description, created_by }])
    .select();
  if (error) throw error;
  return data[0];
};

export const getPlaylists = async () => {
  const { data, error } = await supabase
    .from("playlists")
    .select(`*, playlist_members(count), playlist_songs(count)`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const getPlaylistDetails = async (playlistId) => {
  const { data, error } = await supabase
    .from("playlists")
    .select(
      `*, playlist_songs_with_scores(*, songs(*), vote_score), playlist_members(user_id, joined_at)`
    )
    .eq("id", playlistId)
    .single();
  if (error) throw error;
  return data;
};

export const deletePlaylist = async (playlistId) => {
  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId);
  if (error) throw error;
};

export const checkPlaylistExists = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from("playlists")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (error || !data?.id) {
    return null;
  }

  return data.id;
};

export const isUserCreator = async () => {
  const userId = await getUserId();
  const { data } = await supabase
    .from("playlists")
    .select("created_by")
    .single();
  return data?.created_by === userId;
};

// ==================== MEMBERSHIP ====================
export const joinPlaylist = async (playlistId) => {
  const user_id = await getUserId();
  await supabase.from("playlist_members").delete().eq("user_id", user_id);
  const { data, error } = await supabase
    .from("playlist_members")
    .insert([{ playlist_id: playlistId, user_id }])
    .select();
  if (error) throw error;
  return data[0];
};

export const leavePlaylist = async (playlistId) => {
  const user_id = await getUserId();
  const { error } = await supabase
    .from("playlist_members")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("user_id", user_id);
  if (error) throw error;
};

// ==================== SONGS ====================
export const addSong = async (
  title,
  artist,
  duration,
  spotifyId,
  youtubeId
) => {
  const { data, error } = await supabase
    .from("songs")
    .insert([
      { title, artist, duration, spotify_id: spotifyId, youtube_id: youtubeId },
    ])
    .select();
  if (error) throw error;
  return data[0];
};

export const addSongToPlaylist = async (playlistId, songData) => {
  const user_id = await getUserId();

  const { data: existing } = await supabase
    .from("songs")
    .select("id")
    .eq("title", songData.title)
    .eq("artist", songData.artist)
    .single();

  const songId =
    existing?.id ||
    (await supabase.from("songs").insert([songData]).select("id").single()).data
      .id;

  const { data, error } = await supabase
    .from("playlist_songs")
    .insert([{ playlist_id: playlistId, song_id: songId, added_by: user_id }])
    .select(`*, songs(*)`);
  if (error) throw error;
  return data[0];
};

export const searchSongs = async (query) => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
    .limit(20);
  if (error) throw error;
  return data;
};

// ==================== VOTES ====================
export const voteSong = async (playlistSongId, voteType) => {
  const user_id = await getUserId();

  const oppositeType = voteType === "upvote" ? "downvote" : "upvote";
  await supabase
    .from("votes")
    .delete()
    .eq("user_id", user_id)
    .eq("playlist_song_id", playlistSongId)
    .eq("vote_type", oppositeType)
    .order("created_at", { ascending: true })
    .limit(1);

  const { data, error } = await supabase
    .from("votes")
    .upsert(
      [{ playlist_song_id: playlistSongId, user_id, vote_type: voteType }],
      {
        onConflict: "playlist_song_id,user_id",
      }
    )
    .select();

  if (error) throw error;
  return data[0];
};

export const removeVote = async (playlistSongId) => {
  const user_id = await getUserId();
  const { error } = await supabase
    .from("votes")
    .delete()
    .eq("playlist_song_id", playlistSongId)
    .eq("user_id", user_id);
  if (error) throw error;
};

export const getUserVote = async (playlistSongId) => {
  const user_id = await getUserId();
  const { data, error } = await supabase
    .from("votes")
    .select("vote_type")
    .eq("playlist_song_id", playlistSongId)
    .eq("user_id", user_id);
  if (error) throw error;
  return data[0]?.vote_type || null;
};

// ==================== SUBSCRIPTIONS ====================
export const subscribeToPlaylistSongs = (playlistId, callback) =>
  supabase
    .channel(`playlist_songs_${playlistId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "playlist_songs",
        filter: `playlist_id=eq.${playlistId}`,
      },
      callback
    )
    .subscribe();

export const subscribeToVotes = (playlistId, callback) =>
  supabase
    .channel(`votes_${playlistId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "votes",
        filter: `playlist_song_id=in.(select id from playlist_songs where playlist_id = ${playlistId})`,
      },
      callback
    )
    .subscribe();

export const subscribeToPlaylistMembers = (playlistId, callback) =>
  supabase
    .channel(`playlist_members_${playlistId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "playlist_members",
        filter: `playlist_id=eq.${playlistId}`,
      },
      callback
    )
    .subscribe();

export const subscribeToPlaylists = (callback) =>
  supabase
    .channel("playlists")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "playlists" },
      callback
    )
    .subscribe();

export const unsubscribeFromChannel = (channel) =>
  supabase.removeChannel(channel);

export const setupPlaylistRealtime = (playlistId) => {
  const songsChannel = subscribeToPlaylistSongs(playlistId, (p) =>
    console.log("Song change:", p)
  );
  const votesChannel = subscribeToVotes(playlistId, (p) =>
    console.log("Vote change:", p)
  );
  const membersChannel = subscribeToPlaylistMembers(playlistId, (p) =>
    console.log("Member change:", p)
  );
  return () => {
    unsubscribeFromChannel(songsChannel);
    unsubscribeFromChannel(votesChannel);
    unsubscribeFromChannel(membersChannel);
  };
};
