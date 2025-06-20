// types/playlist.ts
export type AlbumImage = {
  url: string;
  height: number;
  width: number;
};

export type SpotifyArtist = {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
  href?: string;
  type?: string;
  uri?: string;
};

export type DatabaseSong = {
  id: string;
  title: string;
  artist: string;
  duration: number | null;
  spotify_id: string | null;
  youtube_id: string | null;
  created_at: string | null;
  song_id: string | null;
  album: string | null;
  spotify_uri: string | null;
  spotify_url: string | null;
  preview_url: string | null;
  explicit: boolean;
  popularity: number | null;
  track_number: number | null;
  disc_number: number | null;
  is_playable: boolean;
  is_local: boolean;
  album_id: string | null;
  album_type: string | null;
  album_url: string | null;
  album_images: AlbumImage[] | null;
  release_date: string | null;
  total_tracks: number | null;
  artists: SpotifyArtist[] | null;
  external_ids: Record<string, string> | null;
  votes: number;
};

export type PlaylistSong = {
  id: string;
  songs: Song;
  votes: [];
  vote_score: number;
};

export type PlaylistSummary = {
  id: string;
  name: string;
  creator_id: string;
  album: string;
  is_playing: boolean;
  volume: number;
  created_at: string;
  updated_at: string;
  playlist_members: [];
  playlist_songs_with_scores: PlaylistSong[];
  unplayed_songs: number;
};
