export interface VideoEvent {
  _id: string;
  _creationTime: number;
  description: string;
  videoUrl: string;
  captionUrl?: string;
  date: string;
}

export interface YouTubeVideoProps {
  videoId: string;
  title: string;
  description: string;
  date: string;
  onVideoClick: () => void;
}
