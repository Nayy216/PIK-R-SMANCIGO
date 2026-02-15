
export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

export interface Memory {
  id: string;
  to: string;
  message: string;
  songTitle: string;
  songChannel: string;
  videoId: string;
  timestamp: number;
}

export interface Contact {
  name: string;
  role: string;
  description: string;
  instagram: string;
  title: string;
}
